import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
//import Router from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../common/form/firebase";
// import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import { BallTriangle } from 'react-loader-spinner'


const JobListingsTable = () => {
  const [jobs, setjobs] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [rpp, setRpp] = useState(20);
  const [arrPages, setArrPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState('');
  const user = useSelector(state => state.candidate.user)
  const router = useRouter();
  const inputRef = useRef(null);

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
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
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
      fetchPost(currentPage);
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
      fetchPost(currentPage);
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

  const fetchAllPost = async (pageNo) => {
      setIsLoading(true);
      let countTotalRecords = await supabase
      .from('manage_jobs_view')
      .select('*', { count: 'exact', head: true });
      //.eq('user_id', user.id);
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

        let { data, error } = await supabase
          .from('manage_jobs_view')
          .select()
          //.eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        data.forEach(job => job.created_at = dateFormat(job.created_at))
        setjobs(data);   
      }
      setIsLoading(false);
};

  // clear all filters
  const clearAll = () => {
      setSearchField('');
      setJobStatus('');
      fetchAllPost(currentPage);
  };

  const handleAddNew = () => {

  }

  // Search function
  async function findJob() {

    let { data, error } = await supabase
      .from('manage_jobs_view')
      .select()
      //.eq('user_id', user.id)
      .order('created_at', { ascending: false });
    data.forEach(job => job.created_at = dateFormat(job.created_at))
    setjobs(data)

    setjobs(data.filter((job) => job.job_title.toLowerCase().includes(searchField.toLowerCase())))
  };

  // Initial Function
  const fetchPost = async (pageNo) => {
    setIsLoading(true);
    if (searchField != '' && jobStatus != '') {
      let countTotalRecords = await supabase
      .from('manage_jobs_view')
      .select('*', { count: 'exact', head: true }).eq('status', jobStatus)
      .ilike('job_title', '%' + searchField + '%')
      .eq('status', jobStatus);
      //.eq('user_id', user.id);
      let totalRecords = countTotalRecords.count;
      let recordPerPage = rpp;
      let totalPages = Math.ceil(totalRecords / recordPerPage);
      setTotalPages(totalPages);
      //if (totalPages) {
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

        let { data, error } = await supabase
          .from('manage_jobs_view')
          .select()
          //.eq('user_id', user.id)
          .ilike('job_title', '%' + searchField + '%')
          .eq('status', jobStatus)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        data.forEach(job => job.created_at = dateFormat(job.created_at))
        setjobs(data);  
      //}
      setIsLoading(false);

    } else if (searchField != '') {
      let countTotalRecords = await supabase
      .from('manage_jobs_view')
      .select('*', { count: 'exact', head: true }).eq('status', jobStatus)
      .ilike('job_title', '%' + searchField + '%');
      //.eq('user_id', user.id);
      let totalRecords = countTotalRecords.count;
      let recordPerPage = rpp;
      let totalPages = Math.ceil(totalRecords / recordPerPage);
      setTotalPages(totalPages);
      //if (totalPages) {
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

        let { data, error } = await supabase
          .from('manage_jobs_view')
          .select()
          //.eq('user_id', user.id)
          .ilike('job_title', '%' + searchField + '%')
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        data.forEach(job => job.created_at = dateFormat(job.created_at))
        setjobs(data);
      //}
      setIsLoading(false);

    } else if (jobStatus != '') {
      let countTotalRecords = await supabase
      .from('manage_jobs_view')
      .select('*', { count: 'exact', head: true })
      .eq('status', jobStatus);
      //.eq('user_id', user.id);
      let totalRecords = countTotalRecords.count;
      let recordPerPage = rpp;
      let totalPages = Math.ceil(totalRecords / recordPerPage);
      setTotalPages(totalPages);
      //if (totalPages) {
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
        let { data, error } = await supabase
          .from('manage_jobs_view')
          .select()
          //.eq('user_id', user.id)
          .eq('status', jobStatus)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        data.forEach(job => job.created_at = dateFormat(job.created_at))
        setjobs(data);  
      //}
      setIsLoading(false);

    } else {
      let countTotalRecords = await supabase
      .from('manage_jobs_view')
      .select('*', { count: 'exact', head: true });
      //.eq('user_id', user.id);
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

        let { data, error } = await supabase
          .from('manage_jobs_view')
          .select()
          //.eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);

        data.forEach(job => job.created_at = dateFormat(job.created_at))
        setjobs(data);   
      }
      setIsLoading(false);
    }
  }

  const handleNextPage = (pageNo) => {
    setIsLoading(true);
    fetchPost(pageNo);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchPost(currentPage);
  }, []);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

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

        {isLoading == false  ?
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
                      
          <select
            className="chosen-single form-select chosen-container mx-3"
            value={jobStatus}
            onChange={(e) => {
              setJobStatus(e.target.value)
            }}
          >
            <option value="">Status</option>
            <option value="Published">Published</option>
            <option value="Unpublished">Unpublished</option>
          </select>

            <button
              onClick={() => {fetchPost(1)}}
              className="btn btn-primary text-nowrap m-1"
              style={{ minHeight: '43px' }}
            >
              Search
            </button>
            <button
              onClick={clearAll}
              ref={inputRef}
              className="btn btn-danger text-nowrap m-1"
              style={{ minHeight: '43px' }}
            >
              Clear
            </button>
            <Link href={`/employers-dashboard/post-jobs`}>
              <button
                className="btn btn-success text-nowrap m-1"
                style={{ minHeight: '43px' }}
              >
                Add New
              </button>
            </Link>

          </div> : ''}
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      
        <div className="widget-content">
        {isLoading == false && jobs.length == 0 ? <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: 40 }}><center>No Jobs Found! </center></p> 
            :
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
                            {/* End .job-info */}

                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="applied">
                      {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                      <a onClick={() => {
                        router.push(`/employers-dashboard/all-applicants-view/${item.job_id}`)
                      }}>
                        {item.total_applicants > 0 ? `${item.total_applicants} applied` : 'No applications yet'}
                      </a>
                    </td>
                    <td>
                      {item?.created_at}
                    </td>
                    {item?.status == 'Published' ?
                      <td className="status">{item.status}</td>
                      : <td className="status" style={{ color: 'red' }}>{item.status}</td>}
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li onClick={() => {
                            router.push(`/employers-dashboard/clone-job/${item.job_id}`)
                          }}>
                            <button data-text="Clone Job">
                              <span className="la la-copy"></span>
                            </button>
                          </li>
                          <li onClick={() => {
                            router.push(`/job/${item.job_id}`)
                          }}>
                            <button data-text="Preview Job">
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li onClick={() => { publishJob(item.job_id, item.status) }} >
                            <button data-text="Publish Job">
                              <span className="la la-check"></span>
                            </button>
                          </li>
                          <li onClick={() => { unpublishJob(item.job_id, item.status) }}>
                            <button data-text="Unpublish Job" disabled>
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}

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
                          if(arrPages.length > 6){
                            let nextThreePages = item - 4;
                            let prevThreePages = item + 4;
                            if(currentPage > nextThreePages){
                              if(currentPage < prevThreePages){
                              return (
                                <li><a onClick={() => handleNextPage(item)} className={item == currentPage ? 'current-page' : 'non-current-page'}>{item}</a></li>
                              )
                              }
                            }
                          } else{
                            return (
                              <li><a onClick={() => handleNextPage(item)} className={item == currentPage ? 'current-page' : 'non-current-page'}>{item}</a></li>
                            )
                          }
                          
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
              </tbody>
            </table>
          </div>
          }
        </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;