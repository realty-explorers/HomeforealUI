interface LocationSuggestion {
  display?: string;
  type: string;
  address?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
}
export default LocationSuggestion;
