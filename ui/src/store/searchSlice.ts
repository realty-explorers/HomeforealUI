import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import Deal from "@/models/deal";
import LocationSuggestion from "@/models/location_suggestions";

// Type for our state
export interface SearchData {
    location: LocationSuggestion,
    minPrice: string;
    maxPrice: string;
    minArv: string;
    maxArv: string;
    underComps: number;
    distance: number;
    forSaleAge: number;
    soldAge: number;
    minArea: number,
    maxArea: number,
    minBeds: number,
    maxBeds: number,
    minBaths: number,
    maxBaths: number
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
        forSaleAge: 180,
        soldAge: 180,
        minArea: 500,
        maxArea: 10000,
        minBeds: 1,
        maxBeds: 9,
        minBaths: 1,
        maxBaths: 9
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
        setSearchSoldAge(state, action) {
            state.searchData.soldAge = action.payload;
        },
        setSearchForSaleAge(state, action) {
            state.searchData.forSaleAge = action.payload;
        },
        setSearchMinArea(state, action) {
            state.searchData.minArea = action.payload;
        },
        setSearchMaxArea(state, action) {
            state.searchData.maxArea = action.payload;
        },
        setSearchMinBeds(state, action) {
            state.searchData.minBeds = action.payload;
        },
        setSearchMaxBeds(state, action) {
            state.searchData.maxBeds = action.payload;
        },
        setSearchMinBaths(state, action) {
            state.searchData.minBaths = action.payload;
        },
        setSearchMaxBaths(state, action) {
            state.searchData.maxBaths = action.payload;
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

export const { setSearchResults, setSearchLocation, setSearchMinPrice, setSearchMaxPrice, setSearchMinArv, setSearchMaxArv, setSearchUnderComps, setSearchDistance, setSearchForSaleAge, setSearchSoldAge, setSearchMinArea, setSearchMaxArea, setSearchMinBeds, setSearchMaxBeds, setSearchMinBaths, setSearchMaxBaths } = searchSlice.actions;

export const selectSearchResults: (state: AppState) => SearchResults = (state: AppState) => state.search.searchResults;
export const selectSearchData: (state: AppState) => SearchData = (state: AppState) => state.search.searchData;

export default searchSlice.reducer;