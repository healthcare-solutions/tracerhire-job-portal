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
import candidatesMenuData from "../../data/candidatesMenuData";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(false);

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
  }, []);

  const user = useSelector(state => state.candidate.user)
  const menuOptions = user.role !== 'CANDIDATE' ?  employerMenuData : candidatesMenuData

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
                <Image
                  alt="avatar"
                  className="thumb"
                  src="/images/icons/user.svg"
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
