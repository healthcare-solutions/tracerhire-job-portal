import AddAwards from "../../../../common/form/login/AddAwards";
import EditAwards from "../../../../common/form/login/EditAwards";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../config/supabaseClient';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner';

const Awards = () => {
  const user = useSelector(state => state.candidate.user);
  const [resumeData, setResumeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCandidateResume();
  }, []);

  const handleDeleteRow = async (id) => {
    if (confirm("Are you sure want to delete this Award?")) {
      await supabase
        .from('candidate_resumes')
        .update({ deleted: 'yes' })
        .eq('id', id);
      fetchCandidateResume();

    } else {
      return false;
    }

  }

  const fetchCandidateResume = async () => {
    setIsLoading(true);
    let fetch_resume = await supabase
      .from('candidate_resumes')
      .select()
      .eq('user_id', user.id)
      .eq('deleted', 'no');
    if (fetch_resume) {
      if (fetch_resume) {
        let arrEducation = [];
        let loop_data = fetch_resume.data;
        loop_data.map((item, index) => {
          if (item.type == 'Award') {
            arrEducation.push(item);
          }
        });
        //if (arrEducation.length > 0) {
        setResumeData(arrEducation);
        setIsLoading(false);
        //}
      }
    }
  }

  return (
    <div className="resume-outer theme-yellow">
      <div className="upper-title">
        <h4>Awards</h4>

        <button className="add-info-btn" data-bs-toggle="modal" data-bs-target="#loginPopupModalAward">
          <span className="icon flaticon-plus"></span> Add Award
        </button>
      </div>

      <AddAwards
        type="Award"
        title="Award Name"
        subtitle=""
        description="Details"
        id="0"
        from_date={currentDate}
        to_date={currentDate}
        title_value=""
        subtitle_value=""
        description_value=""
        from_date_value="" 
        to_date_value="" 
      />

      <div className="resume-block">
        {
          isLoading && resumeData.length == 0 &&
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
          resumeData.length == 0 &&
          <div style={{ width: '40%', margin: "auto" }}>
            <p style={{ textAlign: 'center' }}>Please Add Your Award Details !!!</p>
          </div>
        }
        {
          isLoading == false && resumeData.length > 0 && resumeData.map((item, index) => {
            return (
              <>
                <EditAwards
                  type="Award"
                  title="Award Name"
                  subtitle=""
                  description="Details"
                  title_value={item.title}
                  subtitle_value={item.sub_title}
                  description_value={item.description}
                  id={item.id}
                  from_date_value={item.from_date}
                  to_date_value={item.to_date}
                />
                <div className="inner">
                  <div class="name">A</div>
                  <div className="title-box" style={{ marginTop: 20 }}>
                    <div className="info-box">
                      <h3>{item.title}</h3>
                      {/* <span>{item.sub_title}</span> */}
                    </div>
                    <div className="edit-box">

                      <span className="year">{moment(item.from_date).format("YYYY")} - {moment(item.to_date).format("YYYY")}</span>
                      <div className="edit-btns">
                        <button data-bs-toggle="modal" data-bs-target={"#loginPopupModalAwardEdit" + item.id}>
                          <span className="la la-pencil"></span>
                        </button>
                        <button onClick={() => handleDeleteRow(item.id)}>
                          <span className="la la-trash"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text" style={{ marginBottom: 40 }}>
                    {item.description}
                  </div>
                </div>
              </>

            )
          })
        }
      </div>
    </div>
  );
};

export default Awards;