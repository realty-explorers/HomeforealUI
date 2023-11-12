interface RegionFilter {
  type: string;
  state: string;
  city?: string;
  zipcode?: string;
  neighborhood?: string;
  propertyStatuses: PropertyStatus[];
  minDate?: string;
  maxDate?: string;
}

enum PropertyStatus {
  SOLD = "sold",
  FOR_SALE = "for_sale",
  FOR_RENT = "for_rent",
  OFF_MARKET = "off_market",
}

export default RegionFilter;
export { PropertyStatus };
