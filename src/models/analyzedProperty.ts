import Location from './location';

interface Property {
  id: string;
  location: Location;
  listDate: string;
  price: number;
  photos: {
    primary: string;
    all: string[];
  };
  status: string;
  type: string;
  area: number;
  lotArea: number;
  yearBuilt: string;
  beds: number;
  baths: number;
  floors: number;
  garages: number;
  flags: {
    isComingSoon?: {
      date: string;
    };
    isPending: boolean;
    isForeclosure: boolean;
    isContingent: boolean;
    isPriceReduced?: {
      amount: number;
    };
  };
}

interface CompData extends Property {
  distance: number;
  similarityColor: string;
  similarityScore: number;
  isArv25: boolean;
}

interface FilteredComp extends CompData {
  index: number;
}

interface ExpensesData {
  expenseType: string;
  expenseRef: string;
  expensePercentage: string | number;
  expenseAmount: number;
}

interface LoanData {
  amount: ExpensesData;
  downPayment: ExpensesData;
  closingCost: ExpensesData;
  interestRate: number;
  duration: number;
  totalPayment: number;
}

interface AnalyzedProperty extends Partial<Property> {
  propertyId: string;
  buyboxId: string;
  analyzedDate: string;
  comps?: CompData[];
  expenses: {
    fixedFee: ExpensesData;
    closingFee: ExpensesData;
    sellingFee: ExpensesData;
    rehab: ExpensesData;
  };
  loan: LoanData;
  arvPrice: number;
  arv25Price: number;
  arvIds: string[];
  margin: number;
  marginPercentage: number;
  arv25Percentage: number;
  arvPercentage: number;
  rentalCompsPrice: number;
  capRate: number | 'N/A';
  noi: string | 'N/A';
  opportunities: string[]; // You may specify a more specific type for 'opportunities'.
  operationalExpenses: {
    propertyTax: ExpensesData;
    insurance: ExpensesData;
    maintenance: ExpensesData;
    management: ExpensesData;
    vacancy: ExpensesData;
  };
  priceGroup?: {
    min: number;
    max: number;
  };
}

export default AnalyzedProperty;
export type { CompData, ExpensesData, FilteredComp, LoanData };
