import AddPortfolio from "./AddPortfolio";
import Awards from "./Awards";
import Education from "./Education";
import Link from "next/link";
import Experiences from "./Experiences";
import SkillsMultiple from "./SkillsMultiple";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import moment from 'moment';


const index = () => {

  const user = useSelector(state => state.candidate.user);
  const [userCV, setUserCV] = useState([]);
  const [defaultCV, setDefaultCV] = useState('');
  const [defaultDescription, setDefaultDescription] = useState('');
  const [haveCV, setHaveCV] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const getUserCV = async () => {
    let { data, error } = await supabase
      .from('candidate_resumes')
      .select("*")
      .eq('deleted', 'no')
      .eq('user_id', user.id);
    if (data) {

      data.map((cv, index) => {
        if(cv.type == "CV Uploaded"){
          setHaveCV(true);
        }
        if(cv.sub_title == "defaultcv"){
          setDefaultCV(cv.id);
          setDefaultDescription(cv.description);
        }
      })
      setUserCV(data);
    }
  }

  useEffect(() => {
    getUserCV();
  }, []);


  const handleSubmitForm = async () => {

    let updateDefaultCVToNull = await supabase
    .from('candidate_resumes')
    .update({ sub_title: "" })
    .eq('user_id', user.id);
    if(updateDefaultCVToNull){
      await supabase
      .from('candidate_resumes')
      .update({
        sub_title: "defaultcv",
        description: defaultDescription,
        modified_at: new Date()
      })
      .eq('id', defaultCV);
      toast.success('Your CV Updated Successfully!!!', {
        position: "bottom-right",
        autoClose: 1000,
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

  return (
    <form className="default-form" onClick={handleSubmit}>
      {
        haveCV ? <div className="row">
        <div className="form-group col-lg-6 col-md-12">
          <label>Select Your CV 
            
            <Link href="/candidates-dashboard/cv-manager" className="text-info">
            <small className="text-info"> (CV Manager)</small>
          </Link>
            </label>
          <select
            className="chosen-single form-select"
            value={defaultCV}
            onChange={(e) => { setDefaultCV(e.target.value) }}
          >
            <option>Select Your CV</option>
            {
              userCV && userCV.map((item, index) => {
                if(item.type == "CV Uploaded"){
                  return (
                    <option value={item.id}>{item.title}</option>
                  )
                }
              })
            }
          </select>
        </div>
        {/* <!-- Input --> */}

        <div className="form-group col-lg-12 col-md-12">
          <label>Description</label>
          <textarea
            value={defaultDescription}
            onChange={(e) => setDefaultDescription(e.target.value)}
            placeholder="Please enter description"></textarea>
        </div>
        {/* <!-- About Company --> */}

        <div className="form-group col-lg-12 col-md-12">
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={() => handleSubmitForm()}
          >
            Save
          </button>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <Education />
          {/* <!-- Resume / Education --> */}

          <Experiences />
          {/* <!-- Resume / Work & Experience --> */}
        </div>
        {/* <!--  education and word-experiences --> */}

        {/* <div className="form-group col-lg-6 col-md-12">
          <AddPortfolio />
        </div> */}
        {/* <!-- End more portfolio upload --> */}

        <div className="form-group col-lg-12 col-md-12">
          {/* <!-- Resume / Awards --> */}
          <Awards />
        </div>
        {/* <!-- End Award --> */}

        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Skills </label>
          <SkillsMultiple />
        </div> */}
        {/* <!-- Multi Selectbox --> */}


        {/* <!-- Input --> */}
      </div> : <div>
        <div className="text-center">You didn't uploaded your CV yet. Please upload your CV.</div>
        <br />
        <div className="text-center">
        <Link href="/candidates-dashboard/cv-manager" className="theme-btn -blue">
                Add Your CV
              </Link>
              </div>
        </div>
      }
      
      {/* End .row */}
    </form>
  );
};

export default index;
