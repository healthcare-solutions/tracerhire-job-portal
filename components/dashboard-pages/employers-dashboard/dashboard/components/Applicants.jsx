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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    let dataRecentApplicants = await supabase
      .from('applications_view')
      .select('application_id,name,job_title')
      .eq('user_id', user.id)
      //.not('status',"eq",'Qualified');
      //.is('deleted', null)
      .order('created_at', { ascending: false })
      .range(0, 2);
    if (dataRecentApplicants && dataRecentApplicants.data.length > 0) {
      setRecentApplicants(dataRecentApplicants.data);
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
                <img src={"/images/resource/candidate-1.png"} alt="candidates" />
              </figure>
              <h4 className="name">
                <Link href={`/candidates-single-v1/${candidate.application_id}`}>
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