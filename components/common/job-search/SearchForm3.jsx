import Router from "next/router";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSearchFields } from "../../../features/search/searchSlice";
import { addKeyword, addLocation } from "../../../features/filter/filterSlice";


const apiKey = process.env.NEXT_PUBLIC_JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

// load google map api js
function loadAsyncScript(src) {
    return new Promise(resolve => {
        const script = document.createElement("Script");
        Object.assign(script, {
            type: "text/javascript",
            async: true,
            src
        })
        script.addEventListener("load", () => resolve(script));
        document.head.appendChild(script);
    })
}


const SearchForm3 = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const searchInput = useRef(null);
  const searchTerm = useRef(null)

  // init google map script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
        return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const location = autocomplete.getPlace();
    console.log(location);
  }

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;
  
    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, {
        types: ['(cities)']
    });
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete))

  }

  const searchFunction = () => {
    const sKeyword = searchTerm.current.value
    const sAddress = searchInput.current.value
    dispatch(setSearchFields({ searchTerm: sKeyword, searchAddress: sAddress }))
    dispatch(addKeyword(sKeyword))
    dispatch(addLocation(sAddress))
    // TODO: fetch data from firebase and then route to next page
    
    Router.push("/job-list") 
  }
  

  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);

  return (
    <form onClick={handleSubmit}>
      <div className="row">
        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="immense-search_form_job_title"
            placeholder="Job title, keywords, or company"
            ref={searchTerm}
          />
        </div>

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-4 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input
            type="text"
            name="immense-search_form_location"
            ref={searchInput}
            placeholder="City, State, Country or Zip code" />
        </div>

        {/* <!-- Form Group --> */}
        {/* <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
          <span className="icon flaticon-briefcase"></span>
          <select className="chosen-single form-select">
            <option defaultValue="">All Categories</option>
            <option defaultValue="44">Accounting / Finance</option>
            <option defaultValue="106">Automotive Jobs</option>
            <option defaultValue="46">Customer</option>
            <option defaultValue="48">Design</option>
            <option defaultValue="47">Development</option>
            <option defaultValue="45">Health and Care</option>
            <option defaultValue="105">Marketing</option>
            <option value="107">Project Management</option>
          </select>
        </div> */}

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-4 col-md-12 col-sm-12 text-right">
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={searchFunction}
          >
            Find Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm3;
