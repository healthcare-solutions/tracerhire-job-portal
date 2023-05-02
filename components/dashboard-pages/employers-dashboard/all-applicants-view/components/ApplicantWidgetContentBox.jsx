import candidatesData from "../../../../../data/candidates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";

const ApplicantWidgetContentBox = () => {
    const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
    const router = useRouter();
    const id = router.query.id;
  
    
    const dateFormat = (val) => {
      const date = new Date(val)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
    }
  
    const fetchedAllApplicantsView = async () => {
      try{
        if (id) {
          let { data: allApplicantsView, error } = await supabase
              .from('applicants_view')
              .select("*")
  
              // Filters
              .eq('job_id', id)
              .order('created_at',  { ascending: false });
  
          if (allApplicantsView) {
              allApplicantsView.forEach( i => i.created_at = dateFormat(i.created_at))
              setFetchedAllApplicantsData(allApplicantsView)
          }
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
    }, [id]);
  

    const ViewCV = async (applicationId) => {
        const { data, error } = await supabase
              .from('applicants_view')
              .select('*')
              .eq('application_id', applicationId)

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
            <h4>
                {Array.from(fetchedAllApplicants)?.length != 0 ?
                    <div>
                        <span>Applicants who applied in  </span>
                        <span style={{ color: 'blue' }}><u><b>{Array.from(fetchedAllApplicants)[0].job_title}</b></u></span> 
                    </div>
                    : ''
                }
            </h4>

            <div className="chosen-outer">
                {/* <!--Tabs Box--> */}
    {/*
                <select className="chosen-single form-select">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>Last 16 Months</option>
                <option>Last 24 Months</option>
                <option>Last 5 year</option>
                </select>
        */}
            </div>
            </div>
            {/* End filter top bar */}

            {/* Start table widget content */}
            {fetchedAllApplicants.length == 0 ? <p style={{ fontSize: '1rem', fontWeight: '500' }}><center>No applicant applied to this job!</center></p>: 
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

export default ApplicantWidgetContentBox;
