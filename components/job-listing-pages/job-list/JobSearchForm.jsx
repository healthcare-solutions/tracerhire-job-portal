import { useDispatch, useSelector } from "react-redux";
import Categories from "../components/Categories";
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";
import { setSearchFields } from "../../../features/search/searchSlice";

const JobSearchForm = () => {
  const dispatch = useDispatch()
  const filterTerm = useSelector((state) => state.filter.jobList.keyword)
  const filterLocation = useSelector((state) => state.filter.jobList.location)
  const findJobs = () => {
    dispatch(setSearchFields({ searchTerm: filterTerm, searchAddress: filterLocation }))
  }

  return (
    <div className="job-search-form">
      <div className="row">
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <SearchBox />
        </div>
        {/* <!-- Form Group --> */}

        <div className="form-group col-lg-4 col-md-12 col-sm-12 location">
          <LocationBox />
        </div>
        {/* <!-- Form Group --> */}

{/*
        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <Categories />
        </div>
 */}
        {/* <!-- Form Group --> */}

        <div className="form-group col-lg-4 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one" onClick={findJobs}>
            Find Jobs
          </button>
        </div>
        {/* <!-- Form Group --> */}
      </div>
    </div>
    // End job Search form
  );
};

export default JobSearchForm;