import { LayerProps } from "react-map-gl";

export const compsLayer: LayerProps = {
  id: "comps-point",
  type: "circle",
  source: "comps",
  paint: {
    "circle-color": "#590D82",
    "circle-radius": 10,
    "circle-stroke-width": [
      "case",
      ["to-boolean", ["get", "isARVCalculated"]],
      4,
      1,
    ],

    // "circle-stroke-color": "#fff",
    "circle-stroke-color": [
      "case",
      ["to-boolean", ["get", "isARVCalculated"]],
      "#77d077",
      "#fff",
    ],
    // "circle-blur": 0.2,
  },
};

export const compsIndexLayer: LayerProps = {
  id: "comps-index",
  type: "symbol",
  source: "comps",
  layout: {
    "text-field": "{index}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#fff",
  },
};

export const rentalsLayer: LayerProps = {
  id: "rentals-point",
  type: "circle",
  source: "rentals",
  paint: {
    "circle-color": "#002278",
    "circle-radius": 10,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

export const rentalsIndexLayer: LayerProps = {
  id: "rentals-index",
  type: "symbol",
  source: "rentals",
  layout: {
    "text-field": "{index}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#fff",
  },
};
