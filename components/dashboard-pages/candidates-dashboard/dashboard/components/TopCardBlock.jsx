import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner';
import Link from "next/link";

const TopCardBlock = () => {

  const user = useSelector(state => state.candidate.user);
  const [totalAppliedJobs, setTotalAppliedJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalShortlist, setTotalShortlist] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    let countTotalAppliedJobs = await supabase
      .from('applications_view')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    if (countTotalAppliedJobs.count > 0) {
      setTotalAppliedJobs(countTotalAppliedJobs.count);
    }

    let countTotalApplications = await supabase
      .from('notification')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('deleted', null);
    //console.log("countTotalApplications", countTotalApplications);
    if (countTotalApplications.count > 0) {
      setTotalApplications(countTotalApplications.count);
    }

    

      let total_unread = 0;

      const fetchToData = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .is('seen_time', null)
          .eq('to_user_id', user.id);

      // const fetchFromData = await supabase
      //     .from('messages')
      //     .select('*', { count: 'exact', head: true })
      //     .is('seen_time', null)
      //     .eq('from_user_id', user.id);

      if (fetchToData.count > 0) {
          total_unread += fetchToData.count;
      }
      // if (fetchFromData.count > 0) {
      //     total_unread += fetchFromData.count;
      // }
      //console.log("total_unread", total_unread);
      if (total_unread > 0) {
        setTotalMessages(total_unread);
      }
  

    // let countTotalMessages = await supabase
    //   .from('messages')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('user_id', user.id)
    //   .is('deleted', null);
    // if (countTotalMessages.count > 0) {
    //   setTotalMessages(countTotalMessages.count);
    // }

    let countTotalShortlist = await supabase
      .from('applications_view')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'Shortlisted');
    if (countTotalShortlist.count > 0) {
      setTotalShortlist(countTotalShortlist.count);
    }
    setIsLoading(false);
  }

  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: totalAppliedJobs,
      link: "/candidates-dashboard/applied-jobs",
      metaName: "Applied Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: totalApplications,
      metaName: "Job Alerts",
      link: "/candidates-dashboard/job-alerts",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: totalMessages,
      metaName: "Unread Message",
      link: "/candidates-dashboard/messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: totalShortlist,
      metaName: "Shortlist",
      link: "/candidates-dashboard/short-listed-jobs",
      uiClass: "ui-green",
    },
  ];

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
      {isLoading == false && cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
            <Link href={item.link}>
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
