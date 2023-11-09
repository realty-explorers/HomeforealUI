import { LayerProps } from "react-map-gl";

export const boundsLayer: LayerProps = {
  id: "bounds-area",
  type: "fill",
  source: "bounds",
  layout: {
    "fill-sort-key": -2,
  },
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.1,
  },
};

export const boundsLineLayer: LayerProps = {
  id: "bounds-line",
  type: "line",
  source: "bounds",
  paint: {
    "line-color": "#000",
    "line-width": 1,
  },
};

export const propertyBoundsLayer: LayerProps = {
  id: "property-bounds-area",
  type: "fill",
  source: "property-bounds",
  layout: {
    "fill-sort-key": -1,
  },
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.25,
    "fill-opacity-transition": { duration: 1000 },
  },
};

export const propertyBoundsLineLayer: LayerProps = {
  id: "property-bounds-line",
  type: "line",
  source: "property-bounds",
  layout: {
    "line-cap": "round",
  },
  paint: {
    "line-color": "#000",
    // "line-color": "#fff",
    // "line-width": 1,
    "line-dasharray": [3, 3],
    "line-width": 1,
    // "line-dasharray": [0, 4, 3],
    "line-blur": 0,
    "line-blur-transition": { duration: 1000 },
  },
};
