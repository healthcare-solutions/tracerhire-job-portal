import dynamic from "next/dynamic";
import candidates from "../../data/candidates";
import candidateResume from "../../data/candidateResume";
import { useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
// import DashboardHeader from "../../../header/DashboardHeader";
import DashboardHeader from "../../components/header/DashboardHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import Contact from "../../components/candidates-single-pages/shared-components/Contact";
import GalleryBox from "../../components/candidates-single-pages/shared-components/GalleryBox";
import Social from "../../components/candidates-single-pages/social/Social";
import JobSkills from "../../components/candidates-single-pages/shared-components/JobSkills";
import AboutVideo from "../../components/candidates-single-pages/shared-components/AboutVideo";
import moment from 'moment';
import Link from "next/link";
import { BallTriangle } from 'react-loader-spinner';

const CandidateSingleDynamicV1 = () => {
  const router = useRouter();
  const [candidate, setCandidates] = useState({});
  const id = router.query.id;
  const user = useSelector(state => state.candidate.user)
  const userId = user.id;

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const [educationDetails, setEducationDetails] = useState([]);
  const [workExperienceDetails, setWorkExperienceDetails] = useState([]);
  const [awardDetails, setAwardDetails] = useState([]);
  const [defaultCV, setDefaultCV] = useState("");
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");

  const fetchCandidateData = async (user_id) => {
    setIsLoading(true);
    let { data, error } = await supabase
      .from('cust_dtl')
      .select()
      .eq('cust_id', user_id);
    if (data) {
      let userdata = await supabase
        .from('users')
        .select('name')
        .eq('user_id', user_id);

      let finalData = data[0];
      if (finalData) {
        finalData['name'] = userdata.data[0].name;
        setUserData(finalData);
        
      }
    }

    let candidate_resume_details = await supabase
      .from('candidate_resumes')
      .select('*')
      .eq('user_id', user_id)
      .eq('deleted', 'no');
    let arrEducation = [];
    let arrWorkExperience = [];
    let arrAwards = [];
    let arrDefaultCV = [];
    if (candidate_resume_details.data.length > 0) {
      candidate_resume_details.data.map((item, index) => {
        if (item.type == 'EducationDetails') {
          arrEducation.push(item);
        } else if (item.type == 'WorkDetails') {
          arrWorkExperience.push(item);
        } else if (item.type == 'CV Uploaded') {
          if(item.sub_title == "defaultcv"){
            arrDefaultCV.push(item);
          }
        } else if (item.type == 'Award') {
          arrAwards.push(item);
        }
      });
    }
    if (arrEducation.length > 0) {
      setEducationDetails(arrEducation);
      setWorkExperienceDetails(arrWorkExperience);
      setAwardDetails(arrAwards);
      setDefaultCV(arrDefaultCV);
    }
    setIsLoading(false);
  }


  const ValidateURL = (str) => {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return "https://" + str;
    } else {
      return str;
    }
  }

  useEffect(() => {

    fetchCandidateData(id);

    if (!id) <h1>Loading...</h1>;
    else setCandidates(candidates.find((item) => item.id == id));

    return () => { };
  }, [id]);

  return (
    <>
      <Seo pageTitle="Candidate Single Dyanmic V1" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <img src="/images/resource/candidate-1.png" alt="resource" />
                  </figure>
                  <h4 className="name">{userData?.name}</h4>

                  <ul className="candidate-info">
                    <li className="designation">{userData?.company_name}</li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {userData?.city}
                    </li>
                    {/* <li>
                      <span className="icon flaticon-money"></span> $
                      {candidate?.hourlyRate} / hour
                    </li> */}
                    <li>
                      <span className="icon flaticon-clock"></span> Member
                      Since  {moment(userData.created_at).format("MMMM D, YYYY")}
                    </li>
                  </ul>

                  <ul className="post-tags">
                    {candidate?.tags?.map((val, i) => (
                      <li key={i}>{val}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-box">
                  {
                    defaultCV.length > 0 &&
                    <a
                      className="theme-btn btn-style-one pr-2"
                      target="_blank"
                      href={cloudPath+defaultCV[0].attachemnt}
                      download
                      style={{ marginRight: 10 }}
                    >
                      Download CV
                    </a>
                  }
                  
                  {/* <Link
                    className="btn-style-one"
                    href="/employers-dashboard/shortlisted-resumes"
                  >Back
                  </Link> */}
                  <button className="btn-style-one" onClick={() => router.back()}>Back</button>
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <div className="video-outer">
                    <h4>About {userData.name}</h4>
                  </div>
                  <p>
                    {userData.description}
                  </p>
                  {
                    isLoading &&
                    <div style={{ width: '20%', margin: "auto" }}>
                      <BallTriangle
                        height={100}
                        width={100}
                        radius={5}
                        color="#000"
                        ariaLabel="ball-triangle-loading"
                        wrapperClass={{}}
                        wrapperStyle=""
                        visible={true}
                      />
                    </div>
                  }
                  {
                    educationDetails.length > 0 && <div>
                      <div className="upper-title">
                        <h4>Education</h4>
                      </div>
                      {educationDetails.map((resume) => (
                        <div
                          className={`resume-outer`}
                          key={resume.id}
                        >
                          <div className="resume-block" key={resume.id}>
                            <div className="inner">
                              <span className="name">E</span>
                              <div className="title-box">
                                <div className="info-box">
                                  <h3>{resume.title}</h3>
                                  <span>{resume.sub_title}</span>
                                </div>
                                <div className="edit-box">
                                  <span className="year">{moment(resume.from_date).format("YYYY")} - {moment(resume.to_date).format("YYYY")}</span>
                                </div>
                              </div>
                              <div className="text">{resume.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  }


                  {
                    workExperienceDetails.length > 0 && <div>
                      <div className="upper-title">
                        <h4>Work Experience</h4>
                      </div>
                      {workExperienceDetails.map((resume) => (
                        <div
                          className={`resume-outer theme-blue`}
                          key={resume.id}
                        >
                          <div className="resume-block" key={resume.id}>
                            <div className="inner">
                              <span className="name">W</span>
                              <div className="title-box">
                                <div className="info-box">
                                  <h3>{resume.title}</h3>
                                  <span>{resume.sub_title}</span>
                                </div>
                                <div className="edit-box">
                                  <span className="year">{moment(resume.from_date).format("YYYY")} - {moment(resume.to_date).format("YYYY")}</span>
                                </div>
                              </div>
                              <div className="text">{resume.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  }



                  {
                    awardDetails.length > 0 && <div>
                      <div className="upper-title">
                        <h4>Awards</h4>
                      </div>
                      {awardDetails.map((resume) => (
                        <div
                          className={`resume-outer theme-yellow`}
                          key={resume.id}
                        >
                          <div className="resume-block" key={resume.id}>
                            <div className="inner">
                              <span className="name">A</span>
                              <div className="title-box">
                                <div className="info-box">
                                  <h3>{resume.title}</h3>
                                  <span>{resume.sub_title}</span>
                                </div>
                                <div className="edit-box">
                                  <span className="year">{moment(resume.from_date).format("YYYY")} - {moment(resume.to_date).format("YYYY")}</span>
                                </div>
                              </div>
                              <div className="text">{resume.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  }

                </div>
              </div>

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Experience:</h5>
                          <span>{userData.experience}</span>
                        </li>

                        <li>
                          <i className="icon icon-expiry"></i>
                          <h5>Age:</h5>
                          <span>{userData.age}</span>
                        </li>

                        <li>
                          <i className="icon icon-rate"></i>
                          <h5>Current Salary:</h5>
                          <span>{userData.current_salary}</span>
                        </li>

                        <li>
                          <i className="icon icon-salary"></i>
                          <h5>Expected Salary:</h5>
                          <span>{userData.expected_salary}</span>
                        </li>

                        {/* <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Gender:</h5>
                          <span>Female</span>
                        </li> */}

                        <li>
                          <i className="icon icon-language"></i>
                          <h5>Language:</h5>
                          <span>{userData.languages}</span>
                        </li>

                        <li>
                          <i className="icon icon-degree"></i>
                          <h5>Education Level:</h5>
                          <span>{userData.education_level}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget conadidate overview */}

                  <div className="sidebar-widget social-media-widget">
                    <h4 className="widget-title">Social media</h4>
                    <div className="widget-content">
                      <div className="social-links">
                        <Social
                          fb={ValidateURL(userData.facebook_url)}
                          tw={ValidateURL(userData.twitter_url)}
                          li={ValidateURL(userData.linkedin_url)}
                          yt={ValidateURL(userData.youtube_url)}
                          in={ValidateURL(userData.instagram_url)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* End .sidebar-widget social-media-widget */}

                  <div className="sidebar-widget">
                    <h4 className="widget-title">Professional Skills</h4>
                    <div className="widget-content">
                      <ul className="job-skills">
                        <JobSkills data={userData.departments} />
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget skill widget */}

                  {/* <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
                  {/* End .sidebar-widget contact-widget */}
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

      {/* <FooterDefault footerStyle="alternate5" /> */}
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
