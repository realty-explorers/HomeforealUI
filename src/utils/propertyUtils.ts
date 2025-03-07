export interface PropertyAttribute {
  id: string;
  name: string;
  description: string;
  defaultWeight: number;
  unit?: string;
}

export interface PropertyWeights {
  [key: string]: number; // Maps attribute.id to weight value (0-100)
}

export const DEFAULT_ATTRIBUTES: PropertyAttribute[] = [
  {
    id: 'beds',
    name: 'Beds',
    description: 'Number of bedrooms in the property',
    defaultWeight: 70
  },
  {
    id: 'baths',
    name: 'Baths',
    description: 'Number of bathrooms in the property',
    defaultWeight: 65
  },
  {
    id: 'area',
    name: 'Square Footage',
    description: 'Total living area of the property',
    defaultWeight: 85,
    unit: 'sq ft'
  },
  {
    id: 'lotArea',
    name: 'Lot Size',
    description: 'Total land area of the property',
    defaultWeight: 50,
    unit: 'sq ft'
  },
  {
    id: 'yearBuilt',
    name: 'Year Built',
    description: 'Year the property was constructed',
    defaultWeight: 40
  },
  {
    id: 'distance',
    name: 'Distance',
    description: 'Distance from the subject property',
    defaultWeight: 75,
    unit: 'miles'
  },
  {
    id: 'listDate',
    name: 'Listing Age',
    description: 'Number of days the property has been on the market',
    defaultWeight: 30,
    unit: 'days'
  }
];
