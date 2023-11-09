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
    // "text-font": ["Poppins Regular"],
    "text-font": ["Arial Unicode MS Regular"],
    "text-size": 12,
    "text-offset": [0, -0.5],
    "text-anchor": "top",
    "text-padding": 2,
    "icon-text-fit-padding": [3, 6, 3, 6],
    "icon-image": "custom-marker",
    "icon-allow-overlap": true,
    "symbol-sort-key": ["get", "sortKey"],
    "symbol-z-order": "source",
    // "text-allow-overlap": true,
    // "icon-size": 0.3i,
    "icon-text-fit": "both",
  },
  paint: {
    // "icon-color": "#590D82",
    // "icon-opacity": 0.8,
    "icon-halo-color": "black",
    "icon-halo-width": 3,
    "icon-halo-blur": 1,
    "text-color": "white",
    // "text-color": "green",
    // "text-opacity": 0.9,
    "text-halo-color": "white",
    "text-halo-width": 0.5,
    // "text-halo-color": "#590D82",
    // "text-halo-width": 2,
  },
};
