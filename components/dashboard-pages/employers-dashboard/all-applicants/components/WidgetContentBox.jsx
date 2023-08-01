import candidatesData from "../../../../../data/candidates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";
import Applicants from "./Applicants";
import { BallTriangle } from 'react-loader-spinner'

const WidgetContentBox = () => {
    const user = useSelector(state => state.candidate.user);
    console.log("user",user);
    const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
    const [searchField, setSearchField] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [rpp, setRpp] = useState(20);
    const [arrPages, setArrPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const dateFormat = (val) => {
        const date = new Date(val)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
    }

    // clear all filters
    const clearAll = () => {
        setSearchField('');
        setJobStatus('');
        fetchedAllApplicantsView(currentPage)
    };

    async function findApplicant() {
        setIsLoading(true);
        console.log("jobStatus",jobStatus);
        if (searchField != '' && jobStatus != "") {
            console.log("if 1");
            let { data, error } = await supabase
                .from('applications_view')
                .select("*")
                .ilike('name', '%' + searchField + '%')
                //.eq('cust_id', user.id)
                .eq('status', jobStatus)
                .order('created_at', { ascending: false });
            if (data) {
                data.forEach(applicant => applicant.created_at = dateFormat(applicant.created_at))
                setFetchedAllApplicantsData(data.filter((applicant) => applicant.name.toLowerCase().includes(searchField.toLowerCase())))
            }
            setIsLoading(false);
        } else if (searchField != '') {
            console.log("if 2");
            let { data, error } = await supabase
                .from('applications_view')
                .select("*")
                .ilike('name', '%' + searchField + '%')
                //.eq('cust_id', user.id)
                .order('created_at', { ascending: false });
            if (data) {
                data.forEach(applicant => applicant.created_at = dateFormat(applicant.created_at))
                setFetchedAllApplicantsData(data.filter((applicant) => applicant.name.toLowerCase().includes(searchField.toLowerCase())))
            }
            setIsLoading(false);
        } else if (jobStatus != null) {
            console.log("jobStatus",jobStatus);
            let { data, error } = await supabase
                .from('applications_view')
                .select("*")
                .eq('status', jobStatus)
                //.eq('cust_id', user.id)
                .order('created_at', { ascending: false });
            if (data) {
                data.forEach(applicant => applicant.created_at = dateFormat(applicant.created_at))
                setFetchedAllApplicantsData(data.filter((applicant) => applicant.name.toLowerCase().includes(searchField.toLowerCase())))
            }
            setIsLoading(false);
        }
    };

    const fetchedAllApplicantsView = async (pageNo) => {
        try {
            setIsLoading(true);
            let countTotalRecords = await supabase
                .from('applications_view')
                .select('*', { count: 'exact', head: true });
                //.eq('cust_id', user.id);
            let totalRecords = countTotalRecords.count;
            
            let recordPerPage = rpp;
            let totalPages = Math.ceil(totalRecords / recordPerPage);
            setTotalPages(totalPages);
            if (totalPages) {
                console.log("2");
                let arrPage = [];
                for (var i = 1; i <= totalPages; i++) {
                    arrPage.push(i);
                }
                setArrPages(arrPage);
                console.log("arrPage", arrPage);
                console.log("3");
                let start_limit = parseInt(parseInt(pageNo - 1) * parseInt(rpp));
                if (pageNo < 1) {
                    start_limit = parseInt(parseInt(pageNo) * parseInt(rpp));
                }
                console.log("4");
                let end_limit = parseInt(start_limit) + parseInt(rpp);
                console.log("start_limit", start_limit, "end_limit", end_limit);
                setCurrentPage(pageNo);

                let { data: allApplicantsView, error } = await supabase
                    .from('applications_view')
                    .select("*")
                    //.eq('cust_id', user.id)
                    .order('created_at', { ascending: false })
                    .range(start_limit, end_limit);
                
                if (allApplicantsView) {
                    allApplicantsView.forEach(i => i.created_at = dateFormat(i.created_at))
                    setFetchedAllApplicantsData(allApplicantsView)
                }
            }
            setIsLoading(false);

        } catch (e) {
            console.log("eeeerror", e);
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

    useEffect(() => {
        setIsLoading(true);
        fetchedAllApplicantsView(currentPage);
    }, []);

    const handleNextPage = (pageNo) => {
        setIsLoading(true);
        fetchedAllApplicantsView(pageNo);
    }


    const ViewCV = async (applicant) => {
        let dataCheck = await supabase
        .from('notification')
        .select('*')
        .eq('application_id', applicant.application_id)
        .eq('cust_id', applicant.cust_id)
        .eq('user_id', applicant.user_id)
        .eq('type', 'Viewed CV');
        if(dataCheck.data.length == 0){
            await supabase
            .from('notification')
            .insert([{
                    type: `Viewed CV`,
                    cust_id: user.id,
                    job_id: applicant.job_id,
                    user_id: applicant.cust_id,
                    application_id: applicant.application_id,
                    notification_text: `${user.name} Viewed ${applicant.name} CV for job <b>${applicant.job_title}</b>`,
                    created_at: dateFormat(new Date())
                }
            ]);
        }

        const { data, error } = await supabase
            .from('applications_view')
            .select('*')
            .eq('application_id', applicant.application_id);

        if (data) {
            window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
        }
        if (error) {
            toast.error('Error while retrieving CV.  Please try again later or contact tech support!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const Qualified = async (applicationId, status, name, license_nbr, job_id, cust_id, job_title,user_id) => {
        if (status != 'Qualified') {

            const { data, error } = await supabase
                .from('applications')
                .update({ status: 'Qualified' })
                .eq('application_id', applicationId)

                let insertNotification = await supabase
                .from('notification')
                .insert([
                    {
                        type: `Qualified For Job`,
                        cust_id: cust_id,
                        job_id: job_id,
                        user_id: user.id,
                        application_id: applicationId,
                        notification_text: `${name} is successfully <b>qualified</b> for ${job_title}`,
                        created_at: dateFormat(new Date())
                    },
                    {
                        type: `Qualified For Job`,
                        cust_id: cust_id,
                        job_id: job_id,
                        user_id: user_id,
                        application_id: applicationId,
                        notification_text: `You are successfully <b>qualified</b> for ${job_title}`,
                        created_at: dateFormat(new Date())
                    }
                ]).select();

            // open toast
            toast.success('Applicant status marked as Qualified.  Please let Applicant know about your decision!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView(currentPage);
        } else {
            // open toast
            toast.error('Applicant status is already marked as Qualified!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const NotQualified = async (applicationId, status, name, license_nbr, job_id, cust_id,job_title) => {
        if (status != 'Not Qualified') {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: 'Not Qualified' })
                .eq('application_id', applicationId);

                let insertNotification = await supabase
                .from('notification')
                .insert([
                    {
                        type: `Not Qualified For Job`,
                        cust_id: cust_id,
                        job_id: job_id,
                        user_id: user.id,
                        application_id: applicationId,
                        notification_text: `${name} is <b>not qualified</b> for ${job_title}`,
                        created_at: dateFormat(new Date())
                    }
                ]).select();
                console.log("insertNotification",insertNotification);

            // open toast
            toast.success('Applicant status marked as Not Qualified.  Please let Applicant know about your decision!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView(currentPage);
        } else {
            // open toast
            toast.error('Applicant status is already marked as Not Qualified!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const Shortlisted = async (applicationId, status, name, license_nbr, job_id, cust_id,job_title,user_id) => {
        if (status != 'Shortlisted') {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: 'Shortlisted' })
                .eq('application_id', applicationId);

                await supabase
                .from('notification')
                .insert([
                    {
                        type: `Shortlisted For Job`,
                        cust_id: cust_id,
                        job_id: job_id,
                        user_id: user.id,
                        application_id: applicationId,
                        notification_text: `${name} is <b>shortlisted</b> for ${job_title}`,
                        created_at: dateFormat(new Date())
                    },
                    {
                        type: `Shortlisted For Job`,
                        cust_id: cust_id,
                        job_id: job_id,
                        user_id: user_id,
                        application_id: applicationId,
                        notification_text: `You are <b>shortlisted</b> for ${job_title}`,
                        created_at: dateFormat(new Date())
                    }
                ]).select();

            // open toast
            toast.success('Applicant status marked as Shortlisted.  Please let Applicant know about your decision!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView(currentPage);
        } else {
            // open toast
            toast.error('Applicant status is already marked as Shortlisted!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }


    const ResetStatus = async (applicationId, status) => {
        if (status != null) {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: null })
                .eq('application_id', applicationId)

            // open toast
            toast.success('Applicant status reset successfully.', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView(currentPage);
        } else {
            // open toast
            toast.error('Applicant status is already reset!', {
                position: "bottom-right",
                autoClose: true,
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
        <div className="tabs-box">
            <div className="widget-title">
                <h4>All Applicants!</h4>
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
                {isLoading == false ?
                    <div className="chosen-outer">
                        {/* <select className="chosen-single form-select chosen-container"> */}
                        {/* <option>All Status</option> */}
                        {/* <option>Last 12 Months</option> */}
                        {/* <option>Last 16 Months</option> */}
                        {/* <option>Last 24 Months</option> */}
                        {/* <option>Last 5 year</option> */}
                        {/* </select> */}

                        {/* TODO: add search filters */}
                        <input
                            className="chosen-single form-input chosen-container mx-3"
                            type="text"
                            name="tracer-hire-applicant"
                            placeholder="Search by Applicant name"
                            value={searchField}
                            onChange={(e) => {
                                setSearchField(e.target.value);
                            }}
                            style={{ minWidth: '300px' }}
                        />

                        <select
                            className="chosen-single form-select chosen-container mx-3"
                            value={jobStatus}
                            onChange={(e) => {
                                setJobStatus(e.target.value)
                            }}
                        >
                            <option value="">Status</option>
                            <option value="New">New</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Not Qualified">Not Qualified</option>
                            <option value="Shortlisted">Shortlisted</option>
                        </select>

                        <button
                            onClick={findApplicant}
                            className="btn btn-primary text-nowrap m-1"
                            style={{ minHeight: '43px' }}
                        >
                            Search
                        </button>
                        <button
                            onClick={clearAll}
                            className="btn btn-danger text-nowrap m-1"
                            style={{ minHeight: '43px' }}
                        >
                            Clear
                        </button>
                    </div> : ''}
            </div>
            {/* End filter top bar */}

            {/* Start table widget content */}

            <div className="widget-content">
                <div className="table-outer">
                    
                    {
                        fetchedAllApplicants.length > 0 ?

                        <table className="default-table manage-job-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Applied On</th>
                                    <th>Job Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>


                                {Array.from(fetchedAllApplicants).slice(0, 10).map((applicant) => (
                                    <tr key={applicant.application_id}>
                                        <td>
                                            {/* <!-- Job Block --> */}
                                            <div className="job-block">
                                                <div className="inner-box">
                                                    {/* <span className="company-logo">
                                            <img src={item.logo} alt="logo" />
                                            </span> */}
                                                    <h4>
                                                        {/* <Link href={`/employers-dashboard/edit-job/${applicant.user_id}`}>
                                                {applicant.name}
                                            </Link> */}
                                            {
                                                applicant.user_id == null ? applicant.name + " (Guest)" : <Link href={`/candidate-details/${applicant.user_id}`}>
                                                {applicant.name}
                                                </Link>
                                            }
                                            
                                                        
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                                            <span>{applicant.created_at}</span>
                                        </td>
                                        <td>
                                            {applicant.job_title}
                                        </td>
                                        {
                                        applicant.status == "Qualified" ?
                                            <td className="status">Qualified</td>
                                            : applicant.status == "Not Qualified" ?
                                            <td className="status" style={{ color: 'red' }}>Not Qualified</td>
                                            : applicant.status == "Shortlisted" ?
                                            <td className="status" style={{ color: 'green' }}>Shortlisted</td>
                                            : <td className="pending">New</td>
                                        }
                                        <td>
                                            <div className="option-box">
                                                <ul className="option-list">
                                                    <li onClick={() => { ViewCV(applicant) }}>
                                                        <button data-text="View/Download CV">
                                                            <span className="la la-file-download"></span>
                                                        </button>
                                                    </li>
                                                    <li onClick={() => { Qualified(applicant.application_id, applicant.status,applicant.name,applicant.license_nbr,applicant.job_id, applicant.cust_id,applicant.job_title,applicant.user_id) }} >
                                                        <button data-text="Qualified">
                                                            <span className="la la-check"></span>
                                                        </button>
                                                    </li>
                                                    <li onClick={() => { NotQualified(applicant.application_id, applicant.status,applicant.name,applicant.license_nbr,applicant.job_id, applicant.cust_id,applicant.job_title) }} >
                                                        <button data-text="Not Qualified">
                                                            <span className="la la-times-circle"></span>
                                                        </button>
                                                    </li>
                                                    <li onClick={() => { Shortlisted(applicant.application_id, applicant.status,applicant.name,applicant.license_nbr,applicant.job_id, applicant.cust_id,applicant.job_title,applicant.user_id) }} >
                                                        <button data-text="Shortlisted">
                                                            <span className="la la-bookmark"></span>
                                                        </button>
                                                    </li>
                                                    <li onClick={() => { ResetStatus(applicant.application_id, applicant.status) }} >
                                                        <button data-text="Reset Status">
                                                            <span className="la la-undo-alt"></span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table> : 
                        <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: 40, paddingTop: 40, textAlign: 'center' }}><center>No applicant applied to any of your posted jobs!</center></p>
                    }
                    {
                        isLoading == false && fetchedAllApplicants.length != 0 && arrPages.length > 1 &&
                        <nav className="ls-pagination">
                            <ul>
                                {
                                    currentPage > 1 && <li className="prev">
                                        <a onClick={() => handleNextPage(parseInt(currentPage) - parseInt(1))}>
                                            <i className="fa fa-arrow-left"></i>
                                        </a>
                                    </li>
                                }

                                {
                                    arrPages.map(item => {
                                    if(arrPages.length > 6){
                                        let nextThreePages = item - 4;
                                        let prevThreePages = item + 4;
                                        if(currentPage > nextThreePages){
                                        if(currentPage < prevThreePages){
                                        return (
                                            <li><a onClick={() => handleNextPage(item)} className={item == currentPage ? 'current-page' : 'non-current-page'}>{item}</a></li>
                                        )
                                        }
                                        }
                                    } else{
                                        return (
                                        <li><a onClick={() => handleNextPage(item)} className={item == currentPage ? 'current-page' : 'non-current-page'}>{item}</a></li>
                                        )
                                    }
                                    
                                    })
                                }

                                {
                                    currentPage < totalPages && <li className="next">
                                        <a onClick={() => handleNextPage(parseInt(currentPage) + parseInt(1))}>
                                            <i className="fa fa-arrow-right"></i>
                                        </a>
                                    </li>
                                }

                            </ul>
                        </nav>
                    }
                </div>
            </div>

            {/* End table widget content */}
        </div>
    );
};

export default WidgetContentBox;
