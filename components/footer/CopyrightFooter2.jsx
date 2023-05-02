import Link from "next/link";
import Social from "./common-footer/Social";

const CopyrightFooter2 = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="bottom-left">
            <div className="logo">
              <Link href="/">
                <img src="images/logo.svg" alt="brand" />
              </Link>
            </div>
            <div className="copyright-text">
            <p style={{color: '#f5f5f5'}}>
        © {new Date().getFullYear()} Tracer Hire. All Right Reserved.
      </p>
            </div>
          </div>

          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter2;
