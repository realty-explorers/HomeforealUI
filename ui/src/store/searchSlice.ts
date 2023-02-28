import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import Deal from "@/models/deal";
import LocationSuggestion from "@/models/location_suggestions";

// Type for our state
type SearchData = {
    location: LocationSuggestion,
    minPrice: string;
    maxPrice: string;
    minArv: string;
    maxArv: string;
    underComps: number;
    distance: number;
    forSaleAge: string;
    soldAge: string;
}

type SearchResults = Deal[];
export interface SearchState {
    searchData: SearchData;
    searchResults: SearchResults;
}


// Initial state
const initialState: SearchState = {
    searchData: {
        location: {} as LocationSuggestion,
        minPrice: '0',
        maxPrice: '1000000',
        minArv: '0',
        maxArv: '1000000',
        underComps: 50,
        distance: 1,
        forSaleAge: '6m',
        soldAge: '6m'
    },
    searchResults: []

};

// Actual Slice
export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        // Action to set the authentication status
        setSearchLocation(state, action) {
            state.searchData.location = action.payload;
        },
        setSearchMinPrice(state, action) {
            state.searchData.minPrice = action.payload;
        },
        setSearchMaxPrice(state, action) {
            state.searchData.maxPrice = action.payload;
        },
        setSearchMinArv(state, action) {
            state.searchData.minArv = action.payload;
        },
        setSearchMaxArv(state, action) {
            state.searchData.maxArv = action.payload;
        },
        setSearchUnderComps(state, action) {
            state.searchData.underComps = action.payload;
        },
        setSearchDistance(state, action) {
            state.searchData.distance = action.payload;
        },
        setSearchForSaleAge(state, action) {
            state.searchData.forSaleAge = action.payload;
        },
        setSearchSoldAge(state, action) {
            state.searchData.soldAge = action.payload;
        },
        setSearchResults(state, action) {
            state.searchResults = action.payload;
        },

    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.search,
            };
        },
    },
});

export const { setSearchResults, setSearchLocation, setSearchMinPrice, setSearchMaxPrice, setSearchMinArv, setSearchMaxArv, setSearchUnderComps, setSearchDistance, setSearchForSaleAge, setSearchSoldAge } = searchSlice.actions;

export const selectSearchResults: (state: AppState) => SearchResults = (state: AppState) => state.search.searchResults;
export const selectSearchData: (state: AppState) => SearchData = (state: AppState) => state.search.searchData;

export default searchSlice.reducer;