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
    minMargin: minSchema,
    // New fields per BuyBox UI spec v1.0
    preset: z.enum([
      'CORE',
      'BALANCED',
      'CASH_FLOW',
      'VALUE_ADD',
      'OPPORTUNISTIC',
      'DEEP_DISCOUNT'
    ]).optional(),
    primaryKpi: z
      .object({
        type: z.enum([
          'yield',
          'cash_yield',
          'rent_upside',
          'irr',
          'value_gap'
        ]).optional(),
        mode: z.enum(['minimum', 'range']).default('minimum'),
        minValue: z.number().optional(),
        maxValue: z.number().optional(),
        hardGateEnabled: z.boolean().default(false)
      })
      .default({})
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
  minMargin: { enabled: false, value: defaults.margin.min },
  // New fields per BuyBox UI spec v1.0
  preset: undefined as 'CORE' | 'BALANCED' | 'CASH_FLOW' | 'VALUE_ADD' | 'OPPORTUNISTIC' | 'DEEP_DISCOUNT' | undefined,
  primaryKpi: {
    type: undefined as 'yield' | 'cash_yield' | 'rent_upside' | 'irr' | 'value_gap' | undefined,
    mode: 'minimum' as const,
    minValue: undefined as number | undefined,
    maxValue: undefined as number | undefined,
    hardGateEnabled: false as const
  }
};

const multifamilyAssetTypeEnum = z.enum([
  'MULTIFAMILY',
  'GARDEN_STYLE',
  'MID_RISE',
  'HIGH_RISE',
  'MIXED_USE',
  'MULTIFAMILY_GARDEN',
  'MULTIFAMILY_MIDRISE',
  'MULTIFAMILY_HIGHRISE',
  'MULTIFAMILY_SMALL',
  'MIXED_USE_RESIDENTIAL',
  'STUDENT_HOUSING',
  'SENIOR_HOUSING'
]);

const legacyMultifamilyAssetTypeMap: Record<
  string,
  z.infer<typeof multifamilyAssetTypeEnum>
> = {
  MULTIFAMILY: 'MULTIFAMILY_GARDEN',
  GARDEN_STYLE: 'MULTIFAMILY_GARDEN',
  MID_RISE: 'MULTIFAMILY_MIDRISE',
  HIGH_RISE: 'MULTIFAMILY_HIGHRISE',
  MIXED_USE: 'MIXED_USE_RESIDENTIAL'
};

const multifamilyRenovationAppetiteEnum = z.enum([
  'LIGHT',
  'MODERATE',
  'HEAVY',
  'REPOSITION'
]);

const multifamilyUtilityBillingTypeEnum = z.enum([
  'OWNER_PAID',
  'TENANT_PAID',
  'RUBS'
]);

const multifamilyAssetTypesFormSchema = z.preprocess(
  (value) => {
    if (!Array.isArray(value)) {
      return value;
    }

    return value.map((entry) => {
      if (typeof entry !== 'string') {
        return entry;
      }

      const normalizedEntry = entry.toUpperCase();
      return legacyMultifamilyAssetTypeMap[normalizedEntry] ?? normalizedEntry;
    });
  },
  z.array(multifamilyAssetTypeEnum).default([])
);

const multifamilyRenovationAppetiteFormSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const normalizedValue = value.toUpperCase();
    const mappedValue: Record<string, z.infer<typeof multifamilyRenovationAppetiteEnum>> = {
      TURNKEY: 'LIGHT',
      LIGHT_VALUE_ADD: 'MODERATE',
      HEAVY_VALUE_ADD: 'HEAVY'
    };

    return mappedValue[normalizedValue] ?? normalizedValue;
  },
  multifamilyRenovationAppetiteEnum.optional()
);

const multifamilyUtilityBillingTypeFormSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.toUpperCase();
  },
  multifamilyUtilityBillingTypeEnum.optional()
);

const multifamilyDealQualityGatePreferenceEnum = z.enum([
  'OPTIONAL',
  'PREFERRED',
  'REQUIRED'
]);

const multifamilyDealQualityGatePreferenceFormSchema = z.preprocess(
  (value) => {
    if (value === true) {
      return 'REQUIRED';
    }

    if (value === false) {
      return 'OPTIONAL';
    }

    if (typeof value === 'string') {
      return value.toUpperCase();
    }

    return value;
  },
  multifamilyDealQualityGatePreferenceEnum.optional()
);

