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
    max: 10000,
    step: 1,
    default: [0, 10000],
  },
  lotSize: {
    min: 0,
    max: 10000,
    step: 1,
    default: [0, 10000],
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
  arv: {
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
    max: 100,
    step: 0.5,
    default: [0, 100],
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
    max: 10000,
    step: 1,
    default: [0, 10000],
  },
  lot_size: {
    min: 0,
    max: 10000,
    step: 1,
    default: [0, 10000],
  },
  sales_closing_price: {
    min: 0,
    max: 10000000,
    step: 1000,
    default: [0, 10000000],
  },
};

export default defaults;
