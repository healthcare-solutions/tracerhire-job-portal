import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const JobListingsTable = () => {

  const [applications, setApplications] = useState([]);
  const [searchField, setSearchField] = useState('');

  const user = useSelector(state => state.candidate.user)

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
  }

  // clear all filters
  const clearAll = () => {
    setSearchField('');
    fetchApplications()
  };

  async function findAppliedJob () {

    let { data, error } = await supabase
        .from('applicants_view')
        .select()
        .eq('user_id', user.id)
        .order('created_at',  { ascending: false });

        if (data) {
          data.forEach( job => job.created_at = dateFormat(job.created_at))
          setApplications(data.filter((job) => job.job_title.toLowerCase().includes(searchField.toLowerCase())))
        }
  };

  const fetchApplications = async () => {
    let { data: applications, error } = await supabase
      .from('applicants_view')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at',  { ascending: false });
  
      if (applications) {
        applications.forEach( i => i.created_at = dateFormat(i.created_at))
        setApplications(applications)
      }
  }

  useEffect(() => {
    fetchApplications();
  }, []);
  
  return (
      <div className="tabs-box">
        <div className="widget-title">
          <h4>My Applied Jobs</h4>

          {applications.length != 0 ?
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
                  style={{ minWidth: '450px'}}
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
                style= {{ minHeight: '43px' }}
              >
                Search
              </button>
              <button
                onClick={clearAll}
                className="btn btn-danger text-nowrap m-1"
                style= {{ minHeight: '43px' }}
              >
                Clear
              </button>
            </div>
          : '' }
        </div>

        {/* Start table widget content */}
        {applications.length == 0 ? <p style={{ fontSize: '1rem', fontWeight: '500' }}><center>You have not applied to any jobs yet!</center></p> : 
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
                                  { item?.job_type ?
                                        <li>
                                          <span className="icon flaticon-clock-3"></span>
                                          {item?.job_type}
                                        </li>
                                        : '' }
                                    { item?.job_address ?
                                        <li>
                                          <span className="icon flaticon-map-locator"></span>
                                          {item?.job_address}
                                        </li>
                                        : '' }
                                    {/* location info */}
                                    { item?.salary ?
                                        <li>
                                          <span className="icon flaticon-money"></span>{" "}
                                          ${item?.salary} {item?.salary_rate}
                                        </li>
                                        : '' }
                                    {/* salary info */}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{ item.created_at }</td>
                        { item.status == "Qualified" ?
                            <td className="status">{ item.status }</td>
                            : item.status == "Not Qualified" ?
                            <td className="status" style={{ color: 'red' }}>{ item.status }</td>
                            : item.status == null ? 
                            <td className="pending">Pending</td>
                            : <td className="pending">{ item.status }</td>
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
              </div>
            </div>
          </div>
        }
      </div>
  );
};

export default JobListingsTable;
