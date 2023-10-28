import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import AnalyzedProperty, {
  CompData,
  FilteredComp,
} from "@/models/analyzedProperty";
import PropertyPreview from "@/models/propertyPreview";

// Type for our state
export interface PropertiesState {
  selectedProperty?: AnalyzedProperty;
  calculatedProperty?: AnalyzedProperty;
  selectedPropertyPreview?: PropertyPreview;
  selectedComps: FilteredComp[];
  selectedRentalComps: CompData[];
}

// Initial state
const initialState: PropertiesState = {
  selectedProperty: undefined,
  calculatedProperty: undefined,
  selectedPropertyPreview: undefined,
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
    setCalculatedProperty(state, action: PayloadAction<AnalyzedProperty>) {
      state.calculatedProperty = action.payload;
    },
    setSelectedPropertyPreview(state, action: PayloadAction<PropertyPreview>) {
      state.selectedPropertyPreview = action.payload;
    },
    setSelectedComps(state, action: PayloadAction<FilteredComp[]>) {
      state.selectedComps = action.payload;
    },

    setSelectedRentalComps(state, action: PayloadAction<CompData[]>) {
      state.selectedRentalComps = action.payload;
    },
  },
});

export const propertiesReducer = propertiesSlice.reducer;
export const {
  setSelectedProperty,
  setCalculatedProperty,
  setSelectedComps,
  setSelectedRentalComps,
  setSelectedPropertyPreview,
} = propertiesSlice.actions;
export const selectProperties: (state: AppState) => PropertiesState = (
  state: AppState,
) => state.properties;

export default propertiesSlice;
