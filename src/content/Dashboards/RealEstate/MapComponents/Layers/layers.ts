import type { LayerProps } from 'react-map-gl';
import type { HeatmapMode } from '@/store/slices/mapSlice';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'properties',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#000',
      100,
      '#000',
      750,
      '#000'
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    'circle-opacity': 0.7
  }
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'properties',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  },
  paint: {
    'text-color': '#fff'
  }
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'properties',
  filter: ['!', ['has', 'point_count']],
  layout: {
    // Two-segment label: leading arrow glyph (empty string for
    // multifamily) at 0.7x scale, then the price/cap-rate text at
    // normal scale. Mapbox `format` lets us mix sizes within one label.
    'text-field': [
      'format',
      ['get', 'arrow'],
      { 'font-scale': 0.7 },
      ['get', 'price'],
      {}
    ] as any,
    'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
    'text-size': 12,
    'text-letter-spacing': -0.02,
    // Shift the whole symbol up so the arrow tail lands on the
    // property's geographic coordinate instead of below it.
    'text-offset': [0, -1.1],
    'text-anchor': 'top',
    'text-padding': 2,
    // [top, right, bottom, left] — vertical padding adds breathing
    // room around the label inside the pill.
    'icon-text-fit-padding': [2, 0, 2, 0],
    'icon-image': 'marker-pill',
    'icon-allow-overlap': true,
    'symbol-sort-key': ['get', 'sortKey'],
    'symbol-z-order': 'source',
    'icon-text-fit': 'width'
  },
  paint: {
    'text-color': '#ffffff'
  }
};

// Per-mode color ramps. Deal-quality uses a teal→gold→orange ramp so it
// doesn't fight the red/green semantics of the marker tier palette.
// Price uses the conventional sequential blue→green→yellow→red.
// Alphas are punched up vs. typical heatmap palettes — buybox-filtered
// sets are sparse, so we need each point to read clearly.
const DEAL_COLOR_RAMP: any = [
  'interpolate',
  ['linear'],
  ['heatmap-density'],
  0,
  'rgba(0,0,0,0)',
  0.1,
  'rgba(20,184,166,0.55)', // teal-500
  0.4,
  'rgba(234,179,8,0.75)', // amber-500
  0.7,
  'rgba(249,115,22,0.85)', // orange-500
  1,
  'rgba(220,38,38,0.95)' // red-600
];

const PRICE_COLOR_RAMP: any = [
  'interpolate',
  ['linear'],
  ['heatmap-density'],
  0,
  'rgba(0,0,0,0)',
  0.1,
  'rgba(59,130,246,0.6)', // blue-500
  0.4,
  'rgba(34,197,94,0.75)', // green-500
  0.7,
  'rgba(234,179,8,0.85)', // yellow-500
  1,
  'rgba(220,38,38,0.95)' // red-600
];

// Weight expressions normalize the input field. Floor is 0.25 so even
// low-margin / low-price properties contribute visible heat — the
// heatmap shows *where* properties are concentrated, not just where the
// top-tier deals are.
const DEAL_WEIGHT: any = [
  'interpolate',
  ['linear'],
  ['get', 'dealValue'],
  0,
  0.25,
  20,
  0.45,
  40,
  0.7,
  60,
  0.9,
  80,
  1
];

const PRICE_WEIGHT: any = [
  'interpolate',
  ['linear'],
  ['get', 'priceValue'],
  50000,
  0.25,
  500000,
  0.55,
  1000000,
  0.8,
  2000000,
  1
];

export const propertyHeatmapLayer = (mode: HeatmapMode): LayerProps => ({
  id: 'property-heatmap',
  type: 'heatmap',
  source: 'properties-heatmap',
  // Crossfades into the markers between z11–z13, fully off by z15 so the
  // parcel view is unobstructed.
  paint: {
    'heatmap-weight': mode === 'price' ? PRICE_WEIGHT : DEAL_WEIGHT,
    'heatmap-color': mode === 'price' ? PRICE_COLOR_RAMP : DEAL_COLOR_RAMP,
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      6,
      20,
      10,
      35,
      14,
      55
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      6,
      1.2,
      10,
      1.5,
      14,
      1
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      6,
      0.95,
      12,
      0.9,
      14,
      0.7,
      16,
      0
    ]
  }
});
