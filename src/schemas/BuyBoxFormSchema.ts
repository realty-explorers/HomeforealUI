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
import {
  buyBoxStrategyTypeEnum,
  targetLocationSchema,
  weightSchema
} from './BuyBoxSchemas';
import { DEFAULT_ATTRIBUTES, PropertyWeights } from '@/utils/propertyUtils';

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
      if (rangeSchema.safeParse(value).success) {
        const keyName = key.charAt(0).toUpperCase() + key.slice(1);
        if (!value.enabled) {
          transformed[`min${keyName}`] = undefined;
          transformed[`max${keyName}`] = undefined;
        } else {
          transformed[`min${keyName}`] = (value as RangeField).min;
          transformed[`max${keyName}`] = (value as RangeField).max;
        }
      } else if (listSchema.safeParse(value).success) {
        transformed[key] = (value as ListField).items;
      }
    });
    return transformed;
  });

const defaultPropertyCriteriaFormSchema = {
  propertyTypes: { enabled: false, items: ['single_family'] },
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
    strategyType: buyBoxStrategyTypeEnum,
    minArv: minSchema,
    minMargin: minSchema
  })
  .transform((formData) => {
    const transformed: Record<string, any> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (minSchema.safeParse(value).success) {
        const minValue = value as MinField;
        if (!minValue.enabled) {
          transformed[key] = undefined;
        } else {
          transformed[key] = minValue.value;
        }
      } else {
        transformed[key] = value;
      }
    });
    return transformed;
  });

const defaultStrategyFormSchema = {
  strategyType: 'FIX_AND_FLIP' as const,
  minArv: { enabled: true, value: defaults.arv.min },
  minMargin: { enabled: false, value: defaults.margin.min }
};

const optionalMultifamilyNumberFormSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'number' && Number.isNaN(value)) {
      return undefined;
    }
    return value;
  },
  z.number().optional()
);

const multifamilyUnitMixFormSchema = z.object({
  unitType: z.string().optional(),
  units: optionalMultifamilyNumberFormSchema,
  avgRent: optionalMultifamilyNumberFormSchema,
  avgSqft: optionalMultifamilyNumberFormSchema
});

