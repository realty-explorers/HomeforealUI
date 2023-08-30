interface Property {
  id: string;
  forSale?: boolean;
  primaryImage: string;
  images?: string[];
  price: number;
  soldPrice?: number;
  address: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: number;
  type: PropertyType;
  beds: number;
  baths: number;
  area: number;
  latitude: number;
  longitude: number;
  listingDate: string;
  soldDate?: string;
}

interface RealProperty {
  source_id: string;
  primaryImage: string;
  images?: string[];
  property_type: string;
  sales_status: string;
  address_number?: string;
  address_name?: string;
  address_suffix?: string;
  unit_number?: string;
  zipcode: string;
  county: string;
  sales_listing_price?: string;
  sales_closing_price?: string;
  sales_date?: string;
  building_area: string;
  lot_size?: string;
  year_built: string;
  bedrooms: string;
  full_bathrooms?: string;
  half_bathrooms?: string;
  floors?: string;
  pool?: boolean;
  garages?: string;
  sales_days_on_market?: string;
  source: string;
  rents_status: string;
  rents_listing_price?: string;
  rents_closing_price?: string;
  rents_days_on_market?: string;
  rents_date?: string;
  state?: string;
  insert_date?: string;
  address: string;
  total_bathrooms?: string;
  latitude?: string;
  longitude?: string;
  flood_zone: string;
  neighborhood?: string;
}

enum PropertyType {
  OTHER = "other",
  CONDO = "condo",
  TOWN_HOUSE = "town_house",
  SINGLE_FAMILY = "single_family",
  MULTI_FAMILY = "multi_family",
  MOBILE_HOUSE = "mobile_house",
}

export default Property;
export { Property, PropertyType, RealProperty };
