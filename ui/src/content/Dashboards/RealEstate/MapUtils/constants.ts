const US_BOUNDS = [
  [-125.000000, 24.396308], // Southwest coordinates
  [-66.934570, 49.3457868], // Northeast coordinates
];

const INITIAL_VIEW_STATE = {
  latitude: 40.67,
  longitude: -103.59,
  zoom: 5,
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
const MAPBOX_STYLE = "mapbox://styles/sharonfabin/clo5pj7y400pv01qvgnsdejw9";
export { INITIAL_VIEW_STATE, MAPBOX_STYLE, MAPBOX_TOKEN, US_BOUNDS };