const multifamilyCriteriaFormSchema = z.object({
  unitMix: z.array(multifamilyUnitMixFormSchema).default([]),
  rentRoll: z
    .object({
      physicalOccupancyPct: optionalMultifamilyNumberFormSchema,
      economicOccupancyPct: optionalMultifamilyNumberFormSchema,
      concessionsPct: optionalMultifamilyNumberFormSchema,
      otherIncomeMonthly: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  income: z
    .object({
      grossScheduledRentAnnual: optionalMultifamilyNumberFormSchema,
      vacancyLossPct: optionalMultifamilyNumberFormSchema,
      badDebtPct: optionalMultifamilyNumberFormSchema,
      otherIncomeAnnual: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  expenses: z
    .object({
      propertyTaxesAnnual: optionalMultifamilyNumberFormSchema,
      insuranceAnnual: optionalMultifamilyNumberFormSchema,
      repairsMaintenanceAnnual: optionalMultifamilyNumberFormSchema,
      payrollAnnual: optionalMultifamilyNumberFormSchema,
      managementFeePct: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  utilities: z
    .object({
      waterSewerAnnual: optionalMultifamilyNumberFormSchema,
      trashAnnual: optionalMultifamilyNumberFormSchema,
      electricAnnual: optionalMultifamilyNumberFormSchema,
      gasAnnual: optionalMultifamilyNumberFormSchema,
      reimbursementPct: optionalMultifamilyNumberFormSchema
    })
    .default({})
});

const multifamilySetupFormSchema = z.object({
  capitalStack: z
    .object({
      purchasePrice: optionalMultifamilyNumberFormSchema,
      closingCostsPct: optionalMultifamilyNumberFormSchema,
      equityPct: optionalMultifamilyNumberFormSchema,
      preferredReturnPct: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  loanAssumptions: z
    .object({
      interestRatePct: optionalMultifamilyNumberFormSchema,
      ltvPct: optionalMultifamilyNumberFormSchema,
      amortizationYears: optionalMultifamilyNumberFormSchema,
      loanTermYears: optionalMultifamilyNumberFormSchema,
      interestOnlyMonths: optionalMultifamilyNumberFormSchema,
      minimumDscr: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  renovationCapex: z
    .object({
      interiorBudget: optionalMultifamilyNumberFormSchema,
      exteriorBudget: optionalMultifamilyNumberFormSchema,
      commonAreaBudget: optionalMultifamilyNumberFormSchema,
      contingencyPct: optionalMultifamilyNumberFormSchema,
      capexReservePerUnit: optionalMultifamilyNumberFormSchema,
      timelineMonths: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  exitScenario: z
    .object({
      holdPeriodYears: optionalMultifamilyNumberFormSchema,
      exitCapRatePct: optionalMultifamilyNumberFormSchema,
      annualRentGrowthPct: optionalMultifamilyNumberFormSchema,
      annualExpenseGrowthPct: optionalMultifamilyNumberFormSchema,
      sellingCostsPct: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  riskAndNotes: z
    .object({
      stressVacancyPct: optionalMultifamilyNumberFormSchema,
      stressExitCapRatePct: optionalMultifamilyNumberFormSchema,
      stressInterestRatePct: optionalMultifamilyNumberFormSchema,
      downsideNoiChangePct: optionalMultifamilyNumberFormSchema,
      notes: z.string().default('')
    })
    .default({})
});

const defaultMultifamilyCriteriaFormSchema = {
  unitMix: [],
  rentRoll: {
    physicalOccupancyPct: undefined,
    economicOccupancyPct: undefined,
    concessionsPct: undefined,
    otherIncomeMonthly: undefined
  },
  income: {
    grossScheduledRentAnnual: undefined,
    vacancyLossPct: undefined,
    badDebtPct: undefined,
    otherIncomeAnnual: undefined
  },
  expenses: {
    propertyTaxesAnnual: undefined,
    insuranceAnnual: undefined,
    repairsMaintenanceAnnual: undefined,
    payrollAnnual: undefined,
    managementFeePct: undefined
  },
  utilities: {
    waterSewerAnnual: undefined,
    trashAnnual: undefined,
    electricAnnual: undefined,
    gasAnnual: undefined,
    reimbursementPct: undefined
  }
};

const defaultMultifamilySetupFormSchema = {
  capitalStack: {
    purchasePrice: undefined,
    closingCostsPct: undefined,
    equityPct: undefined,
    preferredReturnPct: undefined
  },
  loanAssumptions: {
    interestRatePct: undefined,
    ltvPct: undefined,
    amortizationYears: undefined,
    loanTermYears: undefined,
    interestOnlyMonths: undefined,
    minimumDscr: undefined
  },
  renovationCapex: {
    interiorBudget: undefined,
    exteriorBudget: undefined,
    commonAreaBudget: undefined,
    contingencyPct: undefined,
    capexReservePerUnit: undefined,
    timelineMonths: undefined
  },
  exitScenario: {
    holdPeriodYears: undefined,
    exitCapRatePct: undefined,
    annualRentGrowthPct: undefined,
    annualExpenseGrowthPct: undefined,
    sellingCostsPct: undefined
  },
  riskAndNotes: {
    stressVacancyPct: undefined,
    stressExitCapRatePct: undefined,
    stressInterestRatePct: undefined,
    downsideNoiChangePct: undefined,
    notes: ''
  }
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
        const keyName = key.substring(0, key.indexOf('Offset'));
        if (!(value as RangeField).enabled) {
          transformed[`${keyName}MinOffset`] = undefined;
          transformed[`${keyName}MaxOffset`] = undefined;
        } else {
          //INFO: The backend expects positive values, while the front displays and saves them as negative
          transformed[`${keyName}MinOffset`] = -(value as RangeField).min;
          transformed[`${keyName}MaxOffset`] = (value as RangeField).max;
        }
      } else if (minSchema.safeParse(value).success) {
        if (!(value as MinField).enabled) {
          transformed[key] = undefined;
        } else {
          transformed[key] = (value as MinField).value;
        }
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
  targetLocations: z
    .array(targetLocationSchema)
    .min(1, 'At least one location is required')
    .max(3, 'No more than three locations are allowed'),
  propertyCriteria: propertyCriteriaFormSchema,
  strategy: strategyFormSchema.default(defaultStrategyFormSchema),
  multifamilyCriteria: multifamilyCriteriaFormSchema.default(
    defaultMultifamilyCriteriaFormSchema
  ),
  multifamilySetup: multifamilySetupFormSchema.default(
    defaultMultifamilySetupFormSchema
  ),
  weights: weightSchema.default(
    DEFAULT_ATTRIBUTES.reduce((acc, attr) => {
      acc[attr.id] = attr.defaultWeight;
      return acc;
    }, {} as PropertyWeights)
  )
  // similarityCriteria: z
  //   .array(similarityCriteriaFormSchema)
  //   .transform((criteria) =>
  //     criteria
  //       .filter((item) => item.enabled && item.enabled == true)
  //       .map((item) => {
  //         const { enabled, ...rest } = item;
  //         return rest;
  //       })
  //   )
});

const getDefaultBuyBoxFormData = () => {
  return {
    name: '',
    description: '',
    targetLocations: [],
    propertyCriteria: defaultPropertyCriteriaFormSchema,
    strategy: defaultStrategyFormSchema,
    multifamilyCriteria: defaultMultifamilyCriteriaFormSchema,
    multifamilySetup: defaultMultifamilySetupFormSchema,
    weights: DEFAULT_ATTRIBUTES.reduce((acc, attr) => {
      acc[attr.id] = attr.defaultWeight;
      return acc;
    }, {} as PropertyWeights)
    // similarityCriteria: [
    //   defaultSimilarityCriteriaFormSchemaFirstRank,
    //   defaultSimilarityCriteriaFormSchemaSecondRank,
    //   defaultSimilarityCriteriaFormSchemaThirdRank,
    //   defaultSimilarityCriteriaFormSchemaFourthRank
    // ]
  };
};

export type BuyBoxFormData = z.infer<typeof formBuyBoxSchema>;
export { formBuyBoxSchema, getDefaultBuyBoxFormData };
export { defaultSimilarityCriteriaFormSchemaFirstRank };
