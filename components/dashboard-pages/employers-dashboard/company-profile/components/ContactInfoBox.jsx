import Map from "../../../Map";
import { useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../config/supabaseClient';
const apiKey = process.env.NEXT_PUBLIC_JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

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

const ContactInfoBox = () => {

    const user = useSelector(state => state.candidate.user);

    const [companyCountry, setCompanyCountry] = useState("");
    const [companyCity, setCompanyCity] = useState("");
    const [companyState, setcompanyState] = useState("");
    const [companyAddress1, setCompanyAddress1] = useState("");
    const [companyZipcode, setCompanyZipcode] = useState("");
    const [companyFindOnMap, setCompanyFindOnMap] = useState("");
    const [companyLatitude, setCompanyLatitude] = useState("");
    const [companyLongitude, setCompanyLongitude] = useState("");

    const searchInput = useRef(null);

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
        if(location){
            
            setTimeout(() => {
                console.log("Location ==> ",location.address_components);
                // console.log("City ==> ",location.address_components[0].long_name);
                // console.log("Address ==> ",location.address_components[1].long_name);
                // console.log("State ==> ",location.address_components[2].short_name);
                // console.log("Country ==> ",location.address_components[3].short_name);
                // console.log("Lo",location.geometry.viewport.Ha.lo);
                // console.log("Hi",location.geometry.viewport.Va.hi);
                //setcompanyState(location.address_components[2].long_name);
                //setCompanyCountry(location.address_components[3].long_name);
                if(location.address_components && location.address_components !== undefined){
                    setCompanyCity(location.address_components[0].long_name);
                    setCompanyAddress1(location.address_components[0].long_name);
                    if(location.address_components[1].short_name.length == 2){
                        setcompanyState(location.address_components[2].long_name);
                    } else {
                        setCompanyAddress1(location.address_components[1].long_name);
                    }

                    if(location.address_components[2].short_name == 'US'){
                        setCompanyCountry(location.address_components[2].short_name);
                    } else {
                        setcompanyState(location.address_components[2].long_name);
                    }

                    if(location.address_components.length == 4){
                        setCompanyCountry(location.address_components[3].short_name);
                    }                    
                    setCompanyLatitude(location.geometry.viewport.Va.hi);
                    setCompanyLongitude(location.geometry.viewport.Ha.lo);
                }
                setCompanyFindOnMap(searchInput.current.value);
            }, 2000);
        }
        
        // setJobData((previousState) => ({ 
        // ...previousState,
        // address: searchInput.current.value
        // }))
    }

    // init autocomplete
    const initAutocomplete = () => {
            if (!searchInput.current) return;
            const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, {
                types: ['(cities)']
            }
        );
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete))
    }

    // load map script after mounted
    useEffect(() => {
        initMapScript().then(() => initAutocomplete())
    }, []);

    useEffect(() => {
        fetchCustomer(user.id);
    }, []);

    const fetchCustomer = async (userID) => {
        try {
            if (userID) {
                let { data: customer, error } = await supabase
                    .from('cust_dtl')
                    .select("*")
                    .eq('cust_id', userID)

                if (customer) {
                    setCompanyCountry(customer[0].county);
                    setCompanyCity(customer[0].city);
                    setcompanyState(customer[0].st_cd);
                    setCompanyAddress1(customer[0].street);
                    setCompanyFindOnMap(customer[0].map_address);
                    setCompanyLatitude(customer[0].latitude);
                    setCompanyLongitude(customer[0].longitude);
                    setCompanyZipcode(customer[0].zip_cd);
                }
            }
        } catch (e) {
            toast.error('System is unavailable.  Please try again later or contact tech support!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.warn(e)
        }
    };

    const submitCompanyProfile = async () => {
        //if (companyCountry && companyCity && companyAddress1) {
            try {
                const dateFormat = () => {
                    const date = new Date()
                    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
                }

                const { data, error } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', user.id);
                if (data.length > 0) {
                    const { dataUpdate, error } = await supabase
                        .from('cust_dtl')
                        .update({
                            street: companyAddress1,
                            city: companyCity,
                            zip_cd: companyZipcode,
                            st_cd: companyState,
                            county: companyCountry,
                            latitude: companyLatitude,
                            map_address: companyFindOnMap,
                            longitude: companyLongitude,
                            modified_at: dateFormat()
                        })
                        .eq('cust_dtl_id', data[0].cust_dtl_id);
                }

                // open toast
                toast.success('Contact Info Updated successfully', {
                    position: "bottom-right",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setTimeout(() => {
                    Router.push("/employers-dashboard/company-profile")
                }, 3000);

            } catch (err) {
                // open toast
                console.log("Error", err);
                toast.error('Error while saving your company profile, Please try again later or contact tech support', {
                    position: "bottom-right",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // console.warn(err);
            }
        // } else {
        //     // open toast
        //     toast.error('Please fill all the required fields.', {
        //         position: "top-center",
        //         autoClose: true,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "colored",
        //     });
        // }
    };

    return (
        <form className="default-form overflow-x-hidden">
            <div className="row">
                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Country</label>
                    <select 
                    className="chosen-single form-select" 
                    value={companyCountry}
                    onChange={(e) => {setCompanyCountry(e.target.value)}}
                    required>
                        <option value="AUS">Australia</option>
                        <option value="US">USA</option>
                        <option value="CHN">Chaina</option>
                        <option value="JPN">Japan</option>
                        <option value="IN">India</option>
                    </select>
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>City</label>
                    {/* <select 
                    className="chosen-single form-select" 
                    value={companyCity}
                    onChange={(e) => {setCompanyCity(e.target.value)}}
                    required
                    >
                        <option>Melbourne</option>
                        <option>New York</option>
                        <option>Beiging</option>
                        <option>Tokyo</option>
                        <option>New Delhi</option>
                    </select> */}
                    <input
                        type="text"
                        name="name"
                        value={companyCity}
                        onChange={(e) => {setCompanyCity(e.target.value)}}
                        placeholder="Please enter city."
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-5 col-md-12">
                    <label>Complete Address</label>
                    <input
                        type="text"
                        name="name"
                        value={companyAddress1}
                        onChange={(e) => {setCompanyAddress1(e.target.value)}}
                        placeholder="Richmond, VA, USA"
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-3 col-md-12">
                    <label>State</label>
                    <input
                        type="text"
                        name="name"
                        value={companyState}
                        onChange={(e) => {setcompanyState(e.target.value)}}
                        placeholder="NY"
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-4 col-md-12">
                    <label>Zipcode</label>
                    <input
                        type="text"
                        name="name"
                        value={companyZipcode}
                        onChange={(e) => {setCompanyZipcode(e.target.value)}}
                        placeholder="37203"
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Find On Map</label>
                    <input
                        type="text"
                        name="name"
                        ref={searchInput}
                        value={companyFindOnMap}
                        onChange={(e) => {setCompanyFindOnMap(e.target.value)}}
                        placeholder="Richmond, VA, USA"
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-3 col-md-12">
                    <label>Latitude</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Melbourne"
                        value={companyLatitude}
                        onChange={(e) => {setCompanyLatitude(e.target.value)}}
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-3 col-md-12">
                    <label>Longitude</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Melbourne"
                        value={companyLongitude}
                        onChange={(e) => {setCompanyLongitude(e.target.value)}}
                        required
                    />
                </div>

                {/* <!-- Input --> */}
                {/* <div className="form-group col-lg-12 col-md-12">
                    <button className="theme-btn btn-style-three">
                        Search Location
                    </button>
                </div> */}

                {/* <div className="form-group col-lg-12 col-md-12">
                    <div className="map-outer">
                        <div style={{ height: "420px", width: "100%" }}>
                            <Map />
                        </div>
                    </div>
                </div> */}
                {/* End MapBox */}

                {/* <!-- Input --> */}
                <div className="form-group col-lg-12 col-md-12">
                    <button 
                    type="submit" 
                    className="theme-btn btn-style-one"
                    onClick={(e) => {
                        e.preventDefault();
                        submitCompanyProfile();
                    }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactInfoBox;
