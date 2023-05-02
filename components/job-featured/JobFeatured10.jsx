import Link from "next/link";
import jobFeatured from "../../data/job-featured";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecentJobs } from "../../features/job/jobSlice";
import { useRouter } from "next/router";
import { supabase } from "../../config/supabaseClient";


const JobFeatured10 = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const recentJobs = useSelector((state) => state.job.recentJobs)

  useEffect(() => {
    if(recentJobs.length == 0){
      supabase.from('jobs')
        .select()
        .eq('status', 'Published')
        .limit(10)
        .order('created_at', {ascending: false})
      .then((res) => {
        if(res.status == 200) dispatch(setRecentJobs({jobs: res.data}))
      })     
    }
  }, [])

  return (
    <div className="default-tabs pt-50 tabs-box">
      <div className="tab-buttons-wrap">
        <ul className="tab-buttons -pills-condensed">
          {/* <li className="tab-btn" data-tab="#tab1">
            Popular
          </li> */}
          <li className="tab-btn active-btn" data-tab="#tab2">
            Recent
          </li>
          {/* <li className="tab-btn" data-tab="#tab3">
            Featured
          </li> */}
        </ul>
      </div>
      {/* <!--Tabs Box--> */}

      <div className="row pt-50" data-aos="fade-up">
        {recentJobs.map((item) => (
          <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.job_id}>
          <div className="inner-box">
  {/*
            <div className="content">
   */}
  {/*
              <span className="company-logo">
                <img src={item.logo} alt="item brand" />
              </span>
   */}
              <h4>
                <Link
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(`/job/${item.job_id}`);
                  }}
                >
                  {item.job_title}
                </Link>
              </h4>
                { item?.job_address ?                        
                  <p className="mb-2"><i className="flaticon-map-locator"></i>{" "}{item?.job_address}</p>
                  : '' }  
                    <ul className="job-info job-other-info">
                      { item?.job_type ?
                          <li className="time">
                            {/* <i className="flaticon-clock-3"/>{" "} */}
                            {item?.job_type}
                            
                          </li>
                          : '' }
                      {/* compnay info */}
                      {/* { item?.job_address ?
                          <li className="required">
                            <i className="flaticon-map-locator"></i>{" "}
                            {item?.address}
                          </li>
                          : '' } */}
                      {/* location info */}
  {/*
                      <li>
                        <span className="icon flaticon-briefcase"></span>{" "}
                        {item?.industry}
                      </li>
   */}
                      {/* time info */}
                      { item?.salary ?
                          <li className="required">
                            <i className="flaticon-money"></i>{" "}
                           ${item?.salary} {item?.salary_rate}
                          </li>
                          : '' }
                      {/* salary info */}
                    </ul>
                    {/* End .job-info */}
  
  {/*
              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
   */}
  {/*
            </div>
   */}
          </div>
        </div>
          // End job-block
        ))}
      </div>
      {/* End .row */}
    </div>
  );
};

export default JobFeatured10;
