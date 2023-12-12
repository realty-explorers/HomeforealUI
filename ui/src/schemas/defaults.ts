const defaults = {
  bedrooms: {
    min: 0,
    max: 10,
    default: [0, 10],
    step: 1,
  },
  bathrooms: {
    min: 0,
    max: 10,
    step: 1,
    default: [0, 10],
  },
  area: {
    min: 0,
    max: 50000,
    step: 100,
    default: [0, 50000],
  },
  lotSize: {
    min: 0,
    max: 50000,
    step: 100,
    default: [0, 50000],
  },
  yearBuilt: {
    min: 1900,
    max: 2023,
    step: 1,
    default: [1900, 2023],
  },
  garages: {
    min: 0,
    max: 5,
    step: 1,
    default: [0, 5],
  },
  listingPrice: {
    min: 0,
    max: 10000000,
    step: 1000,
    default: [0, 10000000],
  },
  soldPrice: {
    min: 0,
    max: 10000000,
    step: 1000,
    default: [0, 10000000],
  },
  pricePerSqft: {
    min: 0,
    max: 10000,
    step: 1,
    default: [0, 10000],
  },
  distance: {
    min: 0,
    max: 10,
    step: 0.001,
    default: [0, 10],
  },
  soldMonths: {
    min: 0,
    max: 36,
    step: 1,
    default: 36,
  },

  //Need to fix names, temporary
  full_bathrooms: {
    min: 0,
    max: 10,
    step: 1,
    default: [0, 10],
  },
  year_built: {
    min: 1900,
    max: 2023,
    step: 1,
    default: [1900, 2023],
  },
  building_area: {
    min: 0,
    max: 50000,
    step: 100,
    default: [0, 50000],
  },
  lot_size: {
    min: 0,
    max: 50000,
    step: 100,
    default: [0, 50000],
  },
  sales_closing_price: {
    min: 0,
    max: 10000000,
    step: 1000,
    default: [0, 10000000],
  },

  arv: {
    name: "ARV",
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  margin: {
    name: "Margin",
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  capRate: {
    name: "Cap Rate",
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  grossYield: {
    name: "Gross Yield",
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  propertyTypes: {
    name: "Property Types",
    type: "select",
    options: [
      "Single Family",
    ],
    multiple: true,
  },
  pool: {
    name: "Pool",
    type: "select",
    options: [
      "With",
      "Without",
    ],
    multiple: false,
  },
};

const defaultSimilarityFields = {
  samePropertyType: {
    name: "Same Property Type",
    type: "boolean",
  },
  bedrooms: {
    name: "Bedrooms",
    type: "range",
    min: -3,
    max: 3,
    step: 1,
  },
  bathrooms: {
    name: "Bathrooms",
    type: "range",
    min: -3,
    max: 3,
    step: 1,
  },
  yearBuilt: {
    name: "Year Built",
    type: "range",
    min: -50,
    max: 50,
    step: 1,
  },
  area: {
    name: "Building sqft",
    type: "range",
    min: -100,
    max: 100,
    step: 1,
  },
  lotSize: {
    name: "Lot sqft",
    type: "range",
    min: -100,
    max: 100,
    step: 1,
  },
  samePoolStatus: {
    name: "Same Pool Status",
    type: "boolean",
  },
  garages: {
    name: "Garages",
    type: "range",
    min: -2,
    max: 2,
    step: 1,
  },
  distance: {
    name: "Distance",
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
  },
  saleDate: {
    name: "Sale Date",
    type: "range",
    min: 0,
    max: 12,
    step: 1,
  },
};

export { defaults, defaultSimilarityFields };
