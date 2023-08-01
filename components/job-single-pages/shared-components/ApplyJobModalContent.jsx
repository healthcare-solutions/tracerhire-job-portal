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
import { BallTriangle } from 'react-loader-spinner'
// import { v4 } from "uuid";

const ApplyJobModalContent = ({ company }) => {
  //console.log("company",company.user_id);

  // const { notificationData, notificationError } = supabase
  //                 .from('notification')
  //                 .insert([
  //                     {
  //                         type: "type",
  //                         cust_id: "012c9852-2bf4-4ecd-854d-eadc6c9470e9",
  //                         job_id: "wJRw6FsoWOW7mDhwUNPJdfH4U322",
  //                         user_id: "63897a42-a4a2-4e05-b72f-ebb41c85fb35",
  //                         application_id: "text",
  //                         notification_text: "message",
  //                         created_at: "2023-11-11"
  //                     }
  //                 ]);
  //                 console.log("notificationError",notificationError);
  //                 console.log("notificationData",notificationData);

  const [licenseNumber, setLicenseNumber] = useState("");

  const [licenseNumberError, setLicenseNumberError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false)
  const [termsConditionsError, setTermsConditionsError] = useState("");

  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter()
  const jobId = router.query.id;
  function handleFileInputChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  const checkHandler = () => {
    setIsChecked(!isChecked)
  }

  const validateForm = () => {
    let isValid = true;
    if (!licenseNumber) {
      setLicenseNumberError("Please enter your License Number");
      isValid = false;
    }
    else if (!isChecked) {
      setTermsConditionsError("Please check terms and conditions");
      isValid = false;
    }
    return isValid;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const dateFormat = () => {
      const date = new Date()
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
    }
    if (validateForm()) {
      setIsLoading(true);
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
                cust_id: company.user_id,
                email: user.email,
                name: user.name,
                status: "New",
                candidate_message: message,
                license_nbr: licenseNumber,
                doc_name: selectedFile.name,
                doc_size: selectedFile.size,
                doc_typ: selectedFile.type,
                job_id: jobId,
                doc_dwnld_url: docURL
              }
            ]).select();
          //console.log("applications",applications,"applicationsError",applicationsError);
          if (applications.length > 0) {
            let appID = applications[0].application_id;
            let type = "Applied For Job";
            let messageEmployer = user.name + " Successfully Applied for job " + company.job_title + " with licence number " + applications[0].license_nbr + " Over " + company.job_address;
            let messageUser = "You have Successfully Applied for job " + company.job_title + " with licence number " + applications[0].license_nbr + " Over " + company.job_address;
            const { notificationData, notificationError } = await supabase
              .from('notification')
              .insert([
                {
                  type: type,
                  cust_id: company.user_id,
                  job_id: applications[0].job_id,
                  user_id: company.user_id,
                  application_id: appID,
                  notification_text: messageEmployer,
                  created_at: dateFormat()
                }
              ]).select();
            //console.log("notificationData",notificationData);

            const { notificationUserData, notificationUserError } = await supabase
              .from('notification')
              .insert([
                {
                  type: type,
                  cust_id: company.user_id,
                  job_id: applications[0].job_id,
                  user_id: userId,
                  application_id: appID,
                  notification_text: messageUser,
                  created_at: dateFormat()
                }
              ]).select();
            //console.log("notificationUserData",notificationUserData);
          }

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
                jobCompAdd: company.job_comp_add,
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
            setTimeout(() => {
              location.reload();
            }, 2000);
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
    <form className="default-form job-apply-form overflow-x-hidden" onSubmit={handleSubmit}>
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
            onChange={(e) => {
              setMessage(e.target.value);
              setMessageError("");
            }}
          ></textarea>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
            <input
              type="checkbox"
              name="remember-me"
              id="rememberMe"
              checked={isChecked}
              onChange={checkHandler}
            />
            <label
              htmlFor="rememberMe" className="remember">
              <span className="custom-checkbox"></span> You accept our{" "}
              <span data-bs-dismiss="modal">
                <Link href="/terms">
                  Terms and Conditions and Privacy Policy
                </Link>
                {termsConditionsError && <div className="required">{termsConditionsError}</div>}
              </span>
            </label>
          </div>
        </div>
        {/* End .col */}
        {/* //JOB1HNH */}
        {
          isLoading ? <div className="col-lg-12 col-md-12 col-sm-12 form-group">
            <div style={{ width: '20%', margin: "auto" }}>
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#FF0000"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
          </div> : <div className="col-lg-12 col-md-12 col-sm-12 form-group">
            <button
              className="theme-btn btn-style-one w-100"
              type="submit"
              name="submit-form"
            >
              Apply Job
            </button>
          </div>
        }


        {/* End .col */}
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
