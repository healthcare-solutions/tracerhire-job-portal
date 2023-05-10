import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../common/form/firebase";
// import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";

const JobListingsTable = () => {
  const [jobs, setjobs] = useState([]);
  const [searchField, setSearchField] = useState('');
  //const [jobStatus, setJobStatus] = useState('');
  const user = useSelector(state => state.candidate.user)
  const router = useRouter();

  // const fetchPost = async () => {
  //   const userJoblistQuery  = query(collection(db, "jobs"), where("user", "==", user.id))
  //   await getDocs(userJoblistQuery).then((querySnapshot) => {
  //     const newData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setjobs(newData);
  //   });
  // };

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
  }

  // Publish job action
  const publishJob = async (jobId, status) => {
    if (status !== 'Published') {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: 'Published' })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully published!', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching all posts to refresh the data in Job Listing Table
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already published!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  // Unpublish job action
  const unpublishJob = async (jobId, status) => {
    if (status !== 'Unpublished') {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: 'Unpublished' })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully unpublished!', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching all posts to refresh the data in Job Listing Table
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already unpublished!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  // clear all filters
  const clearAll = () => {
    setSearchField('');
    fetchPost()
  };

  // Search function
  async function findJob () {

    let { data, error } = await supabase
        .from('manage_jobs_view')
        .select()
        .order('created_at',  { ascending: false });
        data.forEach( job => job.created_at = dateFormat(job.created_at))
        setjobs(data) 

        setjobs(data.filter((job) => job.job_title.toLowerCase().includes(searchField.toLowerCase())))
    };

  // Initial Function
  const fetchPost = async () => {
    let { data, error } = await supabase
      .from('manage_jobs_view')
      .select()
      .order('created_at',  { ascending: false });

      data.forEach( job => job.created_at = dateFormat(job.created_at))
      setjobs(data)
  }
  

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

        
        {jobs.length != 0 ?
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
            onClick={findJob}
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
        </div> : '' }
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      {jobs.length == 0 ? <p style={{ fontSize: '1rem', fontWeight: '500' }}><center>You have not posted any jobs yet!</center></p>: 
        <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applications</th>
                <th>Published On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((item) => (
                <tr key={item.job_id}>
                  <td>
                    {/* <!-- Job Block --> */}
                    <div className="job-block">
                      <div className="inner-box">
                        <div>
                          {/* <span className="company-logo">
                            <img src={item.logo} alt="logo" />
                          </span> */}
                          <h4>
                            <Link href={`/employers-dashboard/edit-job/${item.job_id}`}>
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
                            {/* End .job-info */}

                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                    <a onClick={()=>{
                      router.push(`/employers-dashboard/all-applicants-view/${item.job_id}`)
                    }}>
                      {item.total_applicants > 0 ? `${item.total_applicants} applied` : 'No applications yet'}
                    </a>
                  </td>
                  <td>
                  {item?.created_at}
                  </td>
                  { item?.status == 'Published' ?
                    <td className="status">{item.status}</td>
                    : <td className="status" style={{ color: 'red' }}>{item.status}</td> }
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li onClick={()=>{
                          router.push(`/employers-dashboard/clone-job/${item.job_id}`)
                        }}>
                          <button data-text="Clone Job">
                            <span className="la la-copy"></span>
                          </button>
                        </li>
                        <li onClick={()=>{
                          router.push(`/job/${item.job_id}`)
                        }}>
                          <button data-text="Preview Job">
                            <span className="la la-file-alt"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ publishJob(item.job_id, item.status) }} >
                          <button data-text="Publish Job">
                            <span className="la la-eye"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ unpublishJob(item.job_id, item.status) }}>
                          <button data-text="Unpublish Job" disabled>
                            <span className="la la-trash"></span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      }
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
