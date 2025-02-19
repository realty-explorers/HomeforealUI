type Lead = {
  buyboxId: string;
  source: string;
  sourceId: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  neighborhood: string;
  listingPrice: number;
  opportunities: any[]; // You can specify a more specific type for opportunities if needed
  analyzedDate: string;
  salesComps: Record<string, any>; // You can specify a more specific type for salesComps if needed
  expenses: Record<string, any>; // You can specify a more specific type for expenses if needed
  loan: string;
  rentsComps: Record<string, any>; // You can specify a more specific type for rentsComps if needed
  operationalExpenses: Record<string, any>; // You can specify a more specific type for operationalExpenses if needed
  salesCompsPrice: string;
  arvPrice: string;
  arvIds: string;
  margin: string;
  marginPercentage: string;
  centsOnDollar: string;
  arvPercentage: string;
  salesCompsPercentage: string;
  rentalCompsPrice: string;
  capRate: string;
  noi: string;
  image: any[]; // You can specify a more specific type for primaryImage if needed
  images: any[]; // You can specify a more specific type for images if needed
  salesStatus: string;
  salesListingPrice: number;
  salesClosingPrice: string;
  salesDaysOnMarket: number;
  salesDate: string;
  tax: string;
  rentsStatus: string;
  rentsListingPrice: string;
  rentsClosingPrice: string;
  rentsDaysOnMarket: string;
  rentsDate: string;
  latitude: number;
  longitude: number;
  county: string;
  floodZone: string;
  floors: number;
  pool: boolean;
  garages: number;
  propertyType: string;
  buildingArea: number;
  lotSize: number;
  yearBuilt: string;
  bedrooms: number;
  fullBathrooms: number;
  halfBathrooms: number;
  totalBathrooms: number;
  analysisStatus?: string;
};

export default Lead;
