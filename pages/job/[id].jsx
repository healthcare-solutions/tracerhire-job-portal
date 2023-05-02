import dynamic from "next/dynamic";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Seo from "../../components/common/Seo";
import RelatedJobs from "../../components/job-single-pages/related-jobs/RelatedJobs";
import JobOverView from "../../components/job-single-pages/job-overview/JobOverView";
import ApplyInstantView from "../../components/job-single-pages/job-overview/ApplyInstantView";
import JobSkills from "../../components/job-single-pages/shared-components/JobSkills";
import CompnayInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import SocialTwo from "../../components/job-single-pages/social/SocialTwo";
import JobDetailsDescriptions from "../../components/job-single-pages/shared-components/JobDetailsDescriptions";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/common/form/firebase";
import Social from "../../components/footer/common-footer/Social";
import DefaulHeader2 from "../../components/header/DefaulHeader2";
import { useSelector } from "react-redux";
import DashboardHeader from "../../components/header/DashboardHeader";
import Footer from "../../components/home-15/Footer"
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from "../../config/supabaseClient";

const JobSingleDynamicV1 = () => {
  const [isUserApplied, setIsUserApplied] = useState([]);
  const user = useSelector(state => state.candidate.user)
  const showLoginButton = useMemo(() => !user?.id, [user])
  const router = useRouter();
  const [company, setCompany] = useState({});
  const id = router.query.id;

  const fetchCompany = async () => {
    try{
      if (id) {
        let { data: jobs, error } = await supabase
            .from('jobs')
            .select("*")

            // Filters
            .eq('job_id', id)

        if (jobs) {
          setCompany(jobs[0])
        }
      }
    } catch(e) {
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
      console.warn(e)
    }
  };

  const fetchPostForLoggedInUser = async () => {
    // TODO: skip this check for employer login
    if (id && !showLoginButton) {
        let { data: application, error } = await supabase
            .from('applications')
            .select("*")

            // Filters
            .eq('email', user.email)
            .eq('job_id', id)

        if (application?.length > 0) {
            setIsUserApplied(true);
        } else {
            setIsUserApplied(false);
        }
    } else {
        setIsUserApplied(false);
    }
  };

  useEffect(() => {
    setIsUserApplied(false);
    fetchCompany();
    fetchPostForLoggedInUser();
  }, [id]);

  // useEffect(() => {
  //   if (!id) <h1>Loading...</h1>;
  //   else setCompany(jobs.find((item) => item.id == id));

  //   return () => {};
  // }, [id]);

  return (
    <>
      <Seo pageTitle="Apply Job" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      { showLoginButton ?  <DefaulHeader2 /> : <DashboardHeader/>}
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div>
{/*
                  <span className="company-logo">
                    <img src={company?.logo} alt="logo" />
                  </span>
 */}
                  <h4>{company?.job_title}</h4>

                  <ul className="job-info">
                    { company?.job_type ?
                        <li>
                          <span className="icon flaticon-clock-3"></span>
                          {company?.job_type}
                        </li>
                        : '' }
                    {/* compnay info */}
                    { company?.job_address ?
                        <li>
                          <span className="icon flaticon-map-locator"></span>
                          {company?.job_address}
                        </li>
                        : '' }
                    {/* location info */}
{/*
                    <li>
                      <span className="icon flaticon-briefcase"></span>{" "}
                      {company?.industry}
                    </li>
 */}
                    {/* time info */}
                    { company?.salary ?
                        <li>
                          <span className="icon flaticon-money"></span>{" "}
                         ${company?.salary} {company?.salary_rate}
                        </li>
                        : '' }
                    {/* salary info */}
                  </ul>
                  {/* End .job-info */}

{/*
                  <ul className="job-other-info">
                     */}
{/* {company?.jobType?.map((val, i) => (
                      <li key={i} className={`${val.styleClass}`}>
                        {val.type}
                      </li>
                    ))} */}{/*

                    {company?.jobType}
                  </ul>
 */}
                  {/* End .job-other-info */}
                </div>
                {/* End .content */}

                { !showLoginButton && isUserApplied ?
                    <button className="btn-box theme-btn btn-style-nine">
                        ✓ Applied
                      {/* <button className="bookmark-btn">
                        <i className="flaticon-bookmark"></i>
                      </button> */}
                    </button>

                    : ''}

                { !showLoginButton && !isUserApplied ?
                    <div className="btn-box">
                      <a
                        href="#"
                        className="theme-btn btn-style-one"
                        data-bs-toggle="modal"
                        data-bs-target="#applyJobModal"
                      >
                        Apply For Job
                      </a>
                      {/* <button className="bookmark-btn">
                          <i className="flaticon-bookmark"></i>
                        </button> */}
                    </div>
                    : ''}

                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="applyJobModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Apply for this job</h3>
                        <button
                          type="button"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {/* End modal-header */}

                      <ApplyJobModalContent />
                      {/* End PrivateMessageBox */}
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <JobDetailsDescriptions company={company} />
                {/* End jobdetails content */}

{/*
                <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div>
 */}
                {/* <!-- Other Options --> */}

{/*
                <div className="related-jobs">
                  <div className="title-box">
                    <h3>Related Jobs</h3>
                    <div className="text">
                      2020 jobs live - 293 added today.
                    </div>
                  </div>
                   */}
{/* End title box */}{/*


                  <RelatedJobs />
                </div>
 */}
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  { showLoginButton ?
                      <div className="sidebar-widget">
                        {/* <!-- Job Overview --> */}
                        <h4 className="widget-title">APPLY INSTANTLY</h4>
                        <ApplyInstantView company={company} />
                      </div>
                    : '' }

                  <div className="sidebar-widget">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">Job Overview</h4>
                    <JobOverView company={company} />
                  </div>
                  {/* End .sidebar-widget */}

{/*
                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <img src={company.logo} alt="resource" />
                        </div>
                        <h5 className="company-name">{company.company}</h5>
                        <a href="#" className="profile-link">
                          View company profile
                        </a>
                      </div>
                       */}
{/* End company title */}{/*


                      <CompnayInfo company={company} />

                      <div className="btn-box">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-three"
                        >
                          {company?.link}
                        </a>
                      </div>
                       */}
{/* End btn-box */}{/*

                    </div>
                  </div>
 */}
                  {/* End .company-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}
      <Footer />
      {/* <FooterDefault footerStyle="alternate5" /> */}
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
