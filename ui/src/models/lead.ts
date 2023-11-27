type Lead = {
  buybox_id: string;
  source: string;
  source_id: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  neighborhood: string;
  listing_price: number;
  opportunities: any[]; // You can specify a more specific type for opportunities if needed
  analyzed_date: string;
  sales_comps: Record<string, any>; // You can specify a more specific type for sales_comps if needed
  expenses: Record<string, any>; // You can specify a more specific type for expenses if needed
  loan: string;
  rents_comps: Record<string, any>; // You can specify a more specific type for rents_comps if needed
  operational_expenses: Record<string, any>; // You can specify a more specific type for operational_expenses if needed
  sales_comps_price: string;
  arv_price: string;
  arv_ids: string;
  margin: string;
  margin_percentage: string;
  cents_on_dollar: string;
  arv_percentage: string;
  sales_comps_percentage: string;
  rental_comps_price: string;
  cap_rate: string;
  noi: string;
  primary_image: any[]; // You can specify a more specific type for primary_image if needed
  images: any[]; // You can specify a more specific type for images if needed
  sales_status: string;
  sales_listing_price: number;
  sales_closing_price: string;
  sales_days_on_market: number;
  sales_date: string;
  tax: string;
  rents_status: string;
  rents_listing_price: string;
  rents_closing_price: string;
  rents_days_on_market: string;
  rents_date: string;
  latitude: number;
  longitude: number;
  county: string;
  flood_zone: string;
  floors: number;
  pool: boolean;
  garages: number;
  property_type: string;
  building_area: number;
  lot_size: number;
  year_built: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  total_bathrooms: number;
};

export default Lead;
