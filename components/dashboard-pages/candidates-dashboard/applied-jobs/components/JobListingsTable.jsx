import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BallTriangle } from 'react-loader-spinner'

const JobListingsTable = () => {

  const [applications, setApplications] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [rpp, setRpp] = useState(20);
  const [arrPages, setArrPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.candidate.user)

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear();
  }

  // clear all filters
  const clearAll = () => {
    setSearchField('');
    fetchApplications(currentPage)
  };

  async function findAppliedJob() {

    let { data, error } = await supabase
      .from('applications_view')
      .select()
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      console.log("Data", data);
      data.forEach(job => job.created_at = dateFormat(job.created_at))
      setApplications(data.filter((job) => job.job_title.toLowerCase().includes(searchField.toLowerCase())))
    }
  };

  const fetchApplications = async (pageNo) => {
    setIsLoading(true);
    let countTotalRecords = await supabase
      .from('applications_view')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

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
      let { data: applications, error } = await supabase
        .from('applications_view')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(start_limit, end_limit);

      if (applications) {
        applications.forEach(i => i.created_at = dateFormat(i.created_at))
        setApplications(applications)
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchApplications(currentPage);
    console.log("applications",applications);
  }, []);

  const handleNextPage = (pageNo) => {
    setIsLoading(true);
    fetchApplications(pageNo);
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

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

        {isLoading == false && applications.length != 0 ?
          <div className="chosen-outer">
            {/* <select className="chosen-single form-select chosen-container"> */}
            {/* <option>All Status</option> */}
            {/* <option>Last 12 Months</option> */}
            {/* <option>Last 16 Months</option> */}
            {/* <option>Last 24 Months</option> */}
            {/* <option>Last 5 year</option> */}
            {/* </select> */}

            {/* TODO: add search filters */}
            <input
              className="chosen-single form-input chosen-container mx-3"
              type="text"
              name="tracer-hire-job_title"
              placeholder="Search by Job Title"
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
              style={{ minWidth: '450px' }}
            />
            {/*           
              <select
                className="chosen-single form-select chosen-container mx-3"
                onChange={(e) => {
                  setJobStatus(e.target.value)
                }}
              >
                <option>Status</option>
                <option>Published</option>
                <option>Unpublished</option>
              </select> */}

            <button
              onClick={findAppliedJob}
              className="btn btn-primary text-nowrap m-1"
              style={{ minHeight: '43px' }}
            >
              Search
            </button>
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap m-1"
              style={{ minHeight: '43px' }}
            >
              Clear
            </button>
          </div>
          : ''}
      </div>

      {/* Start table widget content */}
      {isLoading == false && applications.length == 0 ? <p style={{ fontSize: '1rem', paddingBottom:40, fontWeight: '500' }}><center>You have not applied to any jobs yet!</center></p> :
        <div className="widget-content">
          <div className="table-outer">
            <div className="table-outer">
              <table className="default-table manage-job-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>

                <tbody>
                  {applications.slice(0, 4).map((item) => (
                    <tr key={item.application_id}>
                      <td>
                        {/* <!-- Job Block --> */}
                        <div className="job-block">
                          <div className="inner-box">
                            <div>
                              {/* <span className="company-logo">
                                  <img src={item.logo} alt="logo" />
                                </span> */}
                              <h4>
                                <Link href={`/job/${item.job_id}`}>
                                  {item.job_title}
                                </Link>
                              </h4>
                              <ul className="job-info">
                                {item?.job_type ?
                                  <li>
                                    <span className="icon flaticon-clock-3"></span>
                                    {item?.job_type}
                                  </li>
                                  : ''}
                                {item?.job_address ?
                                  <li>
                                    <span className="icon flaticon-map-locator"></span>
                                    {item?.job_address}
                                  </li>
                                  : ''}
                                {/* location info */}
                                {item?.salary ?
                                  <li>
                                    <span className="icon flaticon-money"></span>{" "}
                                    ${item?.salary} {item?.salary_rate}
                                  </li>
                                  : ''}
                                {/* salary info */}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{item.created_at}</td>
                      {item.status == "Qualified" ?
                        <td className="status">{item.status}</td>
                        : item.status == "Not Qualified" ?
                          <td className="status" style={{ color: 'red' }}>{item.status}</td>
                          : item.status == null ?
                            <td className="pending">Pending</td>
                            : <td className="pending">{item.status}</td>
                      }
                      {/* <td>
                          <div className="option-box">
                            <ul className="option-list">
                              <li>
                                <button data-text="View Aplication">
                                  <span className="la la-eye"></span>
                                </button>
                              </li>
                              <li>
                                <button data-text="Delete Aplication">
                                  <span className="la la-trash"></span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {
                  isLoading == false && arrPages.length > 1 &&
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
      }
    </div>
  );
};

export default JobListingsTable;
