import Link from "next/link";
import candidatesData from "../../../../../data/candidates";
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BallTriangle } from 'react-loader-spinner'

const Applicants = () => {

  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter();

  const [rpp, setRpp] = useState(200);
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
        .from('applications')
        .select()
        .eq('cust_id', user.id)
        .like('name', '%' + newKeyword + '%')
        //.not('status',"eq",'Qualified');
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) {
        setUserData(data);
        setIsLoading(false);
      }
    } else {
      let countTotalRecords = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true }).eq('cust_id', user.id);

      // Fetching All Records && Make Record Unique Start //
      let fetchAllRecords = await supabase
        .from('applications')
        .select().eq('cust_id', user.id);
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
          .from('applications')
          .select().eq('cust_id', user.id)
          //.not('status',"eq",'Qualified');
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);
        if (data) {

          // Make Record Unique Start //
          const unique = data.filter(
            (obj, index) =>
              data.findIndex((item) => item.user_id === obj.user_id) === index
          );
          // Make Record Unique Over //

          setUserData(unique);
          setIsLoading(false);
        }
      }
    }
  }

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
      <div className="chosen-outer">
        {/* <!--search box--> */}
        <div className="search-box-one">
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
              <figure className="image">
              <img src={"/images/resource/candidate-1.png"} alt="candidates" />
                
              </figure>
              <h4 className="name"><Link href={'/candidates-single-v1/'+candidate.user_id} className="text-nowrap m-1">{candidate.name}{candidate.id}</Link></h4>

              <ul className="candidate-info">
                <li className="designation">{candidate.license_nbr}</li>

                {
                  candidate.status != null && <li className={candidate.status == 'Qualified' ? 'privacy' : 'required'}>{candidate.status}</li>
                }

              </ul>
              <div className="small" style={{ fontSize: 10, lineHeight: "10px" }}>{candidate.candidate_message}</div>
              {/* End candidate-info */}
              <div className="option-box1">
                <ul className="option-list">
                  <li onClick={() => { ViewCV(candidate.doc_dwnld_url.slice(14, -2)) }}>
                    <button data-text="View/Download CV">
                      <span className="la la-file-download"></span>
                    </button>
                  </li>
                  <li onClick={() => { Qualified(candidate.application_id, candidate.status) }} >
                    <button data-text="Qualified">
                      <span className="la la-check"></span>
                    </button>
                  </li>
                  <li onClick={() => { NotQualified(candidate.application_id, candidate.status) }} >
                    <button data-text="Not Qualified">
                      <span className="la la-times-circle"></span>
                    </button>
                  </li>
                  <li onClick={() => { ResetStatus(candidate.application_id, candidate.status) }} >
                    <button data-text="Reset Status">
                      <span className="la la-undo-alt"></span>
                    </button>
                  </li>
                </ul>
              </div>
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