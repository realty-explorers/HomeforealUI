interface AnalyzedProperty{
    "property": Property;
    "source": string,
    "analyzed_date": Date,
    "oppertunity_type": string,
    "sales_comps": number,
    "comps": CompsProperty[],
    "arv": number,
    "expenses_total": number,
    "margin_percentage": number,
    "operational_expenses_total": number,
    "cap_rate": number
}

interface Property {
  source_id: string;
  primaryImage: string;
  images?: string[];
  property_type: string;
  sales_status: string;
  address_number?: string;
  address_name?: string;
  address_suffix?: string;
  city?: string;
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

interface CompsProperty extends Property{
    distance?: number;
}
