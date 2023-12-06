interface CompData {
  source: string;
  source_id: string;
  distance: number;
  similarity_color: string;
  similarity_score: number;
  primary_image?: string;
  images: string[];
  sales_status: string;
  sales_listing_price: number | string;
  sales_closing_price: number | string;
  sales_days_on_market: number | string;
  sales_date: string | "N/A";
  tax: string | "N/A";
  rents_status: string;
  rents_listing_price: number | string;
  rents_closing_price: number | string;
  rents_days_on_market: number | string;
  rents_date: string | "N/A";
  floors: number;
  pool: boolean;
  garages: number;
  latitude: number;
  longitude: number;
  address: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  county: string;
  state: string;
  flood_zone: string;
  property_type: string;
  building_area: number;
  lot_size: number;
  year_built: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  total_bathrooms: number;
  is_arv_25th: boolean;
  list_date: Date;
}

interface FilteredComp extends CompData {
  index: number;
}

interface ExpensesData {
  expense_type: string;
  expense_ref: string;
  expense_percentage: string | number;
  expense_amount: number;
}

interface LoanData {
  amount: ExpensesData;
  down_payment: ExpensesData;
  closing_cost: ExpensesData;
  interest_rate: number;
  duration: number;
  total_payment: number;
}

interface AnalyzedProperty {
  buybox_id: string;
  source: string;
  source_id: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  neighborhood: string;
  listing_price: number;
  analyzed_date: string;
  sales_comps: { data: CompData[] };
  rents_comps: { data: CompData[] };
  expenses: {
    fixed_fee: ExpensesData;
    closing_fee: ExpensesData;
    selling_fee: ExpensesData;
    rehab: ExpensesData;
  };
  loan: LoanData;
  sales_comps_price: number;
  arv_price: number;
  arv_ids: string[];
  margin: number;
  margin_percentage: number;
  cents_on_dollar: number;
  arv_percentage: number;
  sales_comps_percentage: number;
  rental_comps_price: number;
  cap_rate: number | "N/A";
  noi: string | "N/A";
  opportunities: any[]; // You may specify a more specific type for 'opportunities'.
  primary_image: any;
  images: string[];
  sales_status: string;
  sales_closing_price: string | "N/A";
  sales_days_on_market: number;
  sales_date: string | "N/A";
  tax: string | "N/A";
  rents_status: string;
  rents_listing_price: number | "N/A";
  rents_closing_price: number | "N/A";
  rents_days_on_market: string | "N/A";
  rents_date: string | "N/A";
  floors: number;
  pool: boolean;
  garages: number;
  latitude: number;
  longitude: number;
  county: string;
  flood_zone: string;
  property_type: string;
  building_area: number;
  lot_size: number;
  year_built: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  total_bathrooms: number;
  operational_expenses: {
    property_tax: ExpensesData;
    insurance: ExpensesData;
    maintenance: ExpensesData;
    management: ExpensesData;
    vacancy: ExpensesData;
  };
  list_date: string;
}

export default AnalyzedProperty;
export type { CompData, ExpensesData, FilteredComp, LoanData };
