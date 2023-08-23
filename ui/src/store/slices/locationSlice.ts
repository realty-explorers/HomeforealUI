import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import LocationSuggestion from "@/models/location_suggestions";
import LocationData from "@/models/location_data";
import { AppState } from "../store";

// Type for our state
export interface Location {
    suggestion: LocationSuggestion,
    locationData: LocationData,
}

// Initial state
const initialState: Partial<Location> = {
};

// Actual Slice
export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        // Action to set the authentication status
        setSuggestion(state, action: PayloadAction<LocationSuggestion>) {
            state.suggestion = action.payload;
        },
        setLocationData(state, action: PayloadAction<LocationData>) {
            state.locationData = action.payload;
        }
    },

});


export const locationReducer = locationSlice.reducer;
export const { setLocationData, setSuggestion } = locationSlice.actions;
export const selectLocation: (state: AppState) => Partial<Location> = (state: AppState) => state.location;

export default locationSlice;