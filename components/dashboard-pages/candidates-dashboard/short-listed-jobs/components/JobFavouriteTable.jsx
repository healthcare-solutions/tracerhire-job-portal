import Link from "next/link.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";
import { BallTriangle } from 'react-loader-spinner'

const JobFavouriteTable = () => {

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let today_date = new Date();
  let one_month_ago = today_date.setMonth(today_date.getMonth() - 1);
  const last_month_date = new Date(one_month_ago);
  const last_month_date_format = (last_month_date.getMonth() + 1) + "-" + last_month_date.getDate() + "-" + last_month_date.getFullYear();


  let three_month_ago = today_date.setMonth(today_date.getMonth() - 2);
  const three_month_date = new Date(three_month_ago);
  const three_month_ago_format = (three_month_date.getMonth() + 1) + "-" + three_month_date.getDate() + "-" + three_month_date.getFullYear();

  let six_month_ago = today_date.setMonth(today_date.getMonth() - 2);
  const six_month_date = new Date(six_month_ago);
  const six_month_ago_format = (six_month_date.getMonth() + 1) + "-" + six_month_date.getDate() + "-" + six_month_date.getFullYear();

  const user = useSelector(state => state.candidate.user);
  const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
  
  const [jobStatus, setJobStatus] = useState('');
  const [rpp, setRpp] = useState(20);
  const [arrPages, setArrPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMonthField, setLastMonthField] = useState(last_month_date_format);
  const [threeMonthField, setThreeMonthField] = useState(three_month_ago_format);
  const [sixMonthField, setSixMonthField] = useState(six_month_ago_format);

  const lastOneMonth = [monthNames[today_date.getMonth()-2],monthNames[today_date.getMonth()-1],monthNames[today_date.getMonth()]];

  const lastThreeMonths = [monthNames[today_date.getMonth() - 3],monthNames[today_date.getMonth() - 2],monthNames[today_date.getMonth() - 1],monthNames[today_date.getMonth()]];
  
  const lastSixMonths = [monthNames[today_date.getMonth() - 5],monthNames[today_date.getMonth() - 4],monthNames[today_date.getMonth() - 3],monthNames[today_date.getMonth() - 2],monthNames[today_date.getMonth() - 1],monthNames[today_date.getMonth()]];
  const [lastSixMonthsData, setLastSixMonthsData] = useState([]);
  const [searchField,setSearchField] = useState('');

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
  }

  const fetchedAllApplicantsView = async (pageNo,search_field) => {
    try {
      setIsLoading(true);
      let countTotalRecords = await supabase
        .from('applications_view')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', search_field);
      let totalRecords = countTotalRecords.count;
      let recordPerPage = rpp;
      let totalPages = Math.ceil(totalRecords / recordPerPage);
      setTotalPages(totalPages);
      if (totalPages) {
        let arrPage = [];
        for (var i = 1; i <= totalPages; i++) {
          arrPage.push(i);
        }
        setArrPages(arrPage);
        let start_limit = parseInt(parseInt(pageNo - 1) * parseInt(rpp));
        if (pageNo < 1) {
          start_limit = parseInt(parseInt(pageNo) * parseInt(rpp));
        }
        let end_limit = parseInt(start_limit) + parseInt(rpp);
        setCurrentPage(pageNo);

        let { data: allApplicantsView, error } = await supabase
          .from('applications_view')
          .select("*")
          .eq('user_id', user.id)
          .gte('created_at', search_field)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        if (allApplicantsView) {
          allApplicantsView.forEach(i => i.created_at = dateFormat(i.created_at))
          setFetchedAllApplicantsData(allApplicantsView)
        }
      }
      setIsLoading(false);

    } catch (e) {
      console.log("eeeerror", e);
      toast.error('System is unavailable.  Please try again later or contact tech support!', {
        position: "bottom-right",
        autoClose: true,
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

  useEffect(() => {
    setIsLoading(true);
    fetchedAllApplicantsView(currentPage,six_month_ago_format);
  }, []);

  const handleSelectedMonth = (selectedMonth) => {
    setIsLoading(true);
    setSearchField(selectedMonth);
    fetchedAllApplicantsView(currentPage,selectedMonth);
  }

  const handleNextPage = (pageNo) => {
    setIsLoading(true);
    fetchedAllApplicantsView(pageNo,searchField);
  }

  const ViewCV = async (applicationId) => {
    const { data, error } = await supabase
      .from('applications_view')
      .select('*')
      .eq('application_id', applicationId);

    if (data) {
      window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
    }
    if (error) {
      toast.error('Error while retrieving CV.  Please try again later or contact tech support!', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Shortlisted Jobs</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select 
            className="chosen-single form-select"
            value={searchField}
            onChange={(e) => {
              handleSelectedMonth(e.target.value);
            }}
          >
            <option value={sixMonthField}>Last 6 Months</option>
            <option value={threeMonthField}>Last 3 Months</option>
            <option value={lastMonthField}>Last 1 Month</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
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
            {isLoading == false && fetchedAllApplicants.length > 0 ?
              <table className="default-table manage-job-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Applied Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.from(fetchedAllApplicants).slice(0, 10).map((applicant) => (
                    <tr key={applicant.application_id}>
                      <td>
                        {/* <!-- Job Block --> */}
                        <div className="job-block">
                          <div className="inner-box">
                            <div className="content1">
                              <h4>
                                <Link href={`/job/${applicant.job_id}`} target="_blank">
                                  {applicant.job_title}
                                </Link>
                              </h4>
                              {/* <ul className="job-info">
                                <li>
                                  <span className="icon flaticon-briefcase"></span>
                                  Segment
                                </li>
                                <li>
                                  <span className="icon flaticon-map-locator"></span>
                                  London, UK
                                </li>
                              </ul> */}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{applicant.created_at}</td>
                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <button data-text="View CV" onClick={() => ViewCV(applicant.application_id)}>
                                <span className="la la-file-download"></span>
                              </button>
                              
                            </li>
                            <li>
                              <Link href={`/job/${applicant.job_id}`} data-text="View Job" target="_blank">
                              <span className="la la-eye"></span>
                                </Link>
                            {/* <button data-text="View Job" onClick={() => ViewCV(applicant.application_id)}>
                                
                              </button> */}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> :
              <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: 40, paddingTop: 40, textAlign: 'center' }}><center>No applicant applied to any of your posted jobs!</center></p>
              
            }
            {
                        isLoading == false && fetchedAllApplicants.length != 0 && arrPages.length > 1 &&
                        <nav className="ls-pagination">
                            <ul>
                                {
                                    currentPage > 1 && <li className="prev">
                                        <a onClick={() => handleNextPage(parseInt(currentPage) - parseInt(1))}>
                                            <i className="fa fa-arrow-left"></i>
                                        </a>
                                    </li>
                                }

                                {
                                    arrPages.map(item => {
                                        return (
                                            <li><a onClick={() => handleNextPage(item)} className={item == currentPage ? 'current-page' : 'non-current-page'}>{item}</a></li>
                                        )
                                    })
                                }

                                {
                                    currentPage < totalPages && <li className="next">
                                        <a onClick={() => handleNextPage(parseInt(currentPage) + parseInt(1))}>
                                            <i className="fa fa-arrow-right"></i>
                                        </a>
                                    </li>
                                }

                            </ul>
                        </nav>
                    }
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobFavouriteTable;
