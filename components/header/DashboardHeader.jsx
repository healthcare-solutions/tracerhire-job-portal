import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../features/candidate/candidateSlice";
import { logout } from "../../utils/logout";
import { supabase } from "../../config/supabaseClient";
import candidatesMenuData from "../../data/candidatesMenuData";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    fetchUserUnreadMessages();
  }, []);

  const user = useSelector(state => state.candidate.user)
  const menuOptions = user.role !== 'CANDIDATE' ?  employerMenuData : candidatesMenuData;
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");
    let photo_url = '/images/icons/user.svg';
    if(user.user_photo != null){
        photo_url = cloudPath+user.user_photo;
    } else if(user.photo_url != null){
        photo_url = user.photo_url;
    }

    const fetchUserUnreadMessages = async () => {

      let total_unread = 0;
      const fetchFromData = [];
      
      const fetchToData = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .is('seen_time', null)
          .eq('to_user_id', user.id);
          //console.log("To User",user.id);
          //console.log("fetchToData",fetchToData);
      // const fetchFromData = await supabase
      //     .from('messages')
      //     .select('*', { count: 'exact', head: true })
      //     .is('seen_time', null)
      //     .eq('from_user_id', user.id);
      //console.log("fetchFromData",fetchFromData);

      if (fetchToData.count > 0) {
          total_unread += fetchToData.count;
      }
      // if (fetchFromData.count > 0) {
      //     total_unread += fetchFromData.count;
      // }
      //console.log("total_unread", total_unread);
      if (total_unread > 0) {
          setTotalUnreadMessages(total_unread);
      }
  }

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/images/logo.svg"
                    width={154}
                    height={50}
                    priority
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            {/* <HeaderNavContent /> */}
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {/* <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button> */}
            {/* wishlisted menu */}

            {/* <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button> */}
            {/* End notification-icon */}

            {/* <!-- Dashboard Option --> */}
            <div className="dropdown dashboard-option">
            
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {
                totalUnreadMessages > 0 && <span>
                    <a onClick={() => handleNavigateToMessage()}>
                        <button className="menu-btn" style={{marginRight:20}}>
                            <span className="count">{totalUnreadMessages}</span>
                            <span className="icon la la-envelope"></span>
                        </button>
                    
                    </a>
                </span>
            }
                <Image
                  alt="avatar"
                  className="thumb"
                  src={photo_url}
                  width={20}
                  height={20}
                />
                <span className="name">Hello, { user.name }</span>
              </a>

              <ul className="dropdown-menu">
                {menuOptions.map((item) => (
                  <li
                    className={`${
                      isActiveLink(item.routePath, router.asPath)
                        ? "active"
                        : ""
                    } mb-1`}
                    key={item.id}
                  >
                    <Link href={item.routePath}
                    onClick={(e) => {
                      if(item.name == 'Logout'){
                        logout(dispatch)
                      }
                    }}
                    >
                      <i className={`la ${item.icon}`}></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* End dropdown */}
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
