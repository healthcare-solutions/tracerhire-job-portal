import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm: '',
    searchAddress: ''
};

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchFields: (state, { payload }) => {
            state.searchTerm = payload.searchTerm
            state.searchAddress = payload.searchAddress
        }
    },
});

export const { setSearchFields } = searchSlice.actions;
export default searchSlice.reducer;
