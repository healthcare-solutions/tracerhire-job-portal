import Router, { useRouter } from "next/router";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../../config/supabaseClient';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const FormInfoBox = () => {

    const [companyNameForm, setCompanyNameForm] = useState("");
    const [companyEmailForm, setCompanyEmailForm] = useState("");
    const [companyPhoneForm, setCompanyPhoneForm] = useState("");
    const [companyWebsiteForm, setCompanyWebsiteForm] = useState("");
    const [companyEstForm, setCompanyEstForm] = useState("");
    const [companyTeamSizeForm, setCompanyTeamSizeForm] = useState("");
    const [companyMultipleSelectForm, setCompanyMultipleSelectForm] = useState("");
    const [companyAllowSearchListingForm, setCompanyAllowSearchListingForm] = useState("");
    const [companyAboutForm, setCompanyAboutForm] = useState("");
    const [companyTotalBeds, setCompanyTotalBets] = useState(0);
    const [companyCatOptions, setCompanyCatOptions] = useState([]);

    const user = useSelector(state => state.candidate.user);
    useEffect(() => {
        fetchCustomer(user.id);
    }, []);

    const handleMultipleValues = (selectedValues) => {
        let selectedString = "";
        if(selectedValues && selectedValues != false){
            selectedValues.map((item) => {
                selectedString += item.value+",";
            })
        }
        if(selectedString != ""){
            selectedString = selectedString.substring(0,selectedString.length-1);
        }
        console.log("selectedString",selectedString);
        setCompanyMultipleSelectForm(selectedString);
    }

    const catOptions = [
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Neurology", label: "Neurology" },
        { value: "Cardiology", label: "Cardiology" },
        { value: "Obstetrics", label: "Obstetrics" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Eye", label: "Eye" },
        { value: "ENT", label: "ENT" },
        { value: "Dental", label: "Dental" },
        { value: "Psychiatry", label: "Psychiatry" },
        { value: "Plastic Surgery", label: "Plastic Surgery" },
        { value: "Nuclear medicine", label: "Nuclear medicine" },
        { value: "Gynecology", label: "Gynecology" }
    ];

    let arrExistingDepartments = [];

    const fetchCustomer = async (userID) => {
        try {
            if (userID) {
                let { data: customer, error } = await supabase
                    .from('cust_dtl')
                    .select("*")
                    .eq('cust_id', userID)
    
                if (customer) {
                    setCompanyNameForm(customer[0].company_name);
                    setCompanyEmailForm(customer[0].email);
                    setCompanyPhoneForm(customer[0].phone);
                    setCompanyWebsiteForm(customer[0].website);
                    setCompanyEstForm(customer[0].company_since);
                    setCompanyTeamSizeForm(customer[0].employee_size);
                    setCompanyMultipleSelectForm(customer[0].departments);
                    setCompanyAllowSearchListingForm(customer[0].allow_indexig);
                    setCompanyAboutForm(customer[0].description);
                    setCompanyTotalBets(customer[0].nbr_of_beds);

                    let all_departments = customer[0].departments;
                    //console.log("all_departments",all_departments);
                    let arrSelectedDepartments = [];
                    if(all_departments != ""){
                        all_departments = all_departments.split(",");
                        all_departments.map((item) => {
                            catOptions.map((defined_item,index) => {
                                if(defined_item.label == item){
                                    arrSelectedDepartments.push(catOptions[index]);
                                    arrExistingDepartments.push(catOptions[index]);
                                }
                            })
                        });
                        if(arrSelectedDepartments.length > 0){
                            setCompanyCatOptions(arrSelectedDepartments);
                        }
                    }
                }
            }
        } catch (e) {
            console.o
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
        if (companyNameForm && companyEmailForm && companyTeamSizeForm && companyTotalBeds && companyAboutForm) {
            try {
                const dateFormat = () => {
                    const date = new Date()
                    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
                }
    
                const { data, error } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', user.id);
                if (data.length > 0) {
                    const { dataUpdate, error } = await supabase
                        .from('cust_dtl')
                        .update({
                            company_name: companyNameForm,
                            email: companyEmailForm,
                            phone: companyPhoneForm,
                            website: companyWebsiteForm,
                            company_since: companyEstForm,
                            employee_size: companyTeamSizeForm,
                            departments: companyMultipleSelectForm,
                            allow_indexig: companyAllowSearchListingForm,
                            description: companyAboutForm,
                            nbr_of_beds: companyTotalBeds,
                            modified_at: dateFormat()
                        })
                        .eq('cust_dtl_id', data[0].cust_dtl_id);
                } else {
                    const { customerDetailData, error } = await supabase
                        .from('cust_dtl')
                        .insert([
                            {
                                cust_id: user.id,
                                company_name: companyNameForm,
                                email: companyEmailForm,
                                phone: companyPhoneForm,
                                website: companyWebsiteForm,
                                company_since: companyEstForm,
                                employee_size: companyTeamSizeForm,
                                departments: companyMultipleSelectForm,
                                allow_indexig: companyAllowSearchListingForm,
                                description: companyAboutForm,
                                modified_at: dateFormat()
                            }
                        ]).select();
                }
    
                // open toast
                toast.success('Company Profile Updated successfully', {
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
                    Router.push("/employers-dashboard/company-profile")
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
        <form className="default-form overflow-x-hidden">
            <div className="row">
                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Company name <span className="required">(required)</span></label>
                    <input
                        type="text"
                        name="name"
                        value={companyNameForm}
                        placeholder="Invisionn"
                        required
                        onChange={(e) => {setCompanyNameForm(e.target.value)}}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Email address <span className="required">(required)</span></label>
                    <input
                        type="text"
                        name="name"
                        value={companyEmailForm}
                        placeholder="john.doe@companydomain.com"
                        required
                        onChange={(e) => {setCompanyEmailForm(e.target.value)}}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="name"
                        value={companyPhoneForm}
                        placeholder="+15555555555"
                        required
                        onChange={(e) => {setCompanyPhoneForm(e.target.value)}}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Website</label>
                    <input
                        type="text"
                        name="name"
                        value={companyWebsiteForm}
                        placeholder="www.companyname.com"
                        required
                        onChange={(e) => {setCompanyWebsiteForm(e.target.value)}}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Est. Since</label>
                    <input
                        type="date"
                        name="name"
                        value={companyEstForm}
                        placeholder="1970-12-31"
                        required
                        onChange={(e) => {setCompanyEstForm(e.target.value)}}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Team Size <span className="required">(required)</span></label>
                    <select
                        className="chosen-single form-select"
                        required
                        value={companyTeamSizeForm}
                        onChange={(e) => {setCompanyTeamSizeForm(e.target.value)}}
                    >
                        <option></option>
                        <option>10 - 50</option>
                        <option>50 - 100</option>
                        <option>100 - 150</option>
                        <option>200 - 250</option>
                        <option>300 - 350</option>
                        <option>500 - 1000</option>
                        <option>1000+</option>
                    </select>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Allow In Search & Listing</label>
                    <select
                        className="chosen-single form-select"
                        value={companyAllowSearchListingForm}
                        onChange={(e) => {setCompanyAllowSearchListingForm(e.target.value)}}
                    >
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Total Beds<span className="required">(required)</span></label>
                    <input
                        type="number"
                        name="name"
                        min={1}
                        value={companyTotalBeds}
                        placeholder="10"
                        required
                        onChange={(e) => {setCompanyTotalBets(e.target.value)}}
                    />
                </div>

                {/* <!-- Search Select --> */}
                
                <div className="form-group col-lg-6 col-md-12">
                    <label>Department</label>
                    <Select
                        defaultValue={arrExistingDepartments}
                        isMulti
                        name="colors"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e) => {handleMultipleValues(e)}}
                    />
                    {/* <select
                        className="chosen-single form-select"
                        required
                        value={companyMultipleSelectForm}
                        onChange={(e) => {setCompanyMultipleSelectForm(e.target.value)}}
                    >
                        <option></option>
                        <option>Retail</option>
                        <option>Banking</option>
                        <option>Digital</option>
                    </select> */}
                </div>

                {/* <!-- About Company --> */}
                <div className="form-group col-lg-12 col-md-12">
                    <label>About Company<span className="required">(required)</span></label>
                    <textarea
                        placeholder="enter texts about your company"
                        value={companyAboutForm}
                        onChange={(e) => {setCompanyAboutForm(e.target.value)}}
                    ></textarea>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <button
                        className="theme-btn btn-style-one"
                        onClick={(e) => {
                            e.preventDefault();
                            submitCompanyProfile();
                        }}
                    >Save</button>
                </div>
            </div>
        </form>
    );
};

export default FormInfoBox;