import z from 'zod';
import { defaults, defaultSimilarityFields } from './defaults';

const propertyTypeEnum = z.enum([
  'single_family',
  'multi_family',
  'condo',
  'townhouse',
  'land',
  'commercial',
  'other'
]);

const locationTypeEnum = z.enum([
  'city',
  'neighborhood',
  'zip_code',
  'address',
  'street',
  'state'
]);

const propertyCriteriaSchema = z.object({
  property_types: z.array(propertyTypeEnum).optional(),
  min_beds: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  max_beds: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  min_baths: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  max_baths: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  min_area: z.number().min(defaults.area.min).max(defaults.area.max).optional(),
  max_area: z.number().min(defaults.area.min).max(defaults.area.max).optional(),
  min_lot_area: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  max_lot_area: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  min_year_built: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  max_year_built: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  min_price: z
    .number()
    .min(defaults.listingPrice.min)
    .max(defaults.listingPrice.max)
    .optional(),
  max_price: z
    .number()
    .min(defaults.listingPrice.min)
    .max(defaults.listingPrice.max)
    .optional()
});

const defaultPropertyCriteria = {
  property_types: [],
  min_beds: defaults.bedrooms.min,
  max_beds: defaults.bedrooms.max,
  min_baths: defaults.bathrooms.min,
  max_baths: defaults.bathrooms.max,
  min_area: defaults.area.min,
  max_area: defaults.area.max,
  min_lot_area: defaults.lotSize.min,
  max_lot_area: defaults.lotSize.max,
  min_year_built: defaults.yearBuilt.min,
  max_year_built: defaults.yearBuilt.max,
  min_price: defaults.listingPrice.min,
  max_price: defaults.listingPrice.max
};

const strategySchema = z.object({
  min_arv: z.number().min(defaults.arv.min).max(defaults.arv.max).optional(),
  min_margin: z
    .number()
    .min(defaults.margin.min)
    .max(defaults.margin.max)
    .optional()
});

const defaultStrategy = {
  min_arv: defaults.arv.min,
  min_margin: defaults.margin.min
};

const similarityCriteriaSchema = z.object({
  same_property_type: z.boolean().default(false),
  same_neighborhood: z.boolean().default(false),
  beds_min_offset: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  beds_max_offset: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  baths_min_offset: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  baths_max_offset: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  area_min_offset: z
    .number()
    .min(defaults.area.min)
    .max(defaults.area.max)
    .optional(),
  area_max_offset: z
    .number()
    .min(defaults.area.min)
    .max(defaults.area.max)
    .optional(),
  lot_area_min_offset: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  lot_area_max_offset: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  year_built_min_offset: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  year_built_max_offset: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  max_distance: z
    .number()
    .min(defaults.distance.min)
    .max(defaults.distance.max)
    .optional(),
  max_listing_age_months: z
    .number()
    .min(defaultSimilarityFields.saleDate.min)
    .max(defaultSimilarityFields.saleDate.max)
    .optional(),
  weight: z.number().min(0).max(1).optional()
});

const defaultSimilarityCriteriaFirstRank = {
  same_property_type: false,
  same_neighborhood: false,
  beds_min_offset: defaults.bedrooms.min,
  beds_max_offset: defaults.bedrooms.max,
  baths_min_offset: defaults.bathrooms.min,
  baths_max_offset: defaults.bathrooms.max,
  area_min_offset: defaults.area.min,
  area_max_offset: defaults.area.max,
  lot_area_min_offset: defaults.lotSize.min,
  lot_area_max_offset: defaults.lotSize.max,
  year_built_min_offset: defaults.yearBuilt.min,
  year_built_max_offset: defaults.yearBuilt.max,
  max_distance: defaultSimilarityFields.distance.max,
  max_listing_age_months: defaultSimilarityFields.saleDate.max,
  weight: 1
};

const defaultSimilarityCriteriaSecondRank = {
  ...defaultSimilarityCriteriaFirstRank,
  weight: 0.8
};

const defaultSimilarityCriteriaThirdRank = {
  ...defaultSimilarityCriteriaFirstRank,
  weight: 0.6
};

const defaultSimilarityCriteriaFourthRank = {
  ...defaultSimilarityCriteriaFirstRank,
  weight: 0.3
};

const targetLocationSchema = z.object({
  display: z.string(),
  type: locationTypeEnum,
  address: z.string().optional(),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

const buyboxSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .default(''),
  description: z.string().optional(),
  target_locations: z.array(targetLocationSchema).length(1).default([]),
  property_criteria: propertyCriteriaSchema.default(defaultPropertyCriteria),
  strategy: strategySchema.default(defaultStrategy),
  similarity_criteria: z
    .array(similarityCriteriaSchema)
    .default([
      defaultSimilarityCriteriaFirstRank,
      defaultSimilarityCriteriaSecondRank,
      defaultSimilarityCriteriaThirdRank,
      defaultSimilarityCriteriaFourthRank
    ])
});

const getDefaultBuyBoxData = () => {
  const defaultData: BuyboxSchemaData = {
    name: '',
    description: '',
    target_locations: [],
    property_criteria: defaultPropertyCriteria,
    strategy: defaultStrategy,
    similarity_criteria: []
  };
  return defaultData;
};

type BuyboxSchemaData = z.infer<typeof buyboxSchema>;

export { buyboxSchema, getDefaultBuyBoxData };
export type { BuyboxSchemaData };
