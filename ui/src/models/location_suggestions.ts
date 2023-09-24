interface LocationSuggestion {
  display: string;
  type: string;
  addressLine?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}
export default LocationSuggestion;
