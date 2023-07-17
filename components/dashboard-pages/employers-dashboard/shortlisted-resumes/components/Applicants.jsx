import Link from "next/link";
import candidatesData from "../../../../../data/candidates";
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BallTriangle } from 'react-loader-spinner';

const Applicants = () => {

  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter();

  const [rpp, setRpp] = useState(200);
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");
  const [arrPages, setArrPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    fetchPost(keyword, currentPage);
  }, []);

  const handleNextPage = (pageNo) => {
    setIsLoading(true);
    fetchPost(keyword, pageNo);
  }

  const handleKeyword = async (e) => {
    fetchPost(e.target.value, currentPage);
  }

  const fetchPost = async (newKeyword, pageNo) => {
    setKeyword(newKeyword);
    setIsLoading(true);
    if (newKeyword != null) {
      let { data, error } = await supabase
        .from('applications_view')
        .select()
        //.eq('cust_id', user.id)
        .ilike('name', '%' + newKeyword + '%')
        //.not('status',"eq",'Qualified');
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) {
        // Make Record Unique Start //
        const unique = data.filter(
          (obj, index) =>
            data.findIndex((item) => item.user_id === obj.user_id) === index
        );
        let arrData = [];
          for (const item of unique) {
            const fetchUser = await supabase
            .from('cust_dtl')
            .select()
            .eq('cust_id',item.user_id);
            if(fetchUser){
              let photo_url = '/images/resource/candidate-1.png';
              if(fetchUser.data.length > 0 && fetchUser.data[0].profile_logo != null){
                photo_url = cloudPath+fetchUser.data[0].profile_logo;
              }
              if(fetchUser.data.length > 0){
                let objData = {
                  application_id: item.application_id,
                  created_at: item.created_at,
                  cust_id: item.cust_id,
                  doc_dwnld_url: item.doc_dwnld_url,
                  email: item.email,
                  job_id: item.job_id,
                  name: item.name,
                  status: item.status,
                  user_id: item.user_id,
                  photo_url : photo_url,
                  city:fetchUser.data[0].city,
                  state:fetchUser.data[0].st_cd,
                  country:fetchUser.data[0].country,
                  job_title: fetchUser.data[0].company_name,
                  departments: fetchUser.data[0].departments != "" ? fetchUser.data[0].departments.split(",") : ""
                }
                arrData.push(objData);
              }
            }
          }
          // Make Record Unique Over //
          if(arrData){
            setUserData(arrData);
          } else {
            setUserData(unique);
          }
        // Make Record Unique Over //

        setIsLoading(false);
      }
    } else {
      let countTotalRecords = await supabase
        .from('applications_view')
        .select('*', { count: 'exact', head: true });
        //.eq('cust_id', user.id);

      // Fetching All Records && Make Record Unique Start //

      // let fetchAllRecordsbkp = await supabase
      //   .from('applications_view')
      //   .select(`application_id,user_id,email,name,cust_id,user_id,candidate_message,cust_dtl:cust_id(cust_id,profile_logo)`).eq('cust_id', user.id);
      //   console.log("fetchAllRecordsbkp",fetchAllRecordsbkp);

      let fetchAllRecords = await supabase
        .from('applications_view')
        .select();
        //.eq('cust_id', user.id);
      let allData = fetchAllRecords.data;
      const uniqueRecords = allData.filter(
        (obj, index) =>
          allData.findIndex((item) => item.user_id === obj.user_id) === index
      );
      // Fetching All Records && Make Record Unique Over //

      //let totalRecords = countTotalRecords.count;
      let totalRecords = uniqueRecords.length;
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
        //console.log("start_limit", start_limit, "end_limit", end_limit);
        setCurrentPage(pageNo);
        let { data, error } = await supabase
          .from('applications_view')
          .select()
          //.eq('cust_id', user.id)
          //.not('status',"eq",'Qualified');
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);
        if (data) {

          // Make Record Unique Start //
          const unique = data.filter(
            (obj, index) =>
              data.findIndex((item) => item.user_id === obj.user_id) === index
          );
          let arrData = [];
          for (const item of unique) {
            const fetchUser = await supabase
            .from('cust_dtl')
            .select()
            .eq('cust_id',item.user_id);
            if(fetchUser && fetchUser !== undefined){
              let photo_url = '/images/resource/candidate-1.png';
              if(fetchUser.data.length > 0 && fetchUser.data[0].profile_logo != null){
                photo_url = cloudPath+fetchUser.data[0].profile_logo;
              }
              if(fetchUser.data[0] !== undefined){
                console.log("fetchUser.data[0].departments",fetchUser.data[0].departments);
                let objData = {
                  application_id: item.application_id,
                  created_at: item.created_at,
                  cust_id: item.cust_id,
                  doc_dwnld_url: item.doc_dwnld_url,
                  email: item.email,
                  job_id: item.job_id,
                  job_title: item.job_title,
                  name: item.name,
                  status: item.status,
                  user_id: item.user_id,
                  photo_url : photo_url,
                  city:fetchUser.data[0].city,
                  state:fetchUser.data[0].st_cd,
                  country:fetchUser.data[0].country,
                  job_title: fetchUser.data[0].company_name,
                  departments: fetchUser.data[0].departments != "" ? fetchUser.data[0].departments.split(",") : ""
                }
                arrData.push(objData);
              }
            }
          }
          // Make Record Unique Over //
          if(arrData){
            setUserData(arrData);
          } else {
            setUserData(unique);
          }
          setIsLoading(false);
        }
      }
    }
  }

  console.log("userData",userData);

  const ViewCV = async (url) => {
    window.open(url, '_blank', 'noreferrer');
  }

  const Qualified = async (applicationId, status) => {
    if (status != 'Qualified') {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: 'Qualified' })
        .eq('application_id', applicationId)

      // open toast
      toast.success('Applicant status marked as Qualified.  Please let Applicant know about your decision!', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching for refresh the data
      fetchPost(keyword, currentPage);
    } else {
      // open toast
      toast.error('Applicant status is already marked as Qualified!', {
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

  const NotQualified = async (applicationId, status) => {
    if (status != 'Not Qualified') {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: 'Not Qualified' })
        .eq('application_id', applicationId)

      // open toast
      toast.success('Applicant status marked as Not Qualified.  Please let Applicant know about your decision!', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching for refresh the data
      fetchPost(keyword, currentPage);
    } else {
      // open toast
      toast.error('Applicant status is already marked as Not Qualified!', {
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

  const ResetStatus = async (applicationId, status) => {
    if (status != null) {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: null })
        .eq('application_id', applicationId)

      // open toast
      toast.success('Applicant status reset successfully.', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching for refresh the data
      fetchPost(keyword, currentPage);
    } else {
      // open toast
      toast.error('Applicant status is already reset!', {
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
    <>
      
      <div className="chosen-outer">
        {/* <!--search box--> */}
        
        <div className="search-box-one">
        <h4 style={{float:'left'}}>Candidates</h4>
          <form method="post" action="blog.html">
            <div className="form-group pull-right mb-3">
            
              <span className="icon flaticon-search-1"></span>
              <input
                type="search"
                onChange={(e) => handleKeyword(e)}
                name="search-field"
                placeholder="Search"
                required
              />
            </div>
          </form>
          <br />
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
        </div>
        {/* End searchBox one */}

        {/* <!--Tabs Box--> */}
        {/* <select className="chosen-single form-select chosen-container">
        <option>Newest</option>
        <option>Last 12 Months</option>
        <option>Last 16 Months</option>
        <option>Last 24 Months</option>
        <option>Last 5 year</option>
      </select> */}
      </div>
      {isLoading == false && userData && userData.map((candidate) => (
        <div
          className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
          key={candidate.application_id}
        >
          <div className="inner-box">
            <div className="content job-other-info">
              <figure className="image"><img src={candidate.photo_url} alt="candidates" /></figure>
              <h4 className="name"><Link href={'/candidate-details/'+candidate.user_id} className="text-nowrap m-1">{candidate.name}{candidate.id}</Link></h4>

              <ul className="candidate-info">
                <li className="designation w-100 mb-3"><span style={{fontSize:15}} className="icon flaticon-map-locator"><small style={{fontSize:15, paddingLeft:5, position:'relative', top:-3}}>{candidate.city},{candidate.state}</small></span></li>

                {
                    // <li className={'privacy'}><small>{candidate.departments}</small></li>
                    candidate.departments != "" && candidate.departments.length > 0 && candidate.departments.map((item,index) => {
                      return(
                        <li className={'privacy'}><small>{item}</small></li>
                      )
                  })
                }

              </ul>
            </div>


            {/* End content */}


            {/* End admin options box */}
          </div>
        </div>

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
    </>
  );

};

export default Applicants;