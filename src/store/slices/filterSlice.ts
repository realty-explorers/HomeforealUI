import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import Property, { PropertyType } from '@/models/property';
import PropertyPreview from '@/models/propertyPreview';
import BuyBox from '@/models/buybox';

// Type for our state
export interface Filter {
  minPrice: number;
  maxPrice: number;
  arvMargin: number;
  arv25Margin: number;
  minBaths: number;
  maxBaths: number;
  minBeds: number;
  maxBeds: number;
  minArea: number;
  maxArea: number;
  propertyTypes: PropertyType[];
  filteredProperties: PropertyPreview[];
  strategyMode: string;
  buybox: BuyBox;
}

// Initial state
const initialState: Filter = {
  minPrice: 0,
  maxPrice: 1000000,
  arvMargin: 50,
  arv25Margin: 10,
  minBaths: 0,
  maxBaths: 10,
  minBeds: 0,
  maxBeds: 10,
  minArea: 0,
  maxArea: 10000,
  propertyTypes: [
    PropertyType.SINGLE_FAMILY,
    PropertyType.CONDO,
    PropertyType.MULTI_FAMILY
  ],
  filteredProperties: [],
  strategyMode: 'ARV',
  buybox: undefined
};

// Actual Slice
export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Action to set the authentication status
    setMinPrice(state, action: PayloadAction<number>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<number>) {
      state.maxPrice = action.payload;
    },
    setArvMargin(state, action: PayloadAction<number>) {
      state.arvMargin = action.payload;
    },
    setArv25Margin(state, action: PayloadAction<number>) {
      state.arv25Margin = action.payload;
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
    setMinArea(state, action: PayloadAction<number>) {
      state.minArea = action.payload;
    },
    setMaxArea(state, action: PayloadAction<number>) {
      state.maxArea = action.payload;
    },
    setPropertyTypes(state, action: PayloadAction<PropertyType[]>) {
      state.propertyTypes = action.payload;
    },
    setFilteredProperties(state, action: PayloadAction<PropertyPreview[]>) {
      state.filteredProperties = action.payload;
    },
    setStrategyMode(state, action: PayloadAction<string>) {
      state.strategyMode = action.payload;
    },
    setBuybox(state, action: PayloadAction<BuyBox>) {
      state.buybox = action.payload;
    }
  }
});

export const filterReducer = filterSlice.reducer;
export const {
  setMinPrice,
  setMaxPrice,
  setArvMargin,
  setArv25Margin,
  setMinBaths,
  setMaxBaths,
  setMinBeds,
  setMaxBeds,
  setMinArea,
  setMaxArea,
  setPropertyTypes,
  setFilteredProperties,
  setStrategyMode,
  setBuybox
} = filterSlice.actions;
export const selectFilter: (state: AppState) => Filter = (state: AppState) =>
  state.filter;

export default filterSlice;
