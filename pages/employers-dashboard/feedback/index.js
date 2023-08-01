import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
//import Feedback from "../../../components/dashboard-pages/candidates-dashboard/feedback";
import Feedback from '../../../components/dashboard-pages/employers-dashboard/feedback';

const index = () => {
  return (
    <>
      <Seo pageTitle="Feedback" />
      <Feedback />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
