import Router, { useRouter } from "next/router";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { supabase } from "../../../../../config/supabaseClient";
import { supabase } from '../../../../../../config/supabaseClient';
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const addCompanyProfileFields = {
    companyLogo: "",
    companyCover: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyEst: "",
    companyTeamSize: "",
    companyMultipleSelect: "",
    companyAllowSearchListing: "",
    companyAbout: ""
}

const submitCompanyProfile = async (
    { companyLogo,
        companyCover,
        companyName,
        companyEmail,
        companyPhone,
        companyWebsite,
        companyEst,
        companyTeamSize,
        companyMultipleSelect,
        companyAllowSearchListing,
        companyAbout },
    setCompanyProfileData,
    user
) => {
    // console.log("USer ===>",user);
    // return false;
    if (companyName && companyEmail) {
        try {
            let orgID = 0;
            let customerID = 0;
            const dateFormat = () => {
                const date = new Date()
                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
            }

            // Check ORG Exists Start //
            const { data, error } = await supabase
                .from('org')
                .select('org_shrt_nm, org_desc, org_id')
                .eq('org_shrt_nm', companyName);
            if (data.length > 0) {
                orgID = data[0].org_id;
            } else {
                const { data, error } = await supabase
                    .from('org')
                    .insert([{ created_at: dateFormat(), org_shrt_nm: companyName, org_desc: companyName }]).select();
                if (data.length > 0) {
                    orgID = data[0].org_id;
                }
            }
            // Check ORG Exists Over //

            if (orgID > 0) {
                    // Check Customer Exists Start //
                const { getCustomerData, getCustomerError } = await supabase
                    .from('cust')
                    .select('cust_id')
                    .eq('cust_shrt_nm', user.name);
                if (getCustomerData.length > 0) {
                    customerID = getCustomerData[0].cust_id;
                } else {
                    const { customerData, customerError } = await supabase
                        .from('cust')
                        .insert([
                            {
                                //cust_id: user.id,
                                created_at: dateFormat(),
                                cust_shrt_nm: user.name,
                                cust_desc: user.role,
                                strt_dt: dateFormat(),
                                end_dt: dateFormat(),
                                org_id: orgID,
                                legal_name: user.name,
                            }
                        ]).select();
                    if (customerData.length > 0) {
                        customerID = data[0].cust_id;
                    }
                    console.log("customerID",customerID);
                    // Check Customer Exists Over //
                }
            }

            if (customerID > 0 && orgID > 0) {
                console.log("===",customerID,"===",orgID);
                return false;
                const { getCustomerDtlData, getCustomerDtlError } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', customerID);
                if(getCustomerDtlData.length > 0){
                    console.log("Update Details");
                    const { data, error } = await supabase
                    .from('cust_dtl')
                    .update({ profile_logo: companyLogo,
                        profile_cover: companyCover,
                        company_name: companyName,
                        email: companyEmail,
                        phone: companyPhone,
                        website: companyWebsite,
                        company_since: companyEst,
                        employee_size: companyTeamSize,
                        departments: companyMultipleSelect,
                        allow_indexig: companyAllowSearchListing,
                        description: companyAbout })
                    .eq('cust_dtl_id', getCustomerDtlData[0].cust_dtl_id);
                } else {
                    console.log("Insert Details");
                    const { customerDetailData, error } = await supabase
                    .from('cust_dtl')
                    .insert([
                        {
                            user_id: user.id,
                            cust_id: customerID,
                            profile_logo: companyLogo,
                            profile_cover: companyCover,
                            company_name: companyName,
                            email: companyEmail,
                            phone: companyPhone,
                            website: companyWebsite,
                            company_since: companyEst,
                            employee_size: companyTeamSize,
                            departments: companyMultipleSelect,
                            allow_indexig: companyAllowSearchListing,
                            description: companyAbout
                        }
                    ]).select();
                console.log("customerDetailData", customerDetailData);
                }

                
            }
            // open toast
            toast.success('Company Profile Updated successfully', {
                position: "bottom-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setCompanyProfileData(JSON.parse(JSON.stringify(addCompanyProfileFields)))

            setTimeout(() => {
                Router.push("/employers-dashboard/company-profile")
            }, 3000);

        } catch (err) {
            // open toast
            toast.error('Error while saving your company profile, Please try again later or contact tech support', {
                position: "bottom-right",
                autoClose: false,
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
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};


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

    const user = useSelector(state => state.candidate.user)
    const [companyProfileData, setCompanyProfileData] = useState(JSON.parse(JSON.stringify(addCompanyProfileFields)));
    const { companyLogo,
        companyCover,
        companyName,
        companyEmail,
        companyPhone,
        companyWebsite,
        companyEst,
        companyTeamSize,
        companyMultipleSelect,
        companyAllowSearchListing,
        companyAbout } = useMemo(() => companyProfileData, [companyProfileData])

    const searchInput = useRef(null);


    return (
        <form className="default-form">
            <div className="row">
                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Company name <span className="optional">(optional)</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Invisionn"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyName: e.target.value
                            }))
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Email address</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="john.doe@companydomain.com"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyEmail: e.target.value
                            }))
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="+1 (555)555-5555"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyPhone: e.target.value
                            }))
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Website</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="www.companyname.com"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyWebsite: e.target.value
                            }))
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Est. Since</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="1970-12-31"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyEst: e.target.value
                            }))
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Team Size <span className="required">(required)</span></label>
                    <select
                        className="chosen-single form-select"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyTeamSize: e.target.value
                            }))
                        }}
                    >
                        <option></option>
                        <option>50 - 100</option>
                        <option>100 - 150</option>
                        <option>200 - 250</option>
                        <option>300 - 350</option>
                        <option>500 - 1000</option>
                        <option>1000+</option>
                    </select>
                </div>

                {/* <!-- Search Select --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Multiple Select boxes </label>
                    {/* <Select
                        defaultValue={[catOptions[2]]}
                        isMulti
                        name="colors"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyMultipleSelect: e.target.value
                            }))
                        }}
                        onChange={(e) => {
                            const updatedOptions = [...e.target.options]
                              .filter((option) => option.selected)
                              .map((x) => x.value);
                            console.log("updatedOptions", updatedOptions);
                            setSpecialism(updatedOptions);
                            setSpecialism(e || []);
                          }}
                    /> */}
                    <select
                        className="chosen-single form-select"
                        required
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyMultipleSelect: e.target.value
                            }))
                        }}
                    >
                        <option></option>
                        <option>Retail</option>
                        <option>Banking</option>
                        <option>Digital</option>
                    </select>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Allow In Search & Listing</label>
                    <select
                        className="chosen-single form-select"
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyAllowSearchListing: e.target.value
                            }))
                        }}
                    >
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>

                {/* <!-- About Company --> */}
                <div className="form-group col-lg-12 col-md-12">
                    <label>About Company</label>
                    <textarea
                        placeholder="enter texts about your company"
                        onChange={(e) => {
                            setCompanyProfileData((previousState) => ({
                                ...previousState,
                                companyAbout: e.target.value
                            }))
                        }}
                    ></textarea>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <button
                        className="theme-btn btn-style-one"
                        onClick={(e) => {
                            e.preventDefault();
                            submitCompanyProfile(companyProfileData, setCompanyProfileData, user);
                        }}
                    >Save</button>
                </div>
            </div>
        </form>
    );
};

export default FormInfoBox;
