import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    latestJob: [],
    category: [{
            id: 1,
            name: "Residential",
            value: "residential",
        },
        {
            id: 2,
            name: "Commercial",
            value: "commercial",
        },
        {
            id: 3,
            name: "Industrial",
            value: "industrial",
        },
        {
            id: 4,
            name: "Apartments",
            value: "apartments",
        },
    ],
    jobTypeList: [{
            id: 1,
            name: "Full Time",
            value: "Full Time",
            isChecked: false,
        },
        {
            id: 2,
            name: "Part Time",
            value: "Part Time",
            isChecked: false,
        },
        {
            id: 3,
            name: "Both",
            value: "Both",
            isChecked: false,
        },
        {
            id: 4,
            name: "Per Diem",
            value: "Per Diem",
            isChecked: false,
        },
    ],
    datePost: [{
            id: 1,
            name: "All",
            value: "all",
            isChecked: false
        },
        {
            id: 2,
            name: "Last 24 Hour",
            value: "last-24-hour",
            isChecked: false,
        },
        {
            id: 3,
            name: "Last 7 Days",
            value: "last-7-days",
            isChecked: false
        },
        {
            id: 4,
            name: "Last 14 Days",
            value: "last-14-days",
            isChecked: false,
        },
        {
            id: 5,
            name: "Last 30 Days",
            value: "last-30-days",
            isChecked: false,
        },
    ],
    experienceLavel: [
        { id: 1, name: "1 Year", value: "1 year", isChecked: false },
        { id: 2, name: "2 Years", value: "2 years", isChecked: false },
        { id: 3, name: "3 Years", value: "3 years", isChecked: false },
        { id: 4, name: "4 Years", value: "4 years", isChecked: false },
        { id: 5, name: "5 Years", value: "5 years", isChecked: false },
        { id: 6, name: "6 Years", value: "6 years", isChecked: false },
        { id: 7, name: "7 Years", value: "7 years", isChecked: false },
        { id: 8, name: "8 Years", value: "8 years", isChecked: false },
        { id: 9, name: "9 Years", value: "9 years", isChecked: false },
        { id: 10, name: "10+ Years", value: "10+ years", isChecked: false },
    ],
    tags: [{
            id: 1,
            name: "App",
            value: "app",
        },
        {
            id: 2,
            name: "Administrative",
            value: "administrative",
        },
        {
            id: 3,
            name: "Android",
            value: "android",
        },
        {
            id: 4,
            name: "Wordpress",
            value: "wordpress",
        },
        {
            id: 5,
            name: "Design",
            value: "design",
        },
        {
            id: 6,
            name: "React",
            value: "react",
        },
    ],
    recentJobs: []
};

export const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        addLatestJob: (state, { payload }) => {
            const isExist = state.latestJob?.includes(payload);
            if (isExist) {
                state.latestJob = state.latestJob.filter(
                    (item) => item !== payload
                );
            } else {
                state.latestJob.push(payload);
            }
        },
        clearJobTypeToggle: (state) => {
            state?.jobTypeList?.map((item) => {
                item.isChecked = false;
                return {
                    ...item,
                };
            });
        },
        jobTypeCheck: (state, { payload }) => {
            state?.jobTypeList?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false;
                    } else {
                        item.isChecked = true;
                    }
                }
                return {
                    ...item,
                };
            });
        },
        datePostCheck: (state, { payload }) => {
            state?.datePost?.map((item) => {
                item.isChecked = false;
                if (item.id === payload) {
                    item.isChecked = true;
                }
                return {
                    ...item,
                };
            });
        },
        clearDatePostToggle: (state) => {
            state?.datePost?.map((item) => {
                item.isChecked = false;
                return {
                    ...item,
                };
            });
        },
        experienceLavelCheck: (state, { payload }) => {
            state?.experienceLavel?.map((item) => {
                if (item.id === payload) {
                    if (item.isChecked) {
                        item.isChecked = false;
                    } else {
                        item.isChecked = true;
                    }
                }
                return {
                    ...item,
                };
            });
        },
        clearExperienceToggle: (state) => {
            state?.experienceLavel?.map((item) => {
                item.isChecked = false;
                return {
                    ...item,
                };
            });
        },
        setRecentJobs: (state, { payload }) => {
            state.recentJobs = payload.jobs
        }
    },
});

export const {
    addLatestJob,
    clearJobTypeToggle,
    jobTypeCheck,
    datePostCheck,
    clearDatePostToggle,
    experienceLavelCheck,
    clearExperienceToggle,
    setRecentJobs
} = jobSlice.actions;
export default jobSlice.reducer;
