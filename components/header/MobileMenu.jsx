import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import MobileSidebar from "./mobile-sidebar";

const MobileMenu = () => {
    const user = useSelector((state) => state.candidate.user);
    const showLoginButton = useMemo(() => !user?.id, [user]);

    return (
        // <!-- Main Header-->
        <header className="main-header main-header-mobile">
            <div className="auto-container">
                {/* <!-- Main box --> */}
                <div className="inner-box">
                    <div className="nav-outer">
                        <div className="logo-box">
                            <div className="logo">
                                <Link href="/">
                                    <img src="/images/logo.svg" alt="brand" />
                                </Link>
                            </div>
                        </div>
                        {/* End .logo-box */}

                        <MobileSidebar />
                        {/* <!-- Main Menu End--> */}
                    </div>
                    {/* End .nav-outer */}

                    <div className="outer-box">
                        {showLoginButton ?
                            <div className="login-box">
                                <a
                                    href="#"
                                    className="call-modal"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginPopupModal"
                                >
                                    <span className="icon icon-user"></span>
                                </a>
                            </div>

                            :

                            // <a
                            //     href="#"
                            //     className="mobile-nav-toggler"
                            //     data-bs-toggle="offcanvas"
                            //     data-bs-target="#offcanvasMenu"
                            // >
                            //     <span className="flaticon-menu-1"></span>
                            // </a>
                            <div
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasMenu">
                                <Image
                                    alt="avatar"
                                    className="thumb"
                                    src="/images/icons/user.svg"
                                    width={15}
                                    height={15}
                                    style={{ marginTop: '-5px' }}
                                />
                                <span
                                    style={{ marginLeft: '8px' }}
                                    className="name dropdown-toggle">Hello, 
                                </span><br />
                                <span>{ user.name }</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileMenu;
