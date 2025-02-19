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
import { targetLocationSchema } from './BuyBoxSchemas';

const propertyCriteriaFormSchema = z
  .object({
    propertyTypes: listSchema,
    beds: rangeSchema,
    baths: rangeSchema,
    area: rangeSchema,
    lotArea: rangeSchema,
    yearBuilt: rangeSchema,
    price: rangeSchema
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.enabled) return;

      if (rangeSchema.safeParse(value).success) {
        const keyName = key.charAt(0).toUpperCase() + key.slice(1);
        transformed[`min${keyName}`] = (value as RangeField).min;
        transformed[`max${keyName}`] = (value as RangeField).max;
      } else if (listSchema.safeParse(value).success) {
        transformed[key] = (value as ListField).items;
      }
    });
    return transformed;
  });

const defaultPropertyCriteriaFormSchema = {
  propertyTypes: { enabled: false, items: ['singleFamily'] },
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
  lotArea: {
    enabled: false,
    min: defaults.lotSize.min,
    max: defaults.lotSize.max
  },
  yearBuilt: {
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
    // propertyTypes: listSchema,
    minArv: minSchema,
    minMargin: minSchema
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
  minArv: { enabled: true, value: defaults.arv.min },
  minMargin: { enabled: false, value: defaults.margin.min }
};

const similarityCriteriaFormSchema = z
  .object({
    enabled: z.boolean(),
    samePropertyType: z.boolean().optional(),
    bedsOffset: rangeSchema,
    bathsOffset: rangeSchema,
    yearBuiltOffset: rangeSchema,
    areaOffset: rangeSchema,
    lotAreaOffset: rangeSchema,
    maxDistance: minSchema,
    maxListingAgeMonths: minSchema,
    weight: z.number()
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (rangeSchema.safeParse(value).success) {
        if (!(value as RangeField).enabled) return;
        const keyName = key.substring(0, key.indexOf('Offset'));
        //INFO: The backend expects positive values, while the front displays and saves them as negative
        transformed[`${keyName}MinOffset`] = -(value as RangeField).min;
        transformed[`${keyName}MaxOffset`] = (value as RangeField).max;
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
  samePropertyType: false,
  bedsOffset: { enabled: false, min: -3, max: 3 },
  bathsOffset: { enabled: false, min: -3, max: 3 },
  yearBuiltOffset: { enabled: false, min: -100, max: 100 },
  areaOffset: { enabled: false, min: -100, max: 100 },
  lotAreaOffset: { enabled: false, min: -100, max: 100 },
  maxDistance: { enabled: false, value: 10 },
  maxListingAgeMonths: { enabled: false, value: 36 },
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
  targetLocations: z.array(targetLocationSchema),
  propertyCriteria: propertyCriteriaFormSchema,
  strategy: strategyFormSchema.default(defaultStrategyFormSchema),
  // similarityCriteria: similarityCriteriaFormSchema
  similarityCriteria: z
    .array(similarityCriteriaFormSchema)
    .transform((criteria) =>
      criteria
        .filter((item) => item.enabled && item.enabled == true)
        .map((item) => {
          const { enabled, ...rest } = item;
          return rest;
        })
    )
  // propertyCriteria: propertyCriteriaFormSchema.default(
  //   defaultPropertyCriteriaFormSchema
  // )
});

const getDefaultBuyBoxFormData = () => {
  return {
    name: '',
    description: '',
    targetLocations: [],
    propertyCriteria: defaultPropertyCriteriaFormSchema,
    strategy: defaultStrategyFormSchema,
    similarityCriteria: [
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
