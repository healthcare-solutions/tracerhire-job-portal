import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { supabase } from "../../../../config/supabaseClient";

const FormContentAwards = (props) => {
  const [id, setId] = useState(props.id > 0 ? props.id : 0);
  const [degree, setDegree] = useState(props.title_value != "" ? props.title_value : "");
  const [school, setSchool] = useState(props.subtitle_value != "" ? props.subtitle_value : "");
  const [fromDate, setFromDate] = useState(props.from_date_value != "" ? props.from_date_value : "");
  const [toDate, setToDate] = useState(props.to_date_value != "" ? props.to_date_value : "");
  const [description, setDescription] = useState(props.description_value != "" ? props.description_value : "");
  const user = useSelector(state => state.candidate.user);

  const handleSubmitDetails = async () => {

    if (degree && fromDate && toDate && description) {
      try {
        if (id > 0) {
          await supabase
            .from('candidate_resumes')
            .update({
              title: degree,
              sub_title: school,
              from_date: fromDate,
              to_date: toDate,
              description: description,
              modified_at: new Date()
            })
            .eq('id', id);
        } else {
          await supabase
            .from('candidate_resumes')
            .insert([
              {
                type: props.type,
                user_id: user.id,
                title: degree,
                sub_title: school,
                from_date: fromDate,
                to_date: toDate,
                description: description,
                created_at: new Date(),
                modified_at: new Date()
              }
            ]);
        }

        setTimeout(() => {
          location.reload();
        }, 1000);
        toast.success('Details Successfully Updated!', {
          position: "bottom-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } catch (err) {
        console.log("Error", err);
        toast.error('Something Went Wrong !!!', {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error('Please fill all required fields !!!', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }


  };

  return (
    <div className="form-inner">
      <h3>{props.id > 0 ? 'Edit Your Award' : 'Add Your Award'}</h3>
      <form method="post">
        <div className="form-group">
          <label>{props.title} <span className="required">(required)</span></label>
          <input
            type="text"
            name="degree-name"
            placeholder="Enter Your Award"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>From Date <span className="required">(required)</span></label>
          <input
            type="date"
            name="from Date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>To Date <span className="required">(required)</span></label>
          <input
            type="date"
            name="to Date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{props.description} <span className="required">(required)</span></label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            onClick={(e) => {
              e.preventDefault();
              handleSubmitDetails();
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormContentAwards;
