import type { LayerProps } from "react-map-gl";

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "properties",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#000",
      100,
      "#000",
      750,
      "#000",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    "circle-opacity": 0.7,
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "properties",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#fff",
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "symbol",
  source: "properties",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-field": ["get", "price"],
    "text-font": ["Poppins Regular"],
    "text-size": 12,
    "text-offset": [0, 0.6],
    "text-anchor": "top",
    "text-padding": 8,
  },
  paint: {
    "text-color": "white",
    "text-halo-color": "#590D82",
    "text-halo-width": 2,
  },
};

export const compsLayer: LayerProps = {
  id: "comps-point",
  type: "circle",
  source: "comps",
  paint: {
    "circle-color": "#590D82",
    "circle-radius": 10,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
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

export const boundsLayer: LayerProps = {
  id: "bounds-area",
  type: "fill",
  source: "bounds",
  layout: {
    "fill-sort-key": -1,
  },
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.15,
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
