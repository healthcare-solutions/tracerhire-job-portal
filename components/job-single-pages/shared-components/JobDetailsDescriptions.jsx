const JobDetailsDescriptions = ({ company }) => {
  return (
    <div className="job-detail">
      <h4>Job Description</h4>
      <p dangerouslySetInnerHTML={{ __html: company?.job_desc }}></p>
    </div>
  );
};

export default JobDetailsDescriptions;
