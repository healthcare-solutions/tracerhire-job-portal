import candidatesData from "../../../../../data/candidates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";
import Applicants from "./Applicants";

const WidgetContentBox = () => {
    const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
    const [searchField, setSearchField] = useState('');

    
    const dateFormat = (val) => {
      const date = new Date(val)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
    }
  
    // clear all filters
    const clearAll = () => {
        setSearchField('');
        fetchedAllApplicantsView()
    };

    async function findApplicant () {
        let { data, error } = await supabase
            .from('applicants_view')
            .select("*")
            .order('created_at',  { ascending: false });

        if(data) {
            data.forEach( applicant => applicant.created_at = dateFormat(applicant.created_at))
            setFetchedAllApplicantsData(data.filter((applicant) => applicant.name.toLowerCase().includes(searchField.toLowerCase())))
        }
    };

    const fetchedAllApplicantsView = async () => {
      try{
        let { data: allApplicantsView, error } = await supabase
            .from('applicants_view')
            .select("*")
            .order('created_at',  { ascending: false });

        if (allApplicantsView) {
            allApplicantsView.forEach( i => i.created_at = dateFormat(i.created_at))
            setFetchedAllApplicantsData(allApplicantsView)
        }
      } catch(e) {
        toast.error('System is unavailable.  Please try again later or contact tech support!', {
          position: "bottom-right",
          autoClose: false,
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
      fetchedAllApplicantsView()
    }, []);


    const ViewCV = async (applicationId) => {
        const { data, error } = await supabase
              .from('applicants_view')
              .select('*')
              .eq('application_id', applicationId);

        if (data) {
            window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
        }
        if (error) {
            toast.error('Error while retrieving CV.  Please try again later or contact tech support!', {
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
    }

    const Qualified = async (applicationId, status) => {
        if (status != 'Qualified') {
          const { data, error } = await supabase
              .from('applications')
              .update({ status: 'Qualified' })
              .eq('application_id', applicationId)
    
          // open toast
          toast.success('Applicant status marked as Qualified.  Please let Applicant know about your decision!', {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
    
          // fetching for refresh the data
          fetchedAllApplicantsView();
        } else {
          // open toast
          toast.error('Applicant status is already marked as Qualified!', {
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
    }
    
    const NotQualified = async (applicationId, status) => {
        if (status != 'Not Qualified') {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: 'Not Qualified' })
                .eq('application_id', applicationId)

            // open toast
            toast.success('Applicant status marked as Not Qualified.  Please let Applicant know about your decision!', {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView();
        } else {
            // open toast
            toast.error('Applicant status is already marked as Not Qualified!', {
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
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching for refresh the data
            fetchedAllApplicantsView();
        } else {
            // open toast
            toast.error('Applicant status is already reset!', {
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
    }

    return (
        <div className="tabs-box">
            <div className="widget-title">
                <h4>All Applicants!</h4>

                {fetchedAllApplicants.length != 0 ? 
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
                        style={{ minWidth: '300px'}}
                    />
            {/*           
                    <select
                        className="chosen-single form-select chosen-container mx-3"
                        onChange={(e) => {
                        setJobStatus(e.target.value)
                        }}
                    >
                        <option>Status</option>
                        <option>Published</option>
                        <option>Unpublished</option>
                    </select> */}

                    <button
                        onClick={findApplicant}
                        className="btn btn-primary text-nowrap m-1"
                        style= {{ minHeight: '43px' }}
                    >
                        Search
                    </button>
                    <button
                        onClick={clearAll}
                        className="btn btn-danger text-nowrap m-1"
                        style= {{ minHeight: '43px' }}
                    >
                        Clear
                    </button>
                    </div> : '' }
            </div>
            {/* End filter top bar */}

            {/* Start table widget content */}
            {fetchedAllApplicants.length == 0 ? <p style={{ fontSize: '1rem', fontWeight: '500' }}><center>No applicant applied to any of your posted jobs!</center></p>: 
                <div className="widget-content">
                    <div className="table-outer">
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
                                            {applicant.name}
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
                                    { applicant.status == "Qualified" ?
                                        <td className="status">Qualified</td>
                                        : applicant.status == "Not Qualified" ?
                                        <td className="status" style={{ color: 'red' }}>Not Qualified</td>
                                        : <td className="pending">New</td>
                                    }
                                    <td>
                                        <div className="option-box">
                                            <ul className="option-list">
                                            <li onClick = { () => { ViewCV(applicant.application_id) }}>
                                                <button data-text="View/Download CV">
                                                <span className="la la-file-download"></span>
                                                </button>
                                            </li>
                                            <li onClick={()=>{ Qualified(applicant.application_id, applicant.status) }} >
                                                <button data-text="Qualified">
                                                <span className="la la-check"></span>
                                                </button>
                                            </li>
                                            <li onClick={()=>{ NotQualified(applicant.application_id, applicant.status) }} >
                                                <button data-text="Not Qualified">
                                                <span className="la la-times-circle"></span>
                                                </button>
                                            </li>
                                            <li onClick={()=>{ ResetStatus(applicant.application_id, applicant.status) }} >
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
                        </table>
                    </div>
                </div>
            }
            {/* End table widget content */}
        </div>
    );
};

export default WidgetContentBox;
