import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import PropertyPreview from "@/models/propertyPreview";

export type HeatmapMode = "off" | "deal" | "price";

export interface MapState {
  hoveredProperty?: PropertyPreview;
  hoveredMarker?: any;
  mapLoading: boolean;
  showBounds: boolean;
  showMarkers: boolean;
  heatmapMode: HeatmapMode;
}

const initialState: MapState = {
  hoveredProperty: undefined,
  hoveredMarker: undefined,
  mapLoading: true,
  showBounds: true,
  showMarkers: true,
  heatmapMode: "off",
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setHoveredProperty(state, action: PayloadAction<PropertyPreview>) {
      state.hoveredProperty = action.payload;
    },
    setHoveredMarker(state, action: PayloadAction<any>) {
      state.hoveredMarker = action.payload;
    },
    setMapLoading(state, action: PayloadAction<boolean>) {
      state.mapLoading = action.payload;
    },
    setShowBounds(state, action: PayloadAction<boolean>) {
      state.showBounds = action.payload;
    },
    setShowMarkers(state, action: PayloadAction<boolean>) {
      state.showMarkers = action.payload;
    },
    setHeatmapMode(state, action: PayloadAction<HeatmapMode>) {
      state.heatmapMode = action.payload;
    },
  },
});

export const mapReducer = mapSlice.reducer;
export const {
  setHoveredProperty,
  setHoveredMarker,
  setMapLoading,
  setShowBounds,
  setShowMarkers,
  setHeatmapMode,
} = mapSlice.actions;

export const selectMap: (state: AppState) => MapState = (state: AppState) =>
  state.map;
export const selectShowBounds = (state: AppState) => state.map.showBounds;
export const selectShowMarkers = (state: AppState) => state.map.showMarkers;
export const selectHeatmapMode = (state: AppState) => state.map.heatmapMode;

export default mapSlice;
