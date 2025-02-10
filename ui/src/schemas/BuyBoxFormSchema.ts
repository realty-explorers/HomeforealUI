import z from 'zod';
import { defaults, defaultSimilarityFields } from './defaults';
import {
  ListField,
  listSchema,
  RangeField,
  rangeSchema,
  MinField,
  minSchema
} from './FormSchemas';

const propertyCriteriaFormSchema = z
  .object({
    property_types: listSchema,
    beds: rangeSchema,
    baths: rangeSchema,
    area: rangeSchema,
    lot_area: rangeSchema,
    year_built: rangeSchema,
    price: rangeSchema
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.enabled) return;

      if (rangeSchema.safeParse(value).success) {
        transformed[`min_${key}`] = (value as RangeField).min;
        transformed[`max_${key}`] = (value as RangeField).max;
      } else if (listSchema.safeParse(value).success) {
        transformed[key] = (value as ListField).items;
      }
    });
    return transformed;
  });

const defaultPropertyCriteriaFormSchema = {
  property_types: { enabled: false, items: ['single_family'] },
  beds: {
    enabled: false,
    min: defaults.bedrooms.min,
    max: defaults.bedrooms.max
  },
  baths: {
    enabled: false,
    min: defaults.bathrooms.min,
    max: defaults.bathrooms.max
  },
  area: { enabled: false, min: defaults.area.min, max: defaults.area.max },
  lot_area: {
    enabled: false,
    min: defaults.lotSize.min,
    max: defaults.lotSize.max
  },
  year_built: {
    enabled: false,
    min: defaults.yearBuilt.min,
    max: defaults.yearBuilt.max
  },
  price: {
    enabled: false,
    min: defaults.listingPrice.min,
    max: defaults.listingPrice.max
  }
};

const strategyFormSchema = z
  .object({
    // property_types: listSchema,
    min_arv: minSchema,
    min_margin: minSchema
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.enabled) return;

      if (minSchema.safeParse(value).success) {
        transformed[key] = (value as MinField).value;
      }
    });
    return transformed;
  });

const defaultStrategyFormSchema = {
  min_arv: { enabled: true, value: defaults.arv.min },
  min_margin: { enabled: false, value: defaults.margin.min }
};

const similarityCriteriaFormSchema = z
  .object({
    enabled: z.boolean(),
    same_property_type: z.boolean().optional(),
    beds_offset: rangeSchema,
    baths_offset: rangeSchema,
    year_built_offset: rangeSchema,
    area_offset: rangeSchema,
    lot_area_offset: rangeSchema,
    max_distance: minSchema,
    max_listing_age_months: minSchema,
    weight: z.number()
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (rangeSchema.safeParse(value).success) {
        if (!(value as RangeField).enabled) return;
        const keyName = key.split('_')[0];
        //INFO: The backend expects positive values, while the front displays and saves them as negative
        transformed[`${keyName}_min_offset`] = -(value as RangeField).min;
        transformed[`${keyName}_max_offset`] = (value as RangeField).max;
      } else if (minSchema.safeParse(value).success) {
        if (!(value as MinField).enabled) return;
        transformed[key] = (value as MinField).value;
      } else {
        transformed[key] = value;
      }
    });
    return transformed;
  });

const defaultSimilarityCriteriaFormSchemaFirstRank = {
  enabled: true,
  same_property_type: false,
  beds_offset: { enabled: false, min: -3, max: 3 },
  baths_offset: { enabled: false, min: -3, max: 3 },
  year_built_offset: { enabled: false, min: -100, max: 100 },
  area_offset: { enabled: false, min: -100, max: 100 },
  lot_area_offset: { enabled: false, min: -100, max: 100 },
  max_distance: { enabled: false, value: 10 },
  max_listing_age_months: { enabled: false, value: 36 },
  weight: 1
};

const defaultSimilarityCriteriaFormSchemaSecondRank = {
  ...defaultSimilarityCriteriaFormSchemaFirstRank,
  weight: 0.8
};

const defaultSimilarityCriteriaFormSchemaThirdRank = {
  ...defaultSimilarityCriteriaFormSchemaFirstRank,
  weight: 0.6
};

const defaultSimilarityCriteriaFormSchemaFourthRank = {
  ...defaultSimilarityCriteriaFormSchemaFirstRank,
  weight: 0.3
};

const formBuyBoxSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .default(''),
  description: z.string().optional(),
  target_locations: z.array(z.object({})).optional(),
  property_criteria: propertyCriteriaFormSchema,
  strategy: strategyFormSchema.default(defaultStrategyFormSchema),
  // similarity_criteria: similarityCriteriaFormSchema
  similarity_criteria: z
    .array(similarityCriteriaFormSchema)
    .transform((criteria) =>
      criteria
        .filter((item) => item.enabled)
        .map((item) => {
          const { enabled, ...rest } = item;
          return rest;
        })
    )
  // property_criteria: propertyCriteriaFormSchema.default(
  //   defaultPropertyCriteriaFormSchema
  // )
});

const getDefaultBuyBoxFormData = () => {
  return {
    name: '',
    description: '',
    target_locations: [],
    property_criteria: defaultPropertyCriteriaFormSchema,
    strategy: defaultStrategyFormSchema,
    similarity_criteria: [
      defaultSimilarityCriteriaFormSchemaFirstRank,
      defaultSimilarityCriteriaFormSchemaSecondRank,
      defaultSimilarityCriteriaFormSchemaThirdRank,
      defaultSimilarityCriteriaFormSchemaFourthRank
    ]
  };
};

export type BuyBoxFormData = z.infer<typeof formBuyBoxSchema>;
export { formBuyBoxSchema, getDefaultBuyBoxFormData };
export { defaultSimilarityCriteriaFormSchemaFirstRank };
