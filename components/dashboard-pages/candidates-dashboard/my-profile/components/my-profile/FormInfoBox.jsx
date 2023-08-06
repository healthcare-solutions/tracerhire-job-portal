import Router, { useRouter } from "next/router";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../../config/supabaseClient';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const FormInfoBox = () => {
  const catOptions = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Managemnet", label: "Managemnet" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
  ];

  const user = useSelector(state => state.candidate.user);
  useEffect(() => {
    fetchCustomer(user.id);
  }, []);

  let arrExistingDepartments = [];
  const [nameForm, setNameForm] = useState(user.name);
  const [customerDtlId, setCustomerDtlId] = useState('');
  const [jobtitleForm, setJobTitleForm] = useState('');
  const [phoneForm, setPhoneForm] = useState('');
  const [emailForm, setEmailForm] = useState('');
  const [websiteForm, setWebsiteForm] = useState('');
  const [currentSalaryForm, setCurrentSalaryForm] = useState('');
  const [expectedSalaryForm, setExpectedSalaryForm] = useState('');
  const [experienceForm, setExperienceForm] = useState('');
  const [ageForm, setAgeForm] = useState('');
  const [educationLevelForm, setEducationLevelForm] = useState('');
  const [languageForm, setLanguageForm] = useState('');
  const [categoriesForm, setCategoriesForm] = useState('');
  const [allowSearchListingForm, setAllowSearchListingForm] = useState('');
  const [descriptionForm, setDescriptionForm] = useState('');

  const handleMultipleValues = (selectedValues) => {
    let selectedString = "";
    if (selectedValues && selectedValues != false) {
      selectedValues.map((item) => {
        selectedString += item.value + ",";
      })
    }
    if (selectedString != "") {
      selectedString = selectedString.substring(0, selectedString.length - 1);
    }
    //console.log("selectedString", selectedString);
    setCategoriesForm(selectedString);
  }

  const fetchCustomer = async (userID) => {
    
    try {
      if (userID) {
        let { data: customer, error } = await supabase
          .from('cust_dtl')
          .select(`*`)
          .eq('cust_id', userID)

          let customerName = "";
          let userData = await supabase
          .from('users')
          .select(`name`)
          .eq('user_id', userID);
          if(userData){
            customerName = userData.data[0].name;
          }

        if (customer) {
          setCustomerDtlId(customer[0].cust_dtl_id);
          setNameForm(customerName);
          setJobTitleForm(customer[0].company_name);
          setPhoneForm(customer[0].phone);
          setEmailForm(customer[0].email);
          setWebsiteForm(customer[0].website);
          setCurrentSalaryForm(customer[0].current_salary);
          setExpectedSalaryForm(customer[0].expected_salary);
          setExperienceForm(customer[0].experience);
          setAgeForm(customer[0].age);
          setEducationLevelForm(customer[0].education_level);
          setLanguageForm(customer[0].languages);
          //setCategoriesForm(customer[0].company_name);
          setAllowSearchListingForm(customer[0].allow_indexig);
          setDescriptionForm(customer[0].description);

          let all_departments = customer[0].departments;
          let arrSelectedDepartments = [];
          if (all_departments != null) {
            all_departments = all_departments.split(",");
            all_departments.map((item) => {
              catOptions.map((defined_item, index) => {
                if (defined_item.label == item) {
                  arrSelectedDepartments.push(catOptions[index]);
                  arrExistingDepartments.push(catOptions[index]);
                }
              })
            });
            if (arrSelectedDepartments.length > 0) {
              setCategoriesForm(arrSelectedDepartments);
            }
          }
        }
      }
    } catch (e) {
      console.log("Fetch Customer Error", e);
      toast.error('System is unavailable to fetch customer.  Please try again later or contact tech support!', {
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
    if (nameForm && jobtitleForm && phoneForm && emailForm) {
      try {
          const { data, error } = await supabase
            .from('cust_dtl')
            .update({
              company_name: jobtitleForm,
              phone: phoneForm,
              email: emailForm,
              website: websiteForm,
              current_salary: currentSalaryForm,
              expected_salary: expectedSalaryForm,
              experience: experienceForm,
              age: ageForm,
              education_level: educationLevelForm,
              languages: languageForm,
              departments: categoriesForm,
              allow_indexig: allowSearchListingForm,
              description: descriptionForm,
              modified_at: new Date()
            })
            .eq('cust_dtl_id', customerDtlId);
            console.log("Updated Data ===>", data);


            const { userData, userDrror } = await supabase
            .from('users')
            .update({
              name: nameForm
            }).eq('user_id', user.id);
            console.log("User Data ===>", userData);
        
        // open toast
        toast.success('Your Profile Updated successfully', {
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
        console.log("My Profile Error", err);
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
    } else {
      // open toast
      toast.error('Please fill all the required fields.', {
        position: "top-center",
        autoClose: 2000,
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
    <form action="#" className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Full Name <span className="required">(required)</span></label>
          <input
            type="text"
            name="name"
            value={nameForm}
            placeholder="Invisionn"
            required
            onChange={(e) => { setNameForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
          <input
            type="text"
            name="jobtitle"
            value={jobtitleForm}
            placeholder="Job Title"
            required
            onChange={(e) => { setJobTitleForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Phone <span className="required">(required)</span></label>
          <input
            type="text"
            name="phone"
            value={phoneForm}
            placeholder="Phone"
            required
            onChange={(e) => { setPhoneForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address <span className="required">(required)</span></label>
          <input
            type="text"
            name="email"
            readOnly
            value={emailForm}
            placeholder="E-mail"
            required
            onChange={(e) => { setEmailForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={websiteForm}
            placeholder="Website"
            required
            onChange={(e) => { setWebsiteForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Current Salary($)</label>
          <select
            className="chosen-single form-select"
            value={currentSalaryForm}
            onChange={(e) => { setCurrentSalaryForm(e.target.value) }}
          >
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>100-150 K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Expected Salary($)</label>
          <select
            className="chosen-single form-select"
            value={expectedSalaryForm}
            onChange={(e) => { setExpectedSalaryForm(e.target.value) }}
          >
            <option>120-350 K</option>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>100-150 K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <input
            type="text"
            placeholder="5-10 Years"
            value={experienceForm}
            onChange={(e) => { setExperienceForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Age</label>
          <select
            className="chosen-single form-select"
            value={ageForm}
            onChange={(e) => { setAgeForm(e.target.value) }}
          >
            <option>23 - 27 Years</option>
            <option>24 - 28 Years</option>
            <option>25 - 29 Years</option>
            <option>26 - 30 Years</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Education Levels</label>
          <input
            type="text"
            placeholder="Certificate"
            value={educationLevelForm}
            onChange={(e) => { setEducationLevelForm(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Languages</label>
          <input
            type="text"
            placeholder="English, Turkish"
            value={languageForm}
            onChange={(e) => { setLanguageForm(e.target.value) }}
          />
        </div>

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Skills </label>
          <Select
            defaultValue={arrExistingDepartments}
            isMulti
            name="colors"
            options={catOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => { handleMultipleValues(e) }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Allow In Search & Listing</label>
          <select
            className="chosen-single form-select"
            value={allowSearchListingForm}
            onChange={(e) => { setAllowSearchListingForm(e.target.value) }}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Description</label>
          <textarea
            placeholder="enter texts about yourself"
            value={descriptionForm}
            onChange={(e) => { setDescriptionForm(e.target.value) }}
          ></textarea>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
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

export default FormInfoBox;
