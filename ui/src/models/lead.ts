type Lead = {
  address: string;
  arv: number;
  arv_ids: string[];
  buybox_id: string;
  cap_rate: number;
  cents_on_dollar: number;
  city: string;
  expenses_total: number;
  images: any[]; // You can specify a more specific type for images if needed
  is_opp: boolean;
  listing_price: number;
  listing_status: string;
  ltv: number;
  margin: number;
  margin_percentage: number;
  market_id: string;
  n_rents: number;
  n_sales: number;
  neighborhood: string;
  operational_expenses_total: number;
  opp_name: string;
  sales_comps: number;
  source: string;
  state: string;
  update_date: string;
  zipcode: string;
};
