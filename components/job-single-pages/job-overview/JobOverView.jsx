const JobOverView = ({ company }) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Date Posted:</h5>
          <span>Posted 1 hours ago</span>
        </li>
{/*
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Expiration date:</h5>
          <span>{company.deadline}</span>
        </li>
 */}
        {company?.job_address ?
            <li>
              <i className="icon icon-location"></i>
              <h5>Location:</h5>
              <span>
                {company?.job_address}
              </span>
            </li>
            : '' }

        { company?.job_title ?
            <li>
              <i className="icon icon-user-2"></i>
              <h5>Job Title:</h5>
              <span>{company?.job_title}</span>
            </li>
            : '' }
        { company?.salary ?
            <li>
              <i className="icon icon-rate"></i>
              <h5>Salary:</h5>
              <span>${company?.salary} {company?.salary_rate}</span>
            </li>
            : '' }
        { company?.job_type ?
            <li>
              <i className="icon icon-clock"></i>
              <h5>Job Type:</h5>
              <span>{company?.job_type}</span>
            </li>
            : '' }
        { company?.experience ?
            <li>
              <i className="icon icon-experience"></i>
              <h5>Experience:</h5>
              <span>{company?.experience}</span>
            </li>
            : '' }
        { company?.education ?
            <li>
              <i className="icon icon-education"></i>
              <h5>Education:</h5>
              <span>{company?.education}</span>
            </li>
            : '' }
{/*
        <li>
          <i className="icon icon-clock"></i>
          <h5>Rate:</h5>
          <span>50hr / week</span>
        </li>
 */}
      </ul>
    </div>
  );
};

export default JobOverView;
