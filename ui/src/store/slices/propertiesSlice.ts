import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import Deal from "@/models/deal";
import LocationSuggestion from "@/models/location_suggestions";
import Location from "@/models/location_data";
import Property, { PropertyType } from "@/models/property";

// Type for our state
export interface PropertiesState {
    selectedDeal?: Deal;
}

// Initial state
const initialState: PropertiesState = {
    selectedDeal: undefined
};

// Actual Slice
export const propertiesSlice = createSlice({
    name: "properties",
    initialState,
    reducers: {
        // Action to set the authentication status
        setSelectedDeal(state, action: PayloadAction<Deal>) {
            state.selectedDeal = action.payload;
        }
    },

});


export const propertiesReducer = propertiesSlice.reducer;
export const { setSelectedDeal } = propertiesSlice.actions;
export const selectProperties: (state: AppState) => PropertiesState = (state: AppState) => state.properties;

export default propertiesSlice;