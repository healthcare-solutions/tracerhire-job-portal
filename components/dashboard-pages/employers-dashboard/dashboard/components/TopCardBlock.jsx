import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner'

const TopCardBlock = () => {

  const user = useSelector(state => state.candidate.user);
  const [totalPostedJobs, setTotalPostedJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalShortlist, setTotalShortlist] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    let countTotalPostedJobs = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      //.eq('user_id', user.id)
      .eq('status', 'Published');
    if (countTotalPostedJobs.count > 0) {
      setTotalPostedJobs(countTotalPostedJobs.count);
    }

    let countTotalApplications = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      //.eq('user_id', user.id)
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

    if (fetchToData.count > 0) {
      total_unread += fetchToData.count;
    }
    if (total_unread > 0) {
      setTotalMessages(total_unread);
    }

    let countTotalShortlist = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      //.eq('user_id', user.id)
      .is('deleted', null);
    if (countTotalShortlist.count > 0) {
      setTotalShortlist(countTotalShortlist.count);
    }
    setIsLoading(false);
  }

  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: totalPostedJobs,
      metaName: "Posted Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: totalApplications,
      metaName: "Application",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: totalMessages,
      metaName: "Messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: totalShortlist,
      metaName: "Shortlist",
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
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
