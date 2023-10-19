import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import AnalyzedProperty, { CompData } from "@/models/analyzedProperty";
import PropertyPreview from "@/models/propertyPreview";

// Type for our state
export interface MapState {
  hoveredProperty?: PropertyPreview;
  hoveredMarker?: any;
}

// Initial state
const initialState: MapState = {
  hoveredProperty: undefined,
  hoveredMarker: undefined,
};

// Actual Slice
export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    // Action to set the authentication status
    setHoveredProperty(state, action: PayloadAction<PropertyPreview>) {
      state.hoveredProperty = action.payload;
    },

    setHoveredMarker(state, action: PayloadAction<any>) {
      state.hoveredMarker = action.payload;
    },
  },
});

export const mapReducer = mapSlice.reducer;
export const {
  setHoveredProperty,
  setHoveredMarker,
} = mapSlice.actions;
export const selectMap: (state: AppState) => MapState = (
  state: AppState,
) => state.map;

export default mapSlice;
