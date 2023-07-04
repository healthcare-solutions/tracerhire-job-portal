import Register from "../register/Register";
import FormContentAwards from "./FormContentAwards";

const AddAwards = (props) => {
  const type = props.type;
  const title = props.title;
  const sub_title = props.subtitle;
  const description = props.description;
  const title_value= props.title_value;
  const subtitle_value= props.subtitle_value;
  const description_value= props.description_value;
  const from_date= props.from_date;
  const to_date= props.to_date;
  return (
    <>
      <div className="modal fade" id="loginPopupModalAward">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              id="close-button"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>

            <div className="modal-body">
              <div id="login-modal">
                <div className="login-form default-form">
                  <FormContentAwards 
                    type={type} 
                    title={title} 
                    sub_title={sub_title} 
                    description={description} 
                    id="0" 
                    title_value={title_value} 
                    subtitle_value={subtitle_value} 
                    description_value={description_value} 
                    from_date={from_date} 
                    to_date={to_date}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="registerModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              id="close-button-2"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>
            {/* End close modal btn */}

            <div className="modal-body">
              {/* <!-- Login modal --> */}
              <div id="login-modal">
                {/* <!-- Login Form --> */}
                <div className="login-form default-form">
                  <Register />
                </div>
                {/* <!--End Login Form --> */}
              </div>
              {/* <!-- End Login Module --> */}
            </div>
            {/* En modal-body */}
          </div>
          {/* End modal-content */}
        </div>
      </div>
      {/* <!-- Login Popup Modal --> */}
    </>
  );
};

export default AddAwards;
