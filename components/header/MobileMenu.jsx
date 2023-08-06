import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import MobileSidebar from "./mobile-sidebar";
import { supabase } from "../../config/supabaseClient";
import Router, { useRouter } from "next/router";

const MobileMenu = () => {
    const user = useSelector((state) => state.candidate.user);
    //console.log("header user",user);
    const showLoginButton = useMemo(() => !user?.id, [user]);
    const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");
    let photo_url = '/images/icons/user.svg';
    console.log("user.u",user.user_photo);
    if(user.user_photo != null && user.user_photo.length > 5){
        photo_url = cloudPath+user.user_photo;
    }
     else if(user.photo_url != null && user.photo_url != ""){
        photo_url = user.photo_url;
    }
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

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

    useEffect(() => {
        fetchUserUnreadMessages();
    }, []);

    const handleNavigateToMessage = () => {
        if(user.role == 'ADMIN'){
            Router.push("/employers-dashboard/messages")
        } else {
            Router.push("/candidates-dashboard/messages")
        }
    }

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
                                    <img src='/images/logo.svg' alt="brand" />
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
                                style={{display:'inline-flex'}}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasMenu">
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
                                    width={35}
                                    height={35}
                                    style={{ marginTop: '-5px' }}
                                />
                                <span
                                    style={{ marginLeft: '10px' }}
                                    className="name dropdown-toggle1">
                                </span>
                                <span>{user.name}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileMenu;
