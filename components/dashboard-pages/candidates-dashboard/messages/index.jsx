import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { chatSidebarToggle } from '../../../../features/toggle/toggleSlice';
import Image from "next/image";
import { useRouter } from "next/router";
import { supabase } from "../../../../config/supabaseClient";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
import { BallTriangle } from 'react-loader-spinner';
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import ChatBox from "./components";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";

const Index = () => {

  const { chatSidebar } = useSelector((state) => state.toggle);
  const timeAgo = new TimeAgo('en-US');
  const dispatch = useDispatch();
  const scollToRef = useRef();
  const inputRef = useRef(null);
  const user = useSelector(state => state.candidate.user)
  const router = useRouter();
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [userData, setUserData] = useState([]);
  const [chatUserName, setChatUserName] = useState(null);
  const [chatUserImage, setChatUserImage] = useState(null);
  const [chatUserId, setChatUserId] = useState(null);
  const [userMessages, setUserMessages] = useState([]);

  const getDistApplicants = async (showLoading, selected_user_id = 0) => {
    if(selected_user_id > 0){
      const fetchUser = await supabase
        .from('users')
        .select()
        .eq('user_id',selected_user_id)
        .ilike('role', 'ADMIN')
        .order('user_id', { ascending: true })
        .limit(100);
      if (fetchUser) {
        let allUserData = fetchUser.data;
        let arrData = [];
        if(allUserData){
          for (const element of allUserData) {
            const fetchOneData = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .is('seen_time', null)
            .eq('to_user_id', user.id)
            .eq('from_user_id', element.user_id);
            let photo_url = '/images/favicon.png';
            if(element.user_photo != null){
              photo_url = cloudPath+element.user_photo;
            } else if(element.photo_url != null){
              photo_url = element.photo_url;
            }
            let objData = {
              user_id: element.user_id,
              created_at: element.created_at,
              email: element.email,
              name: element.name,
              phone_number: element.phone_number,
              photo_url: photo_url,
              count : fetchOneData.count
            }
            arrData.push(objData);
          }
        }
        if(arrData){
          setUserData(arrData);
          setIsLoadingLeft(false);
        }
      }
    } else {
      if(showLoading){
        setIsLoadingLeft(true);
      }
      const fetchUser = await supabase
        .from('users')
        .select()
        .ilike('role', 'ADMIN')
        .order('user_id', { ascending: true })
        .limit(100);
      if (fetchUser) {
        let allUserData = fetchUser.data;
        let arrData = [];
        if(allUserData){
          for (const element of allUserData) {
            const fetchOneData = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .is('seen_time', null)
            .eq('to_user_id', user.id)
            .eq('from_user_id', element.user_id);
            let photo_url = '/images/favicon.png';
            if(element.user_photo != null){
              photo_url = cloudPath+element.user_photo;
            } else if(element.photo_url != null){
              photo_url = element.photo_url;
            }
            let objData = {
              user_id: element.user_id,
              created_at: element.created_at,
              email: element.email,
              name: element.name,
              phone_number: element.phone_number,
              photo_url: photo_url,
              count : fetchOneData.count
            }
            arrData.push(objData);
          }
        }
        if(arrData){
          setUserData(arrData);
          setIsLoadingLeft(false);
        }
      }
    }
    
  }

  useEffect(() => {
    getDistApplicants(true);
  }, []);

  const chatToggle = () => {
    dispatch(chatSidebarToggle());
  };

  const fetchUserMessages = async () => {
    setUserMessages([]);
    setIsLoading(true);
    const fetchUserMessages = await supabase
      .from('messages')
      .select()
      .ilike('room_id', chatUserId + "@" + user.id)
      .order('id', { ascending: true })
      .limit(100);
    if (fetchUserMessages) {
      setUserMessages(fetchUserMessages.data);
      inputRef.current.focus();
      setIsLoading(false);
    }
  }

  const handleChatUser = async (user_id) => {
    setIsLoading(true);
    setUserMessages([]);

    document.getElementById('message_textarea').value = "";
    document.getElementById('searchbar').value = "";
    
    // await supabase.from('messages')
    // .update({seen_time: new Date()})
    // .eq('from_user_id', user_id)
    // .is('seen_time', null);

    await supabase.from('messages')
    .update({seen_time: new Date()})
    .eq('from_user_id', user_id)
    .is('seen_time', null);

    // await supabase.from('messages')
    // .update({seen_time: null})
    // .eq('from_user_id', user_id);

    // await supabase.from('messages')
    // .update({seen_time: null})
    // .eq('to_user_id', user_id);
    
    const fetchUser = await supabase
    .from('users')
    .select('user_id,name,photo_url,user_photo')
    .ilike('user_id', user_id);

    // const fetchCustDtl = await supabase
    // .from('cust_dtl')
    // .select('profile_logo')
    // .ilike('cust_id', user_id);
    
    setChatUserName(fetchUser.data[0].name);
    setChatUserImage('/images/favicon.png');
    if (fetchUser.data[0].user_photo != null) {
      setChatUserImage(cloudPath + fetchUser.data[0].user_photo);
    } else if (fetchUser.data[0].photo_url != null) {
      setChatUserImage(fetchUser.data[0].photo_url);
    }
    setChatUserId(fetchUser.data[0].user_id);
    getDistApplicants(false);
    
    const fetchUserMessages = await supabase
      .from('messages')
      .select()
      .ilike('room_id', fetchUser.data[0].user_id + "@" + user.id)
      .order('id', { ascending: true })
      .limit(100);
    if (fetchUserMessages) {
      setIsLoading(false);
      setUserMessages(fetchUserMessages.data);
      inputRef.current.focus();
      scollToRef.current.scrollIntoView();
      setTimeout(() => {
        //var container = document.getElementsByClassName('msg_card_body'),
        // element = document.getElementById('lm');
        // container.scrollTop = element.offsetTop;
        document.getElementById('msg_card_body').scroll({ top: 7000, behavior: 'smooth' });
      }, 1000);
      setInterval(function() {
        getDistApplicants(true,fetchUser.data[0].user_id);
      }, 30000);
    }
  }

  const fetchMessages = async (user_id) => {
    const fetchUser = await supabase.from('users').select().ilike('role', 'CANDIDATE');
  }

  const handleChatSubmit = async () => {
    let message = document.getElementById('message_textarea').value;
    if (message != "") {
      const { messageData, messageError } = await supabase
        .from('messages')
        .insert([
          {
            room_id: chatUserId + "@" + user.id,
            from_user_id: user.id,
            to_user_id: chatUserId,
            message_text: document.getElementById('message_textarea').value,
            created_at: new Date()
          }
        ]).select();
      fetchUserMessages();
      scollToRef.current.scrollIntoView();
      inputRef.current.focus();
      document.getElementById('message_textarea').value = "";
      setTimeout(() => {
        //var container = document.getElementsByClassName('msg_card_body'),
        // element = document.getElementById('lm');
        // container.scrollTop = element.offsetTop;
        document.getElementById('msg_card_body').scroll({ top: 7000, behavior: 'smooth' });
      }, 1000);
    } else {
      alert("Please enter the message");
    }
  }

  const handleSearch = async (e) => {
    let fetchUserData = '';
    //if (e.target.value != "") {
      fetchUserData = await supabase
        .from('users')
        .select()
        .ilike('role', 'CANDIDATE')
        .ilike('name', '%' + e.target.value + '%')
        .order('user_id', { ascending: true })
        .limit(100);
    // } else {
    //   fetchUserData = await supabase
    //   .from('users')
    //   .select()
    //   .ilike('role', 'CANDIDATE')
    //   .order('user_id', { ascending: true })
    //   .limit(100);
    // }
    setUserData(fetchUserData.data);
  }

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Messages!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
      <div
        className="contacts_column col-xl-4 col-lg-5 col-md-12 col-sm-12 chat"
        id="chat_contacts"
      >
        <div className="card contacts_card">
          <div className="card-header">
            {/* Startclose chatbox in mobile menu */}
            <div
              className="fix-icon position-absolute top-0 end-0 show-1023"
              onClick={chatToggle}
            >
              <span className="flaticon-close"></span>
            </div>
            {/* close chatbox in mobile menu */}
            <div className="search-box-one">
              {/* <SearchBox /> */}
              <div className="form-group">
                <span className="icon flaticon-search-1"></span>
                <input
                  type="search"
                  name="search-field"
                  id="searchbar"
                  onChange={(e) => handleSearch(e)}
                  placeholder="Search"
                  required=""
                />
              </div>
              
            </div>
          </div>
          {/* End cart-heaer */}

          <div className="card-body contacts_body">
          {
              isLoadingLeft &&
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
            <ul className="contacts">
              {
                userData && userData.map((item, index) => {
                  //console.log('item', item);
                  let image_url = item.photo_url != null ? item.photo_url : '/images/favicon.png';
                  let message_url = '/messages?user=' + item.user_id;
                  //let image_url = '/images/resource/candidate-1.png';
                  //let image_url = item.photo_url;
                  let a_id = user.id + item.user_id;
                  return (<li key={index}>
                    <a id={a_id} onClick={() => handleChatUser(item.user_id)}>
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          <Image
                            src={image_url}
                            alt="chatbox avatar"
                            width={90}
                            height={90}
                            style={{ borderRadius: 3, borderWidth:1,borderColor:'#EAEAEA', borderStyle:'solid' }}
                          />
                        </div>
                        <div className="user_info w-100">
                          <span>{item.name} <span className="text-danger pull-right">{item.count > 0 && ''+item.count+''}</span></span>
                        </div>
                      </div>
                    </a>
                  </li>)
                })
              }
              {/* End single Contact List */}

            </ul>
          </div>
        </div>
      </div>
      {/* End chat_contact */}

      <div className=" col-xl-8 col-lg-7 col-md-12 col-sm-12 chat">
        <div className="card message-card">
          <div className="card-header msg_head">
            <div className="d-flex bd-highlight">
              <div className="img_cont">
              {chatUserName != null ? <img
                  src={chatUserImage}
                  alt=""
                  className="rounded-circle user_img"
                /> : ""}
                
              </div>
              <div className="user_info">
                <span>{chatUserName != null ? chatUserName : ""}</span>
              </div>
            </div>
          </div>

          <div className="card-body msg_card_body" id="msg_card_body" ref={scollToRef} style={{ bottom: 0, height: "770px", overflow: 'auto' }}>
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
              userMessages.length == 0 && isLoading == false &&
              <div>
                <div className="text-secondary text-center">
                  {chatUserName != null ? "No Converation Found!!!" : "Please select user to view chat conversation !!!"}
                </div>
              </div>
            }
            {
              userMessages && userMessages.length > 0 && userMessages.map((item, index) => {
                let classNameSide = "d-flex justify-content-start";
                let label_name = chatUserName;
                if (item.from_user_id == user.id) {
                  classNameSide = "d-flex justify-content-end mb-2 reply";
                  label_name = "You";
                }
                return (
                  <div key={index} className={classNameSide}>
                    <div className="img_cont_msg">
                      <img
                        src="/images/resource/candidate-3.png"
                        alt=""
                        className="rounded-circle user_img_msg"
                      />
                      <div className="name">
                        {label_name}
                        <span className="msg_time">{timeAgo.format(new Date(item.created_at))}</span>
                      </div>
                    </div>
                    <div className="msg_cotainer">{item.message_text}</div>
                  </div>
                )
              })

            }
          </div>



          <div className="card-footer">
            <div className="form-group mb-0">
              <form>
                <textarea
                  className="form-control type_msg"
                  placeholder="Type a message..."
                  id="message_textarea"
                  ref={inputRef}
                  required
                ></textarea>
                <button
                  onClick={() => handleChatSubmit()}
                  type="button"
                  className="theme-btn btn-style-one submit-btn"
                >
                  Send Message
                </button>
                <div ref={scollToRef}></div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* chatbox-field-content */}
    </div>
          {/* End row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      {/* <CopyrightFooter /> */}
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default Index;
