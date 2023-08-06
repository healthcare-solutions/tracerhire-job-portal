import { useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../config/supabaseClient';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SocialNetworkBox = () => {

  const user = useSelector(state => state.candidate.user);

  const [companyFacebook, setCompanyFacebook] = useState("");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [companyTwitter, setCompanyTwitter] = useState("");
  const [companyYoutube, setCompanyYoutube] = useState("");
  const [companyInstagram, setCompanyInstagram] = useState("");

  useEffect(() => {
    fetchCustomer(user.id);
  }, []);

  const fetchCustomer = async (userID) => {
    try {
      if (userID) {
        let { data: customer, error } = await supabase
          .from('cust_dtl')
          .select("*")
          .eq('cust_id', userID)

        if (customer) {
          setCompanyFacebook(customer[0].facebook_url);
          setCompanyLinkedin(customer[0].linkedin_url);
          setCompanyTwitter(customer[0].twitter_url);
          setCompanyYoutube(customer[0].youtube_url);
          setCompanyInstagram(customer[0].instagram_url);
        }
      }
    } catch (e) {
      toast.error('System is unavailable.  Please try again later or contact tech support!', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.warn(e)
    }
  };

  const submitCompanyProfile = async () => {
    console.log("User ID", user.id);
    //if (companyFacebook) {
      try {
        const dateFormat = () => {
          const date = new Date()
          return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
        }

        const { data, error } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', user.id);
          
          console.log(data);
        if (data.length > 0) {
          const { dataUpdate, error } = await supabase
            .from('cust_dtl')
            .update({
              facebook_url: companyFacebook,
              linkedin_url: companyLinkedin,
              twitter_url: companyTwitter,
              youtube_url: companyYoutube,
              instagram_url: companyInstagram,
              modified_at: dateFormat()
            })
            .eq('cust_dtl_id', data[0].cust_dtl_id);
        } else {
          // const { customerDetailData, error } = await supabase
          //   .from('cust_dtl')
          //   .insert([
          //     {
          //       cust_id: user.id,
          //       facebook_url: companyFacebook,
          //       linkedin_url: companyLinkedin,
          //       twitter_url: companyTwitter,
          //       youtube_url: companyYoutube,
          //       instagram_url: companyInstagram,
          //       modified_at: dateFormat()
          //     }
          //   ]).select();
        }

        // open toast
        toast.success('Social Network Links Updated successfully', {
          position: "bottom-right",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          Router.push("/candidates-dashboard/my-profile")
        }, 3000);

      } catch (err) {
        // open toast
        console.log("Error", err);
        toast.error('Error while saving your company profile, Please try again later or contact tech support', {
          position: "bottom-right",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // console.warn(err);
      }
    // } else {
    //   // open toast
    //   toast.error('Please fill all the required fields.', {
    //     position: "top-center",
    //     autoClose: true,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //   });
    // }
  };

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Facebook</label>
          <input
            type="text"
            name="name"
            value={companyFacebook}
            onChange={(e) => { setCompanyFacebook(e.target.value) }}
            placeholder="www.facebook.com/Invision"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Twitter</label>
          <input
            type="text"
            name="name"
            placeholder=""
            required
            value={companyTwitter}
            onChange={(e) => { setCompanyTwitter(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Linkedin</label>
          <input
            type="text"
            name="name"
            placeholder=""
            required
            value={companyLinkedin}
            onChange={(e) => { setCompanyLinkedin(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Youtube</label>
          <input
            type="text"
            name="name"
            placeholder=""
            value={companyYoutube}
            onChange={(e) => { setCompanyYoutube(e.target.value) }}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Instagram URL</label>
          <input
            type="text"
            name="name"
            placeholder=""
            value={companyInstagram}
            onChange={(e) => { setCompanyInstagram(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={(e) => {
              e.preventDefault();
              submitCompanyProfile();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default SocialNetworkBox;
