import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import AnalyzedProperty, {
  CompData,
  FilteredComp,
} from "@/models/analyzedProperty";
import PropertyPreview from "@/models/propertyPreview";
import LocationData from "@/models/location_data";

// Type for our state
export interface MapFlyTarget {
  coordinates: [number, number]; // [longitude, latitude]
  zoom?: number;
  ts: number; // ensures consumers can react even if coordinates repeat
}

export interface PropertiesState {
  selectedProperty?: AnalyzedProperty;
  selectedPropertyLocation?: LocationData;
  saleCalculatedProperty?: AnalyzedProperty;
  rentalCalculatedProperty?: AnalyzedProperty;
  selectedPropertyPreview?: PropertyPreview;
  selectedComps: FilteredComp[];
  selectedRentalComps: FilteredComp[];
  selecting: boolean;
  mapFlyTarget?: MapFlyTarget;
}

// Initial state
const initialState: PropertiesState = {
  selectedProperty: undefined,
  selectedPropertyLocation: undefined,
  saleCalculatedProperty: undefined,
  rentalCalculatedProperty: undefined,
  selectedPropertyPreview: undefined,
  selectedComps: [],
  selectedRentalComps: [],
  selecting: false,
  mapFlyTarget: undefined,
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
    setSelectedPropertyLocation(state, action: PayloadAction<LocationData>) {
      state.selectedPropertyLocation = action.payload;
    },
    setSaleCalculatedProperty(state, action: PayloadAction<AnalyzedProperty>) {
      state.saleCalculatedProperty = action.payload;
    },
    setRentalCalculatedProperty(
      state,
      action: PayloadAction<AnalyzedProperty>,
    ) {
      state.rentalCalculatedProperty = action.payload;
    },
    setSelectedPropertyPreview(state, action: PayloadAction<PropertyPreview>) {
      state.selectedPropertyPreview = action.payload;
    },
    setSelectedComps(state, action: PayloadAction<FilteredComp[]>) {
      state.selectedComps = action.payload;
    },

    setSelectedRentalComps(state, action: PayloadAction<FilteredComp[]>) {
      state.selectedRentalComps = action.payload;
    },
    setSelecting(state, action: PayloadAction<boolean>) {
      state.selecting = action.payload;
    },
    setMapFlyTarget(
      state,
      action: PayloadAction<
        | { coordinates: [number, number]; zoom?: number }
        | undefined
      >,
    ) {
      state.mapFlyTarget = action.payload
        ? { ...action.payload, ts: Date.now() }
        : undefined;
    },
  },
});

export const propertiesReducer = propertiesSlice.reducer;
export const {
  setSelectedProperty,
  setSelectedPropertyLocation,
  setSaleCalculatedProperty,
  setRentalCalculatedProperty,
  setSelectedComps,
  setSelectedRentalComps,
  setSelectedPropertyPreview,
  setSelecting,
  setMapFlyTarget,
} = propertiesSlice.actions;
export const selectProperties: (state: AppState) => PropertiesState = (
  state: AppState,
) => state.properties;

export default propertiesSlice;
