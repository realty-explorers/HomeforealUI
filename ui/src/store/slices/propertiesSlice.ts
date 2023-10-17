import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import AnalyzedProperty, { CompData } from "@/models/analyzedProperty";

// Type for our state
export interface PropertiesState {
  selectedProperty?: AnalyzedProperty;
  selectedComps: CompData[];
  selectedRentalComps: CompData[];
}

// Initial state
const initialState: PropertiesState = {
  selectedProperty: undefined,
  selectedComps: [],
  selectedRentalComps: [],
};

// Actual Slice
export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    // Action to set the authentication status
    setSelectedProperty(state, action: PayloadAction<AnalyzedProperty>) {
      state.selectedProperty = action.payload;
    },
    setSelectedComps(state, action: PayloadAction<CompData[]>) {
      state.selectedComps = action.payload;
    },

    setSelectedRentalComps(state, action: PayloadAction<CompData[]>) {
      state.selectedRentalComps = action.payload;
    },
  },
});

export const propertiesReducer = propertiesSlice.reducer;
export const { setSelectedProperty, setSelectedComps, setSelectedRentalComps } =
  propertiesSlice.actions;
export const selectProperties: (state: AppState) => PropertiesState = (
  state: AppState,
) => state.properties;

export default propertiesSlice;
