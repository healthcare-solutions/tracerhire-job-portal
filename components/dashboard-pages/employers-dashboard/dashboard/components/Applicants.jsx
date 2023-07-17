import Link from "next/link";
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner'
import candidatesData from "../../../../../data/candidates";

const Applicants = () => {
  const [recentApplicants, setRecentApplicants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.candidate.user);
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    let dataRecentApplicants = await supabase
      .from('applications_view')
      .select('*')
      //.eq('user_id', user.id)
      //.not('status',"eq",'Qualified');
      //.is('deleted', null)
      .order('created_at', { ascending: false })
      .range(0, 10);
    if (dataRecentApplicants) {

      // Make Record Unique Start //
      const unique = dataRecentApplicants.data.filter(
        (obj, index) =>
        dataRecentApplicants.data.findIndex((item) => item.user_id === obj.user_id) === index
      );
      let arrData = [];
          for (const item of unique) {
            const fetchUser = await supabase
            .from('users')
            .select('user_photo,photo_url')
            .eq('user_id',item.user_id);
            if(fetchUser){
              let photo_url = '/images/resource/candidate-1.png';
              console.log(fetchUser.data[0]);
              if(fetchUser.data.length > 0 && fetchUser.data[0].user_photo != null){
                photo_url = cloudPath+fetchUser.data[0].user_photo;
              } else if(fetchUser.data.length > 0 && fetchUser.data[0].photo_url != null){
                photo_url = fetchUser.data[0].photo_url;
              }
              let objData = {
                application_id: item.application_id,
                created_at: item.created_at,
                cust_id: item.cust_id,
                doc_dwnld_url: item.doc_dwnld_url,
                email: item.email,
                job_id: item.job_id,
                job_title: item.job_title,
                name: item.name,
                status: item.status,
                user_id: item.user_id,
                photo_url : photo_url
              }
              arrData.push(objData);
            }
          }
          if(arrData){
            setRecentApplicants(arrData);
          } else {
            setRecentApplicants(unique);
          }
      // Make Record Unique Over //

      //setRecentApplicants(unique);
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading == false && recentApplicants && recentApplicants.map((candidate) => (
        <div
          className="candidate-block-three col-lg-4 col-md-12 col-sm-12"
          key={candidate.application_id}
        >
          <div className="inner-box">
            <div className="content">
              <figure className="image">
                {/* <img src={"/images/resource/candidate-1.png"} alt="candidates" /> */}
                <img src={candidate.photo_url} alt="candidates" />
              </figure>
              <h4 className="name">
                <Link href={`/candidate-details/${candidate.application_id}`}>
                  {candidate.name}
                </Link>
              </h4>
              <span className="designation"><small>{candidate.job_title}</small></span>

              <ul className="candidate-info">
                <li className="designation"></li>
                {/* <li>
                  <span className="icon flaticon-map-locator"></span>{" "}
                  {candidate.location}
                </li>
                <li>
                  <span className="icon flaticon-money"></span> $
                  {candidate.hourlyRate} / hour
                </li> */}
              </ul>
              {/* End candidate-info */}

              {/* <ul className="post-tags">
                {candidate.tags.map((val, i) => (
                  <li key={i}>
                    <a href="#">{val}</a>
                  </li>
                ))}
              </ul> */}
            </div>
            {/* End content */}

            {/* <div className="option-box">
              <ul className="option-list">
                <li>
                  <button data-text="View Aplication">
                    <span className="la la-eye"></span>
                  </button>
                </li>
                <li>
                  <button data-text="Approve Aplication">
                    <span className="la la-check"></span>
                  </button>
                </li>
                <li>
                  <button data-text="Reject Aplication">
                    <span className="la la-times-circle"></span>
                  </button>
                </li>
                <li>
                  <button data-text="Delete Aplication">
                    <span className="la la-trash"></span>
                  </button>
                </li>
              </ul>
            </div> */}
            {/* End admin options box */}
          </div>
        </div>
      ))}
    </>
  );
};

export default Applicants;