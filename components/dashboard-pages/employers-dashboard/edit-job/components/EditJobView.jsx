import Map from "../../../Map";
import Select from "react-select";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const apiKey = process.env.NEXT_PUBLIC_JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

const editedJobFields = {
    editedJobTitle: "",
    editedJobDesc: "",
    editedJobType: "",
    editedSalary: "",
    editedSalaryRate: "",
    editedCareer: "",
    editedExp: "",
    editedAddress: "",
    editedCompleteAddress: ""
}

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

const submitJobPost = async (
  { editedJobTitle, editedJobDesc, editedJobType, editedSalary, editedSalaryRate, editedCareer, editedExp, editedAddress, editedCompleteAddress },
  setEditedJobData,
  user,
  fetchedJobData
) => {
    if (editedJobTitle || editedJobDesc || editedJobType || editedSalary || editedSalaryRate || editedCareer || editedExp || editedAddress) {
        try {

            const { data, error } = await supabase
            .from('jobs')
            .update(
                { job_title: editedJobTitle ? editedJobTitle : fetchedJobData.job_title,
                 job_desc: editedJobDesc ? editedJobDesc : fetchedJobData.job_desc,
                 job_type: editedJobType ? editedJobType : fetchedJobData.job_type,
                 experience: editedExp ? editedExp : fetchedJobData.experience,
                 education: editedCareer ? editedCareer : fetchedJobData.education,
                 salary: editedSalary ? editedSalary : fetchedJobData.salary,
                 salary_rate: editedSalaryRate ? editedSalaryRate : fetchedJobData.salary_rate,
                 job_address: editedAddress ? editedAddress : fetchedJobData.job_address,
                 job_comp_add: editedCompleteAddress ? editedCompleteAddress : fetchedJobData.job_comp_add,
                 change_dttm: new Date(),
                 update_ver_nbr: fetchedJobData.update_ver_nbr + 1
                }
                )
            .eq('job_id', fetchedJobData.job_id)
            // .select() -- this will return the updated record in object

            // reset all the edit form fields
            setEditedJobData(JSON.parse(JSON.stringify(editedJobFields)))

            // open toast
            toast.success('Job edited successfully', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // redirect to original page where user came from
            setTimeout(() => {
                Router.push("/employers-dashboard/manage-jobs")
            }, 4000)
      } catch (err) {
        // open toast
        toast.error('Error while saving your changes, Please try again later or contact tech support', {
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
        toast.error('You do not have any changes to save', {
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

const EditJobView = ({ fetchedJobData }) => {
  console.log(fetchedJobData);
  const user = useSelector(state => state.candidate.user)
  const [editedJobData, setEditedJobData] = useState(JSON.parse(JSON.stringify(editedJobFields)));
  const { editedJobTitle, editedJobDesc, editedJobType, editedSalary, editedSalaryRate, editedCareer, editedExp, editedAddress, editedCompleteAddress } = useMemo(() => editedJobData, [editedJobData])

  const router = useRouter();
  const JobId = router.query.id;

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
    setEditedJobData((previousState) => ({ 
      ...previousState,
      editedAddress: searchInput.current.value
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

  useEffect(() => {
    searchInput.current.value = fetchedJobData.job_address
  }, [fetchedJobData.job_address]);

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
          { !editedJobTitle ? 
            <input
                type="text"
                name="tracer-hire-jobTitle"
                value={fetchedJobData.job_title}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedJobTitle: e.target.value
                }))
                }}
                placeholder="Job Title"
            />
            : <input
                    type="text"
                    name="tracer-hire-jobTitle"
                    value={editedJobTitle}
                    required
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedJobTitle: e.target.value
                    }))
                    }}
                    placeholder="Job Title"
                />
          }
        </div>
        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description <span className="required">(required)</span></label>
          
          { !editedJobDesc ?
            <SunEditor 
            setContents={fetchedJobData.job_desc}
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
            setEditedJobData((previousState) => ({ 
              ...previousState,
              editedJobDesc: e
            }))
          }}
          />
            : 
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
            setEditedJobData((previousState) => ({ 
              ...previousState,
              editedJobDesc: e
            }))
          }}
          />
          }   
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
          { !editedJobType ? 
            <select
                className="chosen-single form-select"
                value={fetchedJobData.job_type}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedJobType: e.target.value
                }))
                }}
            >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
          </select>
          : <select
                className="chosen-single form-select"
                value={editedJobType}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedJobType: e.target.value
                }))
                }}
            >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
            </select>
          }
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience<span className="required"> (required)</span></label>
          { !editedExp ? 
            <select
                className="chosen-single form-select"
                value={fetchedJobData.experience}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedExp: e.target.value
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
            : <select
                    className="chosen-single form-select"
                    value={editedExp}
                    required
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedExp: e.target.value
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
          }
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="tracer-hire-salary"
            value={fetchedJobData.salary}
            placeholder="$100,000.00"
            onChange={(e) => {
              setEditedJobData((previousState) => ({ 
                ...previousState,
                editedSalary: e.target.value
              }))
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Salary Rate <span className="optional">(optional)</span></label>
          { !editedSalaryRate ?
            <select
                className="chosen-single form-select"
                value={fetchedJobData.salary_rate}
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedSalaryRate: e.target.value
                }))
                }}
            >
                <option></option>
                <option>Per hour</option>
                <option>Per diem</option>
                <option>Per month</option>
                <option>Per year</option>
            </select>
            : <select
                    className="chosen-single form-select"
                    value={editedSalaryRate}
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedSalaryRate: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>Per hour</option>
                    <option>Per diem</option>
                    <option>Per month</option>
                    <option>Per year</option>
                </select>
          }
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Education<span className="required"> (required)</span></label>
          { !editedCareer ?
            <select
                className="chosen-single form-select"
                value={fetchedJobData.education}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedCareer: e.target.value
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
            : <select
                    className="chosen-single form-select"
                    value={editedCareer}
                    required
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedCareer: e.target.value
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
          }
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
            name="tracer-hire-city"
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
          { !editedCompleteAddress ?
            <input
                type="text"
                name="tracer-hire-address"
                value={fetchedJobData.job_comp_add}
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedCompleteAddress: e.target.value
                }))
                }}
                placeholder="Address"
            />
            : <input
                    type="text"
                    name="tracer-hire-address"
                    value={editedCompleteAddress}
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedCompleteAddress: e.target.value
                    }))
                    }}
                    placeholder="Address"
                />
          }
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>City, State <span className="required">(required)</span></label>
          { !editedAddress ?
            <input
                type="text"
                name="tracer-hire-address"
                ref={searchInput}
                placeholder="City, State"
            />
            : <input
                type="text"
                name="tracer-hire-address"
                ref={searchInput}                    
                placeholder="City, State"
              />
          }
        </div>
        
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="Richmond, VA, USA"
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
              submitJobPost(editedJobData, setEditedJobData, user, fetchedJobData);
            }}
          >
            Save Changes
          </button>
          <button
            className="theme-btn btn-style-one"
            onClick={()=>{
                router.push(`/employers-dashboard/manage-jobs`)
              }}
            style={{marginLeft: "10px"}}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditJobView;
