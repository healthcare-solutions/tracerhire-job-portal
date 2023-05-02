import Map from "../../../Map";
import Select from "react-select";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const apiKey = process.env.NEXT_PUBLIC_JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';


// load google map api js
function loadAsyncScript(src) {
    return new Promise(resolve => {
        const script = document.createElement("Script");
        Object.assign(script, {
            type: "text/javascript",
            async: true,
            src
        })
        script.addEventListener("load", () => resolve(script));
        document.head.appendChild(script);
    })
}

const addJobFields = {
  jobTitle: "",
  jobDesc: "",
  jobType: "",
  salary: "",
  salaryRate: "",
  education: "",
  exp: "",
  address: "",
  completeAddress: ""
}

const submitJobPost = async (
  { jobTitle, jobDesc, jobType, salary, salaryRate, education, exp, completeAddress, address },
  setJobData,
  user
) => {
    if (jobTitle && jobDesc && jobType && address) {
        try {
            // const res = await auth.createUserWithEmailAndPassword(email, password);
            // const user = res.user;
/*
            console.log(
              jobTitle,
              jobDesc,
              //email,
              //username,
              //specialism,
              jobType,
              salary,
              salaryRate,
              education,
              exp,
              //gender,
              //industy,
              //qualification,
              //deadline,
              country,
              city,
              address
            );
 */
        // const db = getFirestore();

        // await addDoc(collection(db, "jobs"), {
        //   jobTitle,
        //   jobDesc,
        //   //email,
        //   //username,
        //   //specialism,
        //   jobType,
        //   salary,
        //   salaryRate,
        //   education,
        //   exp,
        //   //gender,
        //   //industy,
        //   //qualification,
        //   //deadline,
        //   //country,
        //   //city,
        //   address,
        //   user: user.id,
        //   createdOn: new Date()
        // });

        const { data, error } = await supabase
            .from('jobs')
            .insert([
              { 
                user_id: user.id,
                job_title: jobTitle,
                job_desc: jobDesc,
                job_type: jobType,
                experience: exp,
                education: education,
                salary: salary,
                salary_rate: salaryRate,
                job_address: address,
                job_comp_add: completeAddress,
              }
        ])
    

        // open toast
        toast.success('Job Posted successfully', {
            position: "bottom-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setJobData(JSON.parse(JSON.stringify(addJobFields)))
        
      } catch (err) {
        // open toast
        toast.error('Error while saving your job application, Please try again later or contact tech support', {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        // console.warn(err);
      }
    } else {
        // open toast
        toast.error('Please fill all the required fields.', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};

const PostBoxForm = () => {
  // const [jobTitle, setJobTitle] = useState("");
  // const [jobDesc, setJobDesc] = useState("");
  //const [email, setEmail] = useState("");
  //const [username, setUsername] = useState("");
  //const [specialism, setSpecialism] = useState([]);
  // const [jobType, setJobType] = useState("");
  // const [salary, setSalary] = useState("");
  // const [salaryRate, setSalaryRate] = useState("");
  // const [education, setEducation] = useState("");
  // const [exp, setExp] = useState("");
  //const [gender, setGender] = useState("");
  //const [industy, setIndustry] = useState("");
  //const [qualification, setQualification] = useState("");
  //const [deadline, setDeadline] = useState("");
  //const [country, setCountry] = useState("");
  //const [city, setCity] = useState("");
  // const [address, setAddress] = useState("");
  const user = useSelector(state => state.candidate.user)
  const [jobData, setJobData] = useState(JSON.parse(JSON.stringify(addJobFields)));
  const { jobTitle, jobDesc, jobType, salary, salaryRate, education, exp, address, completeAddress } = useMemo(() => jobData, [jobData])

  const searchInput = useRef(null);

  // init google map script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
        return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const location = autocomplete.getPlace();
    setJobData((previousState) => ({ 
      ...previousState,
      address: searchInput.current.value
    }))
  }

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, {
        types: ['(cities)']
      }
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete))

  }

  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);
/*
  const specialisms = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Managemnet", label: "Managemnet" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
    { value: "Engineer", label: "Engineer" },
  ];
 */

  return (
    <form className="default-form">     
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
          <input
            type="text"
            name="immense-career-jobTitle"
            value={jobTitle}
            required
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                jobTitle: e.target.value
              }))
            }}
            placeholder="Job Title"
          />
        </div>
        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description <span className="required">(required)</span></label>
          <SunEditor 
            setOptions={{
            buttonList: [
              ["fontSize", "formatBlock"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["link"],
              ["preview", "print"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
          setDefaultStyle="color:black;"
          onChange={(e) => {
            setJobData((previousState) => ({ 
              ...previousState,
              jobDesc: e
            }))
          }}
          />
        </div>
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Email Address <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="name"
            placeholder="example@test.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
 */}
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Username</label>
          <input
            type="text"
            name="name"
            placeholder=""
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
 */}
        {/* <!-- Search Select --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms </label>
          <Select
            defaultValue={[specialisms[2]]}
            isMulti
            name="colors"
            options={specialisms}
            className="basic-multi-select"
            classNamePrefix="select"
            value={specialism}
            onChange={(e) => {
              // const updatedOptions = [...e.target.options]
              //   .filter((option) => option.selected)
              //   .map((x) => x.value);
              // console.log("updatedOptions", updatedOptions);
              // setSpecialism(updatedOptions);
              setSpecialism(e || []);
            }}
          />
        </div>
 */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type <span className="required"> (required)</span></label>
          <select
            className="chosen-single form-select"
            value={jobType}
            required
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                jobType: e.target.value
              }))
            }}
          >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
          </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience<span className="optional"> (optional)</span></label>
          <select
            className="chosen-single form-select"
            value={exp}
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                exp: e.target.value
              }))
            }}
          >
            <option></option>
            <option>1 year</option>
            <option>2 years</option>
            <option>3 years</option>
            <option>4 years</option>
            <option>5 years</option>
            <option>6 years</option>
            <option>7 years</option>
            <option>8 years</option>
            <option>9 years</option>
            <option>10+ years</option>
          </select>
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="immense-career-salary"
            value={salary}
            placeholder="$100,000.00"
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                salary: e.target.value
              }))
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Salary Rate <span className="optional">(optional)</span></label>
          <select
            className="chosen-single form-select"
            value={salaryRate}
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                salaryRate: e.target.value
              }))
            }}
          >
            <option></option>
            <option>Per hour</option>
            <option>Per diem</option>
            <option>Per month</option>
            <option>Per year</option>
          </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Education<span className="optional"> (optional)</span></label>
          <select
            className="chosen-single form-select"
            value={education}
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                education: e.target.value
              }))
            }}
          >
            <option></option>
            <option>Certificate</option>
            <option>High School</option>
            <option>Associate Degree</option>
            <option>Bachelor's Degree</option>
            <option>Master's Degree</option>
          </select>
        </div>
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select
            className="chosen-single form-select"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Industry</label>
          <select
            className="chosen-single form-select"
            value={industy}
            onChange={(e) => {
              setIndustry(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Qualification</label>
          <select
            className="chosen-single form-select"
            value={qualification}
            onChange={(e) => {
              setQualification(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>
 */}
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-12 col-md-12">
          <label>Application Deadline Date</label>
          <input
            type="text"
            name="name"
            placeholder="06.04.2020"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
          />
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>City <span className="required">(required)</span></label>
          <input
            type="text"
            name="immense-city"
            required
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            placeholder="City"
          />
        </div>
         */}
{/* <!-- Input --> */}{/*

        <div className="form-group col-lg-6 col-md-12">
          <label>Country <span className="required">(required)</span></label>
          <select
            className="chosen-single form-select"
            value={country}
            required
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          >
            <option></option>
            <option>Australia</option>
            <option>Pakistan</option>
            <option>USA</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>
 */}

        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="immense-career-address"
            value={completeAddress}
            onChange={(e) => {
              setJobData((previousState) => ({ 
                ...previousState,
                completeAddress: e.target.value
              }))
            }}
            placeholder="Address"
          />
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>City, State <span className="required">(required)</span></label>
          <input
            type="text"
            name="immense-career-address"
            ref={searchInput}            
            placeholder="City, State"
          />
        </div>
        
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Latitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Longitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-three">Search Location</button>
        </div>
        <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div> */}
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button
            className="theme-btn btn-style-one"
            onClick={(e) => {
              e.preventDefault();
              submitJobPost(jobData, setJobData, user);
            }}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;
