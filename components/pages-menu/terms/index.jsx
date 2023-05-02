import LoginPopup from "../../common/form/login/LoginPopup";
import FooterDefault from "../../footer/common-footer";
import Header from "../../home-15/Header";
import MobileMenu from "../../header/MobileMenu";
import DashboardHeader from "../../header/DashboardHeader";
import TermsText from "./TermsText";
import { useSelector } from "react-redux";
import { useMemo } from "react";


const index = () => {
  const user = useSelector((state) => state.candidate.user);
  const showLoginButton = useMemo(() => !user?.id, [user]);
  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      {showLoginButton ? <Header /> : <DashboardHeader />}
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="tnc-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Terms of Use</h2>
{/*
            <div className="text">Home / Terms of Use</div>
 */}
          </div>
          {/* End sec-title */}
          <TermsText />
        </div>
      </section>
      {/* <!-- End TNC Section --> */}

      {/* <FooterDefault footerStyle="alternate5" /> */}
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
