import Location from './location';

interface Property {
  id: string;
  location: Location;
  list_date: string;
  price: number;
  photos: {
    primary: string;
    all: string[];
  };
  status: string;
  type: string;
  area: number;
  lot_area: number;
  year_built: string;
  beds: number;
  baths: number;
  floors: number;
  garages: number;
  flags: {
    is_coming_soon?: {
      date: string;
    };
    is_pending: boolean;
    is_foreclosure: boolean;
    is_contingent: boolean;
    is_price_reduced?: {
      amount: number;
    };
  };
}

interface CompData extends Property {
  distance: number;
  similarity_color: string;
  similarity_score: number;
  is_arv_25th: boolean;
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

interface AnalyzedProperty extends Property {
  buybox_id: string;
  analyzed_date: string;
  comps: CompData[];
  expenses: {
    fixed_fee: ExpensesData;
    closing_fee: ExpensesData;
    selling_fee: ExpensesData;
    rehab: ExpensesData;
  };
  loan: LoanData;
  arv_price: number;
  arv25_price: number;
  arv_ids: string[];
  margin: number;
  margin_percentage: number;
  arv25_percentage: number;
  arv_percentage: number;
  rental_comps_price: number;
  cap_rate: number | 'N/A';
  noi: string | 'N/A';
  opportunities: string[]; // You may specify a more specific type for 'opportunities'.
  operational_expenses: {
    property_tax: ExpensesData;
    insurance: ExpensesData;
    maintenance: ExpensesData;
    management: ExpensesData;
    vacancy: ExpensesData;
  };
}

export default AnalyzedProperty;
export type { CompData, ExpensesData, FilteredComp, LoanData };
