import Link from "next/link";
// import jobs from "../../../data/job-featured";
import Pagination from "../components/Pagination";
import JobSelect from "../components/JobSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDatePosted,
  addExperienceSelect,
  addJobTypeSelect,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
} from "../../../features/filter/filterSlice";
import { db } from "../../common/form/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../config/supabaseClient";

const FilterJobBox = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const searchTerm = useSelector((state) => state.search.searchTerm)
  const searchAddress = useSelector((state) => state.search.searchAddress)
  const pageSize = useSelector((state) => state.filter.jobSort.perPage.end)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [noOfPage, setNoOfPages] = useState(0)
  const handlePageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }

  // const searchJobsWithTermAndAddress = async () => {
  //   await supabase.from('jobs').select('*', {count: 'exact'})
  //   .eq('status', 'Published')
  //   .ilike('job_title', '%'+searchTerm+'%')
  //   .ilike('job_address', '%'+searchAddress+'%')
  //   .then((res) => {
  //     setJobs(res.data)
  //   })
  // };

  // const searchJobsWithTerm = async () => {
  //   await supabase.from('jobs').select('*', {count: 'exact'})
  //   .eq('status', 'Published')
  //   .ilike('job_title', '%'+searchTerm+'%')
  //   .then((res) => {
  //     setJobs(res.data)
  //   })
  // };

  // const searchJobsWithAddress = async () => {
  //   await supabase.from('jobs').select('*', {count: 'exact'})
  //   .eq('status', 'Published')
  //   .ilike('job_address', '%'+searchAddress+'%')
  //   .then((res) => {
  //     setJobs(res.data)
  //   })
  // };

  const searchJobs = async () => {

    let query = supabase.from('jobs').select('*', {count: 'exact'})
    if(searchAddress) query = query.ilike('job_address', '%'+searchAddress+'%')
    if(searchTerm) query = query.ilike('job_title', '%'+searchTerm+'%')
    query = query.eq('status', 'Published')
    query = query.order('created_at',  { ascending: sort == 'des' })
    query = query.range((currentPage - 1) * pageSize, (currentPage * pageSize) - 1)

    // const {data, error} = await query
    // if(data) {
    //   console.log(data)
    //   setJobs(data)
    // }

    query.then(res => {
      setJobs(res.data)
      setTotalRecords(res.count)
      setNoOfPages(Math.ceil(res.count / pageSize))
    })

    // await supabase.from('jobs').select('*', {count: 'exact'})
    // .eq('status', 'Published')
    // .then((res) => {
    //   setJobs(res.data)
    // })
  };

  useEffect(() => {
    // if(searchAddress == "" && searchTerm == '') 
      searchJobs()
    // else if(searchAddress == "") 
    //   searchJobsWithTerm()
    // else if(searchTerm == "") 
    //   searchJobsWithAddress()
    // else 
    //   searchJobsWithTermAndAddress()
  }, [searchAddress, searchTerm, currentPage, pageSize]);

  const { jobList, jobSort } = useSelector((state) => state.filter);
  const {
    keyword,
    location,
    destination,
    category,
    datePosted,
    jobTypeSelect,
    experienceSelect,
    salary,
  } = jobList || {};

  const { sort, perPage } = jobSort;

  const dispatch = useDispatch();

  // keyword filter on title
  const keywordFilter = (item) =>
    keyword !== ""
      ? item.jobTitle.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      : item;

  // location filter
  const locationFilter = (item) =>
    location !== ""
      ? item?.location
          ?.toLocaleLowerCase()
          .includes(location?.toLocaleLowerCase())
      : item;

  // location filter
  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  // category filter
  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  // job-type filter
  const jobTypeFilter = (item) =>
    item.jobType !== undefined && jobTypeSelect !== ""
      ? item?.jobType[0]?.type.toLocaleLowerCase().split(" ").join("-") ===
          jobTypeSelect && item
      : item;

  // date-posted filter
  const datePostedFilter = (item) =>
    datePosted !== "all" && datePosted !== ""
      ? item?.created_at
          ?.toLocaleLowerCase()
          .split(" ")
          .join("-")
          .includes(datePosted)
      : item;

  // experience level filter
  const experienceFilter = (item) =>
    experienceSelect !== ""
      ? item?.experience?.split(" ").join("-").toLocaleLowerCase() ===
          experienceSelect && item
      : item;

  // salary filter
  const salaryFilter = (item) =>
    item?.totalSalary?.min >= salary?.min &&
    item?.totalSalary?.max <= salary?.max;

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

  let content = jobs
    // ?.filter(keywordFilter)
    // ?.filter(locationFilter)
    // ?.filter(destinationFilter)
    // ?.filter(categoryFilter)
    // ?.filter(jobTypeFilter)
    // ?.filter(datePostedFilter)
    // ?.filter(experienceFilter)
    // ?.filter(salaryFilter)
    // ?.sort(sortFilter)
    // .slice(perPage.start, perPage.end !== 0 ? perPage.end : 16)
    ?.map((item) => (
      <div className="job-block col-lg-6 col-md-12 col-sm-12 45" key={item.job_id}>
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
                          {/* <span className="flaticon-clock-3"></span> */}
                          {item?.job_type}
                        </li>
                        : '' }
                    {/* compnay info */}
                    {/* { item?.job_address ?
                        <li className="required">
                          <span className="flaticon-map-locator"></span>
                          {item?.job_address}
                        </li>
                        : '' } */}
                    {/* location info */}
{/*
                    <li>
                      <span className="flaticon-briefcase"></span>{" "}
                      {item?.industry}
                    </li>
 */}
                    {/* time info */}
                    { item?.salary ?
                        <li className="privacy">
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
      // End all jobs
    ));

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
    setCurrentPage(1)
  };

  // clear all filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addCategory(""));
    dispatch(addJobTypeSelect(""));
    dispatch(addDatePosted(""));
    dispatch(addExperienceSelect(""));
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 10 }));
  };

  // useEffect(() => {
  //   supabase.from('jobs')
  //   .select()
  //   .eq('status', 'Published')
  //   .order('created_at',  { ascending: sort == 'asc' })
  //   .then((res) => {
  //     setJobs(res.data)
  //   })
  //   .catch((e) => {
  //     console.log(e)
  //   })
  // }, [sort])

  // useEffect(() => {
  //   if(jobTypeSelect){
  //     supabase.from('jobs')
  //     .select()
  //     .eq("job_type", jobTypeSelect)
  //     .eq('status', 'Published')
  //     .order('created_at',  { ascending: false })
  //     .then((res) => {
  //       setJobs(res.data)
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  //   }
  // }, [jobTypeSelect])

  // useEffect(() => {
  //   if(experienceSelect !== 'Experience Level'){
  //     supabase.from('jobs')
  //     .select()
  //     .eq("experience", experienceSelect)
  //     .eq('status', 'Published')
  //     .order('created_at',  { ascending: false })
  //     .then((res) => {
  //       setJobs(res.data)
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  //   }
  // }, [experienceSelect])


  // useEffect(() => {
  //   let searchDate = null
  //   let d = new Date()
  //   switch(datePosted){
  //     case 'last-24-hour': 
  //       d.setDate(d.getDate() - 1)
  //       searchDate = d.toISOString()
  //       break
  //     case 'last-7-days': 
  //       d.setDate(d.getDate() - 7)
  //       searchDate = d.toISOString()
  //       break 
  //     case 'last-14-days': 
  //       d.setDate(d.getDate() - 14)
  //       searchDate = d.toISOString()
  //       break
  //     case 'last-30-days': 
  //       d.setDate(d.getDate() - 30)
  //       searchDate = d.toISOString()
  //       break
  //   }
  //   supabase.from('jobs')
  //   .select()
  //   .gte("created_at", searchDate)
  //   .eq('status', 'Published')
  //   .order('created_at',  { ascending: false })
  //   .then((res) => {
  //     setJobs(res.data)
  //   })
  //   .catch((e) => {
  //     console.log(e)
  //   })
  // }, [datePosted])

  const fnCall = async () => {
      let searchDate = null
      let d = new Date()
      switch(datePosted){
        case 'last-24-hour': 
          d.setDate(d.getDate() - 1)
          searchDate = d.toISOString()
          break
        case 'last-7-days': 
          d.setDate(d.getDate() - 7)
          searchDate = d.toISOString()
          break 
        case 'last-14-days': 
          d.setDate(d.getDate() - 14)
          searchDate = d.toISOString()
          break
        case 'last-30-days': 
          d.setDate(d.getDate() - 30)
          searchDate = d.toISOString()
          break
      }
      let query = supabase.from('jobs').select().eq('status', 'Published')
      if(jobTypeSelect) query = query.eq("job_type", jobTypeSelect)
      if(searchDate) query = query.gte("created_at", searchDate)
      query = query.eq('status', 'Published')
      query = query.order('created_at',  { ascending: sort == 'des' })

      const {data, error} = await query
      if(data) setJobs(data)
    
  }
  useEffect(() => {
    if(sort !== '' || jobTypeSelect !== "" || datePosted !== "")
    fnCall()
  }, [jobTypeSelect, sort, datePosted])

  // 
  
  return (
    <>
      <div className="ls-switcher">
        <JobSelect />
        {/* End .showing-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          category !== "" ||
          jobTypeSelect !== "" ||
          datePosted !== "" ||
          experienceSelect !== "" ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 10 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

            {/* <button
              onClick={clearAll}
              className="btn btn-primary text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Apply Filter
            </button> */}
          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 30,
              })}
            >
              30 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 50,
              })}
            >
              50 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 100,
              })}
            >
              100 per page
            </option>
          </select>
          {/* End select */}
        </div>
        {/* End sort by filter */}
      </div>
      {/* <!-- ls Switcher --> */}

      <div className="row">{content}</div>
      {/* End .row with jobs */}

      {
        totalRecords > 0 ? 
        <Pagination handlePageChange={handlePageChange} currentPage={currentPage} noOfPage={noOfPage} />
        : <p><center><strong> No jobs found</strong></center></p>
      }
      
      {/* <!-- End Pagination --> */}
    </>
  );
};

export default FilterJobBox;