const multifamilyRankingPresetEnum = z.enum([
  'CORE',
  'BALANCED',
  'CASH_FLOW',
  'VALUE_ADD',
  'OPPORTUNISTIC',
  'LOW_RISK',
  'DEEP_DISCOUNT',
  'CUSTOM'
]);

const multifamilyMinimumProjectedOutcomeTypeEnum = z.enum([
  'yield',
  'cash_yield',
  'rent_upside',
  'irr',
  'value_gap'
]);

const multifamilyMinimumProjectedOutcomeTypeFormSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  },
  multifamilyMinimumProjectedOutcomeTypeEnum.optional()
);

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

const multifamilyRankingWeightsFormSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    const rankingWeights = value as Record<string, unknown>;

    return {
      ...rankingWeights,
      yield: rankingWeights.yield ?? rankingWeights.expenseEfficiency,
      upside: rankingWeights.upside ?? rankingWeights.rentUpside,
      discount: rankingWeights.discount ?? rankingWeights.discountToValue,
      risk: rankingWeights.risk ?? rankingWeights.riskPenalty,
      docs: rankingWeights.docs ?? rankingWeights.documentCompleteness
    };
  },
  z
    .object({
      yield: optionalMultifamilyNumberFormSchema,
      upside: optionalMultifamilyNumberFormSchema,
      discount: optionalMultifamilyNumberFormSchema,
      risk: optionalMultifamilyNumberFormSchema,
      docs: optionalMultifamilyNumberFormSchema
    })
    .default({})
);

const multifamilyUnitMixFormSchema = z.object({
  unitType: z.string().optional(),
  units: optionalMultifamilyNumberFormSchema,
  avgRent: optionalMultifamilyNumberFormSchema,
  avgSqft: optionalMultifamilyNumberFormSchema,
  targetPct: optionalMultifamilyNumberFormSchema
});

const multifamilyDiscoveryFormSchema = z
  .object({
    assetTypes: multifamilyAssetTypesFormSchema,
    minUnits: optionalMultifamilyNumberFormSchema,
    maxUnits: optionalMultifamilyNumberFormSchema,
    minAskingPrice: optionalMultifamilyNumberFormSchema,
    maxAskingPrice: optionalMultifamilyNumberFormSchema,
    minPricePerUnit: optionalMultifamilyNumberFormSchema,
    maxPricePerUnit: optionalMultifamilyNumberFormSchema,
    minYearBuilt: optionalMultifamilyNumberFormSchema,
    maxYearBuilt: optionalMultifamilyNumberFormSchema,
    minOccupancyPct: optionalMultifamilyNumberFormSchema,
    maxOccupancyPct: optionalMultifamilyNumberFormSchema,
    minCapRatePct: optionalMultifamilyNumberFormSchema,
    maxCapRatePct: optionalMultifamilyNumberFormSchema,
    minRentUpsidePct: optionalMultifamilyNumberFormSchema,
    minNoiPerUnit: optionalMultifamilyNumberFormSchema,
    minExpenseRatioPct: optionalMultifamilyNumberFormSchema,
    maxExpenseRatioPct: optionalMultifamilyNumberFormSchema,
    unitMixTargets: z
      .object({
        enabled: z.boolean().default(false)
      })
      .default({ enabled: false }),
    renovationAppetite: multifamilyRenovationAppetiteFormSchema,
    dealQualityGates: z
      .object({
        requireOm: multifamilyDealQualityGatePreferenceFormSchema,
        requireRentRoll: multifamilyDealQualityGatePreferenceFormSchema,
        requireT12: multifamilyDealQualityGatePreferenceFormSchema
      })
      .default({}),
    minimumProjectedOutcomeType:
      multifamilyMinimumProjectedOutcomeTypeFormSchema.default('yield'),
    minimumProjectedOutcomeValue: optionalMultifamilyNumberFormSchema.default(6),
    rankingPreset: multifamilyRankingPresetEnum.optional(),
    rankingWeights: multifamilyRankingWeightsFormSchema
  })
  .default({});

const multifamilyStressTestFormSchema = z
  .object({
    vacancyIncreasePct: optionalMultifamilyNumberFormSchema,
    expenseIncreasePct: optionalMultifamilyNumberFormSchema,
    rentDecreasePct: optionalMultifamilyNumberFormSchema,
    exitCapIncreasePct: optionalMultifamilyNumberFormSchema,
    constructionDelayMonths: optionalMultifamilyNumberFormSchema
  })
  .default({});

