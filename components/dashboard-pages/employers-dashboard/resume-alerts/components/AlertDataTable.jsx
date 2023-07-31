import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner'


const AlertDataTable = () => {

  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter();

  const [rpp, setRpp] = useState(20);
  const [arrPages, setArrPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    fetchPost(keyword, currentPage);
  }, []);

  const handleKeyword = async (e) => {
    setKeyword(e.target.value);
    fetchPost(e.target.value, currentPage);
  }

  const fetchPost = async (newKeyword, pageNo) => {
    setKeyword(newKeyword);
    setIsLoading(true);
    if (newKeyword != null) {
      let { data, error } = await supabase
        .from('notification')
        .select()
        .like('notification_text', '%' + newKeyword + '%')
        //.eq('user_id', user.id)
        .is('deleted', null)
        //.not('status',"eq",'Qualified');
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) {
        setUserData(data);
      }
      setIsLoading(false);
    } else {


      let countTotalRecords = await supabase
        .from('notification')
        .select('*', { count: 'exact', head: true })
        //.eq('user_id', user.id)
        .is('deleted', null);
      let totalRecords = countTotalRecords.count;
      
      let recordPerPage = rpp;
      let totalPages = Math.ceil(totalRecords / recordPerPage);
      setTotalPages(totalPages);
      console.log("totalRecords",totalRecords,"recordPerPage",recordPerPage,"totalPages",totalPages);
      if (totalPages) {
        let arrPage = [];
        for (var i = 1; i <= totalPages; i++) {
          arrPage.push(i);
        }
        console.log("arrPage",arrPage);
        setArrPages(arrPage);
        let start_limit = parseInt(parseInt(pageNo - 1) * parseInt(rpp));
        if (pageNo < 1) {
          start_limit = parseInt(parseInt(pageNo) * parseInt(rpp));
        }
        let end_limit = parseInt(start_limit) + parseInt(rpp);
        console.log("start_limit", start_limit, "end_limit", end_limit);
        setCurrentPage(pageNo);

        let { data, error } = await supabase
          .from('notification')
          .select()
          //.eq('user_id', user.id)
          //.not('status',"eq",'Qualified');
          .is('deleted', null)
          .order('created_at', { ascending: false })
          .range(start_limit, end_limit);
        if (data) {
          setUserData(data);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }

  const handleDeleteNotification = async (id) => {
    let result = await supabase
      .from('notification')
      .delete()
      .eq('id', id);
      toast.success('Resume Alert Deleted successfully.', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    if (result) {
      fetchPost(keyword, currentPage);
    }
  }

  const handleNextPage = (pageNo) => {
    setIsLoading(true);
    fetchPost(keyword, pageNo);
  }


  return (
    <div>

       
          <div>
            <div className="search-box-one">
              <form method="post" action="blog.html">
              
              <div className="form-group pull-left mb-3">
              <h4>Resume Alerts!</h4>
              </div>
                <div className="form-group pull-right mb-3">
                
                  <span className="icon flaticon-search-1"></span>
                  <input
                    type="search"
                    onChange={(e) => handleKeyword(e)}
                    name="search-field"
                    value={keyword}
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
              <br />
            </div>

            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Notification</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              {/* End thead */}

              <tbody>
              { isLoading &&
          <tr>
            <td colspan="4" align="center">
            <div style={{ width: '100%', margin: "auto" ,textAlign:'center' }}>
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#000"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle={{justifyContent:'center'}}
              visible={true}
            />
          </div>
            </td>
          </tr>
        }
                {userData && userData.map((candidate) => (
                  <tr>
                    <td>{candidate.type}</td>
                    <td>
                    <div dangerouslySetInnerHTML={{ __html: candidate.notification_text}}></div>
                    
                    </td>
                    <td>{moment(candidate.created_at).format("MMMM D, YYYY")}</td>
                    <td>
                      <button onClick={() => { handleDeleteNotification(candidate.id) }}>
                        <i className="la la-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {
              isLoading == false && userData.length == 0 && <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: 40, paddingTop: 40, textAlign: 'center' }}><center>No any resume alert  yet!</center></p>
            }
            {
              userData.length != 0 && arrPages.length > 1 &&
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
          </div>

    </div>

  );
};

export default AlertDataTable;
