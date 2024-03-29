import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword } from "../../../features/filter/filterSlice";

const SearchBox = () => {

    // const urlParams = new URLSearchParams(window.location.search);
    // let search_term = "";
    // if (urlParams.get('keyword') != "") {
    //   search_term = urlParams.get('keyword');
    // }
    // const keywordHandler = (e) => {
    //     setkeyWord(e.target.value);
    // };
    // useEffect(() => {
    //     setkeyWord(search_term);
    // }, [setkeyWord, jobList]);

    const { jobList } = useSelector((state) => state.filter);
    const [getKeyWord, setkeyWord] = useState(jobList.keyword);
    const dispath = useDispatch();

    // keyword handler
    const keywordHandler = (e) => {
        dispath(addKeyword(e.target.value));
    };

    useEffect(() => {
        setkeyWord(jobList.keyword);
    }, [setkeyWord, jobList]);

    return (
        <>
            <input
                type="text"
                name="tracer-hire-search_form_job_title"
                placeholder="Job title, keywords, or company"
                id="search_keyword"
                value={getKeyWord}
                onChange={keywordHandler}
            />
            <span className="icon flaticon-search-3"></span>
        </>
    );
};

export default SearchBox;
