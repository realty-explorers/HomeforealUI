import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import Deal from "@/models/deal";
import LocationSuggestion from "@/models/location_suggestions";
import Location from "@/models/location_data";
import Property, { PropertyType } from "@/models/property";

// Type for our state
export interface Filter {
    minListingPrice: number;
    maxListingPrice: number;
    compsMargin: number;
    arvMargin: number;
    minBaths: number;
    maxBaths: number;
    minBeds: number;
    maxBeds: number;
}

// Initial state
const initialState: Filter = {
    minListingPrice: 0,
    maxListingPrice: 1000000,
    compsMargin: 50,
    arvMargin: 10,
    minBaths: 0,
    maxBaths: 10,
    minBeds: 0,
    maxBeds: 10,
};

// Actual Slice
export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        // Action to set the authentication status
        setMinListingPrice(state, action: PayloadAction<number>) {
            state.minListingPrice = action.payload;
        },
        setMaxListingPrice(state, action: PayloadAction<number>) {
            state.maxListingPrice = action.payload;
        },
        setCompsMargin(state, action: PayloadAction<number>) {
            state.compsMargin = action.payload;
        },
        setArvMargin(state, action: PayloadAction<number>) {
            state.arvMargin = action.payload;
        },
        setMinBaths(state, action: PayloadAction<number>) {
            state.minBaths = action.payload;
        },
        setMaxBaths(state, action: PayloadAction<number>) {
            state.maxBaths = action.payload;
        },
        setMinBeds(state, action: PayloadAction<number>) {
            state.minBeds = action.payload;
        },
        setMaxBeds(state, action: PayloadAction<number>) {
            state.maxBeds = action.payload;
        },
    },

});


export const filterReducer = filterSlice.reducer;
export const { setMinListingPrice, setMaxListingPrice, setCompsMargin, setArvMargin, setMinBaths, setMaxBaths, setMinBeds, setMaxBeds } = filterSlice.actions;
export const selectFilter: (state: AppState) => Filter = (state: AppState) => state.filter;

export default filterSlice;