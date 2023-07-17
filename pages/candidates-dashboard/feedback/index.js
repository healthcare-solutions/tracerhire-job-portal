import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
//import Packages from "../../../components/dashboard-pages/candidates-dashboard/packages";
import Feedback from "../../../components/dashboard-pages/candidates-dashboard/feedback";

const index = () => {
  return (
    <>
      <Seo pageTitle="Feedback" />
      <Feedback />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
