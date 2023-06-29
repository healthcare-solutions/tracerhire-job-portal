import { faker } from "@faker-js/faker";
import moment from 'moment';
import { useSelector } from "react-redux";
import { supabase } from "../../../../../config/supabaseClient";
import { BallTriangle } from 'react-loader-spinner'
import { useEffect, useState } from "react";




const ProfileChart = () => {

  let today_date = new Date();
  
  let one_month_ago = today_date.setMonth(today_date.getMonth() - 1);
  const last_month_date = new Date(one_month_ago);
  const last_month_date_format = (last_month_date.getMonth() + 1) + "-" + last_month_date.getDate() + "-" + last_month_date.getFullYear();
  
  let three_month_ago = today_date.setMonth(today_date.getMonth() - 2);
  const three_month_date = new Date(three_month_ago);
  const three_month_ago_format = (three_month_date.getMonth() + 1) + "-" + three_month_date.getDate() + "-" + three_month_date.getFullYear();

  let six_month_ago = today_date.setMonth(today_date.getMonth() - 2);
  const six_month_date = new Date(six_month_ago);
  const six_month_ago_format = (six_month_date.getMonth() + 1) + "-"+ six_month_date.getDate()  + "-" + six_month_date.getFullYear();

  let twelve_month_ago = today_date.setMonth(today_date.getMonth() - 2);
  const twelve_month_date = new Date(twelve_month_ago);
  const twelve_month_ago_format = (twelve_month_date.getMonth() + 1) + "-" + twelve_month_date.getDate() + "-" +  twelve_month_date.getFullYear();

  // console.log("last_month_date_format",last_month_date_format);
  // console.log("three_month_ago_format",three_month_ago_format);
  // console.log("six_month_ago_format",six_month_ago_format);
  // console.log("twelve_month_ago_format",twelve_month_ago_format);

  const user = useSelector(state => state.candidate.user);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
  const [searchField, setSearchField] = useState('');
  const [lastMonthField, setLastMonthField] = useState(last_month_date_format);
  const [threeMonthField, setThreeMonthField] = useState(three_month_ago_format);
  const [sixMonthField, setSixMonthField] = useState(six_month_ago_format);
  const [twelveMonthField, setTwelveMonthField] = useState(twelve_month_ago_format);

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
  }

  const fetchedAllApplicantsView = async (selectedMonth) => {
    console.log("selectedMonth",selectedMonth);
    let { data, error } = await supabase
      .from('applications_view')
      .select("*")
      .eq('cust_id', user.id)
      .gte('created_at', dateFormat(selectedMonth))
      .order('created_at', { ascending: false });
    if (data) {
      console.log("Dataaaaaaaaaaa",data);
      data.forEach(applicant => applicant.created_at = dateFormat(applicant.created_at));
      setFetchedAllApplicantsData(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    setSearchField(lastMonthField);
    fetchedAllApplicantsView(lastMonthField);
  }, []);

  const handleSelectedMonth = (selectedMonth) => {
    setSearchField(selectedMonth);
    fetchedAllApplicantsView(selectedMonth);
  }


  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Applications</h4>
        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select 
          className="chosen-single form-select"
          value={searchField}
              // onChange={(e) => {
              //   setSearchField(e.target.value);
              // }}
              onChange={(e) => {
                handleSelectedMonth(e.target.value);
              }}
          >
            <option value={lastMonthField}>Last 1 Months</option>
            <option value={threeMonthField}>Last 3 Months</option>
            <option value={sixMonthField}>Last 6 Months</option>
            <option value={twelveMonthField}>Last 12 Months</option>
          </select>
        </div>
      </div>
      {/* End widget top bar */}

      <div className="widget-content">
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
          isLoading == false && fetchedAllApplicants.length > 0 &&
          <ul className="notification-list">
            {
              fetchedAllApplicants.map((item,index) => {
                return (
                  <li>
                    <span className="icon flaticon-briefcase"></span>
                    <span className="colored1"><small>{item.application_id} ---- {item.job_title}<b>{moment(item.created_at).format("MMMM D, YYYY")}</b></small></span>
                  </li>
                )
              })
            }
          </ul>
        }
      </div>
    </div>
  );
};

export default ProfileChart;
