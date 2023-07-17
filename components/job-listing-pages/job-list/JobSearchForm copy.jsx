import { useDispatch, useSelector } from "react-redux";
import Categories from "../components/Categories";
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";
import Router, { useRouter } from "next/router";
import { setSearchFields } from "../../../features/search/searchSlice";

const JobSearchForm = () => {
  const dispatch = useDispatch()
  const filterTerm = useSelector((state) => state.filter.jobList.keyword)
  const filterLocation = useSelector((state) => state.filter.jobList.location)
  const findJobs = () => {
    //dispatch(setSearchFields({ searchTerm: filterTerm, searchAddress: filterLocation }))

    // const urlParams = new URLSearchParams(window.location.search);
    // let search_term = "";
    // let final_address = "";
    // if (urlParams.get('keyword') != "") {
    //   search_term = urlParams.get('keyword');
    // }
    // if (urlParams.get('city') != "") {
    //   final_address = urlParams.get('city');
    // }
    // Router.push({
    //   pathname: '/job-list',
    //   query: { city: final_address, keyword: search_term },
    // })

    // if(document.getElementById('search_location').value  == '' || document.getElementById('search_keyword').value == ''){
    //   Router.push({pathname: '/'});
    // } else {
      Router.push({
        pathname: '/job-list',
        query: { city: document.getElementById('search_location').value, keyword: document.getElementById('search_keyword').value },
      })
    //}
  }

  return (
    <div className="job-search-form">
      <div className="row">
        
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <SearchBox />
        </div>
        <div className="form-group col-lg-4 col-md-12 col-sm-12 location">
          <LocationBox />
        </div>
        <div className="form-group col-lg-4 col-md-12 col-sm-12 text-right">
          <button type="submit" id="find_jobs_id" className="theme-btn btn-style-one" onClick={findJobs}>
            Filter Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearchForm;
