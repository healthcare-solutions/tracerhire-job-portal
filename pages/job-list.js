import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import JobListV5 from "../components/job-listing-pages/job-list";

const index = () => {
  return (
    <>
      <Seo pageTitle="Job List" />
      <JobListV5 />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
