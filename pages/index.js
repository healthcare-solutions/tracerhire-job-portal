import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Home15 from "./home-15";

const index = () => {
  return (
    <>
      <Seo pageTitle="Home-1" />
      <Home15 />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
