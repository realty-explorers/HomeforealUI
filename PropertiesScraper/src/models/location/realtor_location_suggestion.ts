interface RealtorLocationSuggestion {
  "area_type": string;
  "neighborhood"?: string;
  "city"?: string;
  "postal_code"?: string;
  "country"?: string;
  "line"?: string;
  "state_code": string;
  "centroid": {
    "lon": number;
    "lat": number;
  };
}
export default RealtorLocationSuggestion;
