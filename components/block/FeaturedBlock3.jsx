import Link from "next/link";
import { useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import { supabase } from '../../config/supabaseClient';


const FeaturedBlock3 = () => {

  const user = useSelector(state => state.candidate.user);
  const [cities, setCities] = useState("");

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {

    let fetch_cities = await supabase
    .from('jobs')
    .select("*")
    .order('created_at', { ascending: false })
    .range(0, 12);
    if(fetch_cities.data){
      const unique = fetch_cities.data.filter(
        (obj, index) =>
        fetch_cities.data.findIndex((item) => item.job_address === obj.job_address) === index
      );
      setCities(unique);
    }
  };

  const handleJobList = (city) => {
    Router.push({
      pathname: '/job-list',
      query: { city: city},
  })
  }

  return (
    <>
      {cities.length > 0 && cities.map((item) => (
        <div className="col-lg-3 col-md-6 col-sm-12" key={item.cust_dtl_id}>
          <div className="feature-block">
            <div className="inner-box">
              <figure className="image">
                <img src={"images/index-15/cities/1.png"} alt="featued" />
              </figure>
              <div className="overlay-box">
                <div className="content">
                  <h5>{item.job_address}</h5>
                  {/* <Link href="/job-list" className="overlay-link"></Link> */}
                  <button onClick={() => handleJobList(item.job_address)} className="overlay-link"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedBlock3;
