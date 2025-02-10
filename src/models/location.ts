interface Location {
  address: string;
  neighborhood?: string;
  street?: string;
  zip_code: string;
  state: string;
  city: string;
  county?: {
    name: string;
    fips_code: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export default Location;
