import Link from "next/link";
import { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../common/form/firebase";
import { supabase } from "../../../config/supabaseClient";
import { toast } from "react-toastify";
import axios from 'axios'

const ApplyInstantView = ({ company }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [licenseNumberError, setLicenseNumberError] = useState("");
  const [guestSelectedFile, setGuestSelectedFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [termsConditionsError, setTermsConditionsError] = useState("");

  const router = useRouter();
  const jobId = router.query.id;
  function handleFileInputChange(event) {
    setGuestSelectedFile(event.target.files[0]);
  }

  const checkHandler = () => {
    console.log("Check Handler Called.....");
    setIsChecked(!isChecked)
  }

  const validateForm = () => {
    console.log("isChecked",isChecked);
    let isValid = true;
    if (!firstName) {
      setFirstNameError("Please enter your first name");
      isValid = false;
    }
    else if (!lastName) {
      setLastNameError("Please enter your last name");
      isValid = false;
    }
    else if (!email) {
      setEmailError("Please enter your email address");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    else if (!licenseNumber) {
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
    if (validateForm()) {
      if (guestSelectedFile) {
        let file;
        let fileTimestamp = Date.now()

        // upload document to applications/cv folder
        const { data: guestFileUploadSuccess, error: guestFileUploadError } = await supabase
          .storage
          .from('applications')
          .upload('cv/' + fileTimestamp + '-' + guestSelectedFile.name, guestSelectedFile, file);
        if (guestFileUploadError) {
          if (guestFileUploadError.error == "Payload too large") {
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
            .getPublicUrl('cv/' + fileTimestamp + '-' + guestSelectedFile.name)
          if (docURLError) {
            console.warn('Failed to get download URL for file')
          }

          // save applied application
          const { data: applications, error: applicationsError } = await supabase
            .from('applications')
            .insert([
              {
                email: email,
                name: firstName + " " + lastName,
                license_nbr: licenseNumber,
                doc_name: guestSelectedFile.name,
                doc_size: guestSelectedFile.size,
                doc_typ: guestSelectedFile.type,
                job_id: jobId,
                doc_dwnld_url: docURL,
                status: "New",
                cust_id: company.user_id
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

            const fileBase64 = await toBase64(guestSelectedFile)

            axios({
              method: 'POST',
              url: '/api/mail',
              data: {
                name: firstName + " " + lastName,
                redirectionUrl: `https://immensecareer.com`,
                time: time.toLocaleString('en-US'),
                jobId: jobId,
                jobTitle: company.job_title,
                jobCompAdd: company.job_comp_add,
                attachments: [
                  {
                    content: fileBase64,
                    filename: guestSelectedFile.name,
                    type: guestSelectedFile.type,
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
      } else {
        console.warn("No file selected.");
      }
    }
  }

  return (
    <div className="widget-content">
      <form className="default-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name<span className="required"> (required)</span></label>
          <input
            type="text"
            name="tracer-hire-first_name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError("");
            }}
            required
          />
          {firstNameError && <div className="required">{firstNameError}</div>}
        </div>
        <div className="form-group">
          <label>Last Name<span className="required"> (required)</span></label>
          <input
            type="text"
            name="tracer-hire-last_name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError("");
            }}
            required
          />
          {lastNameError && <div className="required">{lastNameError}</div>}
        </div>
        <div className="form-group">
          <label>Email Address<span className="required"> (required)</span></label>
          <input
            type="email"
            name="tracer-hire-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="Enter your email"
            required
          />
          {emailError && <div className="required">{emailError}</div>}
        </div>
        {/* name */}

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
          <div className="uploading-outer apply-cv-outer">
            <div>
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*, application/pdf"
                id="upload"
                required
                onChange={handleFileInputChange}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                Upload CV (doc, docx, pdf)
                {guestSelectedFile && <p>Selected file: {guestSelectedFile.name}</p>}
                {!guestSelectedFile && <label className="required">Please select a file before Apply</label>}
              </label>
              <label htmlFor="max_upload_size"> Max size 5MB allowed </label>
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
            <div className="row">
              <div className="col-md-1">
              <input
              type="checkbox"
              name="remember-me"
              id="rememberMe"
              style={{display:'block',position:'relative', top:10}}
              checked={isChecked}
              onChange={() => checkHandler()}
            />
              </div>
              <div className="col-md-11">
              <span
              htmlFor="rememberMe" className="remember">
              <span className="custom-checkbox"></span> You accept our{" "}
              <span data-bs-dismiss="modal">
                <Link href="/terms">
                  Terms and Conditions and Privacy Policy
                </Link>
                {termsConditionsError && <div className="required">{termsConditionsError}</div>}
              </span>
            </span>
              </div>
            </div>
            
            
          </div>
        </div>
        {/* End .col */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            onClick={handleSubmit}
          >
            Apply as a Guest
          </button>
        </div>
        {/* login */}
      </form>
    </div>
  );
};

export default ApplyInstantView;
