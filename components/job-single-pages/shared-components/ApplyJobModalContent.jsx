import Link from "next/link";
import { useState } from "react";
import { db, storage } from "../../common/form/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../config/supabaseClient";
import axios from "axios";
// import { v4 } from "uuid";

const ApplyJobModalContent = ({company}) => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [licenseNumberError, setLicenseNumberError] = useState("");

  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter()
  const jobId = router.query.id;
  function handleFileInputChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  const validateForm = () => {
    let isValid = true;
    if (!licenseNumber) {
      setLicenseNumberError("Please enter your License Number");
      isValid = false;
    }
    return isValid;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        if (selectedFile) {
          let file;
          let fileTimestamp = Date.now()

          // upload document to applications/cv folder
          const { data: fileUploadSuccess, error: fileUploadError } = await supabase
              .storage    
              .from('applications')
              .upload('cv/' + fileTimestamp + '-' + selectedFile.name, selectedFile, file);
          if (fileUploadError) {
            if (fileUploadError.error == "Payload too large") {
              toast.error('Failed to upload attachment.  Attachment size exceeded maximum allowed size!', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            } else {
              toast.error('System is unavailable.  Please try again later or contact tech support!', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            }
          } else {
            // get document downloadable url
            const { data: docURL, error: docURLError } = supabase
                .storage
                .from('applications')
                .getPublicUrl('cv/' + fileTimestamp + '-' + selectedFile.name)
            if (docURLError) {
              console.warn('Failed to get download URL for file')
            }

            // save applied application
            const { data: applications, error: applicationsError } = await supabase
                .from('applications')
                .insert([
                  {
                    user_id: userId,
                    email: user.email,
                    name: user.name,
                    license_nbr: licenseNumber,
                    doc_name: selectedFile.name,
                    doc_size: selectedFile.size,
                    doc_typ: selectedFile.type,
                    job_id: jobId,
                    doc_dwnld_url: docURL
                  }
                ])

            if (applicationsError) {
              toast.error('Error while Applying in this job, Please try again later!', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            } else {
              let time = new Date()
              const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                  if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                  }
                  resolve(encoded);
                };
                reader.onerror = reject;
            });

              const fileBase64 = await toBase64(selectedFile)

                axios({
                  method: 'POST',
                  url: '/api/mail',
                  data: {
                    name: user.name,
                    redirectionUrl: `https://immensecareer.com`,
                    time: time.toLocaleString('en-US'),
                    jobId: jobId,
                    jobTitle: company.job_title,
                    attachments: [
                      {
                        content: fileBase64,
                        filename: selectedFile.name,
                        type: selectedFile.type,
                        disposition: "attachment"
                      }
                    ]
                  }
                })       
              // open toast
              toast.success('Successfully Applied in this job!', {
                position: "bottom-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            }
          }
        }
        else {
          toast.error('Please upload your CV before Apply.', {
              position: "bottom-right",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
          });
        }
    }
  }

  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="uploading-outer apply-cv-outer">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="application/pdf, application/msword"
                id="upload"
                required
                onChange={handleFileInputChange}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                Upload CV (.doc, .docx, .pdf) Max size 5MB allowed
                {selectedFile && <p style={{ color: '#14A24A', fontWeight: '500' }}>Selected file: {selectedFile.name}</p>}
                {!selectedFile && <label className="required">Please select a file before Apply</label>}
              </label>
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label>License Number<span className="required"> (required)</span></label>
          <input
            type="text"
            name="tracer-hire-license_number"
            value={licenseNumber}
            onChange={(e) => {
              setLicenseNumber(e.target.value);
              setLicenseNumberError("");
            }}
            placeholder="enter your license number to verify your eligibilty"
          />
          {licenseNumberError && <div className="required">{licenseNumberError}</div>}
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <textarea
            className="darma"
            name="message"
            placeholder="Message"
          ></textarea>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
            <input type="checkbox" name="remember-me" id="rememberMe" />
            <label htmlFor="rememberMe" className="remember">
              <span className="custom-checkbox"></span> You accept our{" "}
              <span data-bs-dismiss="modal">
                <Link href="/terms">
                  Terms and Conditions and Privacy Policy
                </Link>
              </span>
            </label>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            name="submit-form"
          >
            Apply Job
          </button>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