const multifamilyCriteriaFormSchema = z.object({
  discovery: multifamilyDiscoveryFormSchema,
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
      lossToLeasePct: optionalMultifamilyNumberFormSchema,
      otherIncomeAnnual: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  expenses: z
    .object({
      propertyTaxesAnnual: optionalMultifamilyNumberFormSchema,
      insuranceAnnual: optionalMultifamilyNumberFormSchema,
      repairsMaintenanceAnnual: optionalMultifamilyNumberFormSchema,
      payrollAnnual: optionalMultifamilyNumberFormSchema,
      managementFeePct: optionalMultifamilyNumberFormSchema,
      payrollAndMaintenancePerUnitAnnual: optionalMultifamilyNumberFormSchema,
      expenseRatioBaselinePct: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  utilities: z
    .object({
      utilityBillingType: multifamilyUtilityBillingTypeFormSchema,
      waterSewerAnnual: optionalMultifamilyNumberFormSchema,
      trashAnnual: optionalMultifamilyNumberFormSchema,
      electricAnnual: optionalMultifamilyNumberFormSchema,
      gasAnnual: optionalMultifamilyNumberFormSchema,
      reimbursementPct: optionalMultifamilyNumberFormSchema,
      waterSewerPerUnitMonthly: optionalMultifamilyNumberFormSchema,
      trashPerUnitMonthly: optionalMultifamilyNumberFormSchema,
      electricPerUnitMonthly: optionalMultifamilyNumberFormSchema,
      gasPerUnitMonthly: optionalMultifamilyNumberFormSchema
    })
    .default({}),
  stressTest: multifamilyStressTestFormSchema
});

const defaultMultifamilyCriteriaFormSchema: z.infer<typeof multifamilyCriteriaFormSchema> = {
  discovery: {
    assetTypes: ['MULTIFAMILY_GARDEN'],
    minUnits: 10,
    maxUnits: 200,
    minAskingPrice: 0,
    maxAskingPrice: 20000000,
    minPricePerUnit: 50000,
    maxPricePerUnit: 350000,
    minYearBuilt: 1960,
    maxYearBuilt: new Date().getFullYear(),
    minOccupancyPct: 70,
    maxOccupancyPct: 95,
    minCapRatePct: 4,
    maxCapRatePct: 10,
    minRentUpsidePct: 5,
    minNoiPerUnit: 0,
    minExpenseRatioPct: 30,
    maxExpenseRatioPct: 65,
    unitMixTargets: {
      enabled: false
    },
    renovationAppetite: 'MODERATE',
    dealQualityGates: {
      requireOm: 'OPTIONAL',
      requireRentRoll: 'OPTIONAL',
      requireT12: 'OPTIONAL'
    },
    minimumProjectedOutcomeType: 'yield',
    minimumProjectedOutcomeValue: 6,
    rankingPreset: 'BALANCED',
    rankingWeights: {
      yield: 25,
      upside: 25,
      discount: 25,
      risk: 15,
      docs: 10
    }
  },
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
    lossToLeasePct: undefined,
    otherIncomeAnnual: undefined
  },
  expenses: {
    propertyTaxesAnnual: undefined,
    insuranceAnnual: undefined,
    repairsMaintenanceAnnual: undefined,
    payrollAnnual: undefined,
    managementFeePct: undefined,
    payrollAndMaintenancePerUnitAnnual: undefined,
    expenseRatioBaselinePct: undefined
  },
  utilities: {
    utilityBillingType: 'OWNER_PAID',
    waterSewerAnnual: undefined,
    trashAnnual: undefined,
    electricAnnual: undefined,
    gasAnnual: undefined,
    reimbursementPct: undefined,
    waterSewerPerUnitMonthly: undefined,
    trashPerUnitMonthly: undefined,
    electricPerUnitMonthly: undefined,
    gasPerUnitMonthly: undefined
  },
  stressTest: {
    vacancyIncreasePct: undefined,
    expenseIncreasePct: undefined,
    rentDecreasePct: undefined,
    exitCapIncreasePct: undefined,
    constructionDelayMonths: undefined
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

const isFiniteNumberValue = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const formBuyBoxSchema = z
  .object({
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
  })
  .superRefine((formData, ctx) => {
    if (formData.strategy.strategyType !== 'MULTIFAMILY') {
      return;
    }

    const { discovery } = formData.multifamilyCriteria;

    const requireNumberField = (
      value: unknown,
      path: string[],
      fieldLabel: string,
      min?: number,
      max?: number
    ) => {
      if (!isFiniteNumberValue(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `${fieldLabel} is required`
        });
        return;
      }

      if (typeof min === 'number' && value < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `${fieldLabel} must be at least ${min}`
        });
      }

      if (typeof max === 'number' && value > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `${fieldLabel} must be ${max} or less`
        });
      }
    };

    const validateRequiredRange = (
      minValue: unknown,
      maxValue: unknown,
      minPath: string[],
      maxPath: string[],
      label: string,
      minAllowed?: number,
      maxAllowed?: number
    ) => {
      requireNumberField(minValue, minPath, `${label} minimum`, minAllowed, maxAllowed);
      requireNumberField(maxValue, maxPath, `${label} maximum`, minAllowed, maxAllowed);

      if (
        isFiniteNumberValue(minValue) &&
        isFiniteNumberValue(maxValue) &&
        minValue > maxValue
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: maxPath,
          message: `${label} maximum must be greater than or equal to minimum`
        });
      }
    };

    if (!Array.isArray(discovery.assetTypes) || discovery.assetTypes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'assetTypes'],
        message: 'At least one asset type is required'
      });
    }

    validateRequiredRange(
      discovery.minUnits,
      discovery.maxUnits,
      ['multifamilyCriteria', 'discovery', 'minUnits'],
      ['multifamilyCriteria', 'discovery', 'maxUnits'],
      'Unit count',
      2
    );

    validateRequiredRange(
      discovery.minAskingPrice,
      discovery.maxAskingPrice,
      ['multifamilyCriteria', 'discovery', 'minAskingPrice'],
      ['multifamilyCriteria', 'discovery', 'maxAskingPrice'],
      'Asking price',
      0
    );

    validateRequiredRange(
      discovery.minPricePerUnit,
      discovery.maxPricePerUnit,
      ['multifamilyCriteria', 'discovery', 'minPricePerUnit'],
      ['multifamilyCriteria', 'discovery', 'maxPricePerUnit'],
      'Price per unit',
      0
    );

    validateRequiredRange(
      discovery.minYearBuilt,
      discovery.maxYearBuilt,
      ['multifamilyCriteria', 'discovery', 'minYearBuilt'],
      ['multifamilyCriteria', 'discovery', 'maxYearBuilt'],
      'Year built',
      1800,
      new Date().getFullYear()
    );

    validateRequiredRange(
      discovery.minOccupancyPct,
      discovery.maxOccupancyPct,
      ['multifamilyCriteria', 'discovery', 'minOccupancyPct'],
      ['multifamilyCriteria', 'discovery', 'maxOccupancyPct'],
      'Occupancy',
      0,
      100
    );

    if (
      isFiniteNumberValue(discovery.minCapRatePct) ||
      isFiniteNumberValue(discovery.maxCapRatePct)
    ) {
      validateRequiredRange(
        discovery.minCapRatePct,
        discovery.maxCapRatePct,
        ['multifamilyCriteria', 'discovery', 'minCapRatePct'],
        ['multifamilyCriteria', 'discovery', 'maxCapRatePct'],
        'Cap rate',
        0,
        20
      );
    }

    if (isFiniteNumberValue(discovery.minRentUpsidePct)) {
      requireNumberField(
        discovery.minRentUpsidePct,
        ['multifamilyCriteria', 'discovery', 'minRentUpsidePct'],
        'Minimum rent upside',
        0,
        50
      );
    }

    if (isFiniteNumberValue(discovery.minNoiPerUnit)) {
      requireNumberField(
        discovery.minNoiPerUnit,
        ['multifamilyCriteria', 'discovery', 'minNoiPerUnit'],
        'Minimum NOI per unit',
        0,
        50000
      );
    }

    if (
      isFiniteNumberValue(discovery.minExpenseRatioPct) ||
      isFiniteNumberValue(discovery.maxExpenseRatioPct)
    ) {
      validateRequiredRange(
        discovery.minExpenseRatioPct,
        discovery.maxExpenseRatioPct,
        ['multifamilyCriteria', 'discovery', 'minExpenseRatioPct'],
        ['multifamilyCriteria', 'discovery', 'maxExpenseRatioPct'],
        'Expense ratio',
        0,
        90
      );
    }

    if (!discovery.renovationAppetite) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'renovationAppetite'],
        message: 'Renovation appetite is required'
      });
    }

    if (!discovery.rankingPreset) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'rankingPreset'],
        message: 'Ranking preset is required'
      });
    }

    if (!discovery.minimumProjectedOutcomeType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'minimumProjectedOutcomeType'],
        message: 'Minimum projected outcome type is required'
      });
    }

    const minimumProjectedOutcomeRanges = {
      yield: { min: 0, max: 15 },
      cash_yield: { min: 0, max: 15 },
      rent_upside: { min: 0, max: 50 },
      irr: { min: 0, max: 40 },
      value_gap: { min: 0, max: 40 }
    } as const;

    const minimumProjectedOutcomeRange =
      discovery.minimumProjectedOutcomeType
        ? minimumProjectedOutcomeRanges[discovery.minimumProjectedOutcomeType]
        : undefined;

    if (!isFiniteNumberValue(discovery.minimumProjectedOutcomeValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'minimumProjectedOutcomeValue'],
        message: 'Minimum projected outcome value is required'
      });
    } else if (minimumProjectedOutcomeRange) {
      requireNumberField(
        discovery.minimumProjectedOutcomeValue,
        ['multifamilyCriteria', 'discovery', 'minimumProjectedOutcomeValue'],
        'Minimum projected outcome value',
        minimumProjectedOutcomeRange.min,
        minimumProjectedOutcomeRange.max
      );
    }

    const dealQualityGates = discovery.dealQualityGates;
    const dealQualityGateFields: { key: keyof typeof dealQualityGates; label: string }[] = [
      { key: 'requireOm', label: 'OM requirement' },
      { key: 'requireRentRoll', label: 'Rent roll requirement' },
      { key: 'requireT12', label: 'T12 requirement' }
    ];

    dealQualityGateFields.forEach((gateField) => {
      if (!dealQualityGates[gateField.key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['multifamilyCriteria', 'discovery', 'dealQualityGates', gateField.key],
          message: `${gateField.label} must be selected`
        });
      }
    });

    const rankingWeightKeys = [
      'yield',
      'upside',
      'discount',
      'risk',
      'docs'
    ] as const;

    let rankingWeightTotal = 0;

    rankingWeightKeys.forEach((rankingWeightKey) => {
      const rankingWeightValue = discovery.rankingWeights[rankingWeightKey];
      if (!isFiniteNumberValue(rankingWeightValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['multifamilyCriteria', 'discovery', 'rankingWeights', rankingWeightKey],
          message: 'Ranking weight is required'
        });
        return;
      }

      if (rankingWeightValue < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['multifamilyCriteria', 'discovery', 'rankingWeights', rankingWeightKey],
          message: 'Ranking weight cannot be negative'
        });
      }

      rankingWeightTotal += rankingWeightValue;
    });

    if (rankingWeightTotal <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'rankingWeights'],
        message: 'At least one ranking weight must be greater than zero'
      });
    }

    if (Math.abs(rankingWeightTotal - 100) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['multifamilyCriteria', 'discovery', 'rankingWeights'],
        message: 'Ranking weights must sum to 100'
      });
    }

    if (discovery.unitMixTargets?.enabled) {
      if (!formData.multifamilyCriteria.unitMix.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['multifamilyCriteria', 'unitMix'],
          message: 'At least one unit mix target row is required when targeting is enabled'
        });
      }

      let targetPctTotal = 0;

      formData.multifamilyCriteria.unitMix.forEach((unitMixRow, index) => {
        if (!isFiniteNumberValue(unitMixRow.targetPct)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['multifamilyCriteria', 'unitMix', index, 'targetPct'],
            message: 'Target % is required when unit mix targeting is enabled'
          });
          return;
        }

        if (unitMixRow.targetPct < 0 || unitMixRow.targetPct > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['multifamilyCriteria', 'unitMix', index, 'targetPct'],
            message: 'Target % must be between 0 and 100'
          });
        }

        targetPctTotal += unitMixRow.targetPct;
      });

      if (Math.abs(targetPctTotal - 100) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['multifamilyCriteria', 'unitMix'],
          message: 'Unit mix target % values must sum to 100'
        });
      }
    }
  });

const getDefaultBuyBoxFormData = () => {
  return {
    name: '',
    description: '',
    targetLocations: [],
    propertyCriteria: defaultPropertyCriteriaFormSchema,
    strategy: defaultStrategyFormSchema,
    multifamilyCriteria: defaultMultifamilyCriteriaFormSchema,
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
