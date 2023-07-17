import Router, { useRouter } from "next/router";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../config/supabaseClient';

const PackageDataTable = () => {
  const user = useSelector(state => state.candidate.user);
  console.log("user", user);
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    if (feedback) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .insert({
            testimonial_text: feedback,
            user_id: user.id,
            user_name: user.name,
            user_photo: user.user_photo,
            status: 'New',
            created_at: new Date(),
            modified_at: new Date()
          });

        toast.success('Thanks for your valuable feedback!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          location.reload();
        }, 5000);

      } catch (err) {
        // open toast
        console.log("My Profile Error", err);
        toast.error('Error while saving your feedback, Please try again later or contact tech support', {
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
    } else {
      // open toast
      toast.error('Please enter your feedback.', {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  return (
    <form>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <textarea
            name="message"
            placeholder="Please enter your feedback !!!"
            className="w-100 feedback-message"
            onChange={(e) => { setFeedback(e.target.value) }}
          ></textarea>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <br />
          <button
            className="theme-btn btn-style-one"
            type="submit"
            id="submit"
            name="submit-form"
            onClick={(e) => {
              e.preventDefault();
              handleSubmitFeedback();
            }}
          >
            Send Feedback
          </button>
          <br /><br /><br />
        </div>
      </div>
    </form>
  );
};

export default PackageDataTable;
