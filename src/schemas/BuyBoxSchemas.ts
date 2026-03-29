import z from 'zod';
import { defaults, defaultSimilarityFields } from './defaults';
import { DEFAULT_ATTRIBUTES, PropertyWeights } from '@/utils/propertyUtils';

export const weightSchema = z
  .record(
    z.string(),
    z
      .number()
      .min(0, { message: 'Weight cannot be negative' })
      .max(100, { message: 'Weight cannot exceed 100' })
  )
  .transform((weights: Record<string, number>) => {
    return Object.keys(weights).reduce(
      (acc, key) => {
        acc[key] = weights[key] / 100;
        return acc;
      },
      {} as Record<string, number>
    );
  });

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
  'zipCode',
  'address',
  'street',
  'state'
]);

export const buyBoxStrategyTypeEnum = z.enum([
  'FIX_AND_FLIP',
  'BUY_AND_HOLD',
  'MULTIFAMILY'
]);
export type BuyBoxStrategyType = z.infer<typeof buyBoxStrategyTypeEnum>;

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

const multifamilyAssetTypesSchema = z.preprocess(
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

const multifamilyRenovationAppetiteSchema = z.preprocess(
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

const multifamilyUtilityBillingTypeSchema = z.preprocess(
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

const multifamilyDealQualityGatePreferenceSchema = z.preprocess(
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

const multifamilyMinimumProjectedOutcomeTypeSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  },
  multifamilyMinimumProjectedOutcomeTypeEnum.optional()
);

const propertyCriteriaSchema = z.object({
  propertyTypes: z.array(propertyTypeEnum).optional(),
  minBeds: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  maxBeds: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  minBaths: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  maxBaths: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  minArea: z.number().min(defaults.area.min).max(defaults.area.max).optional(),
  maxArea: z.number().min(defaults.area.min).max(defaults.area.max).optional(),
  minLotArea: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  maxLotArea: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  minYearBuilt: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  maxYearBuilt: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  minPrice: z
    .number()
    .min(defaults.listingPrice.min)
    .max(defaults.listingPrice.max)
    .optional(),
  maxPrice: z
    .number()
    .min(defaults.listingPrice.min)
    .max(defaults.listingPrice.max)
    .optional()
});

const defaultPropertyCriteria = {
  propertyTypes: [],
  minBeds: defaults.bedrooms.min,
  maxBeds: defaults.bedrooms.max,
  minBaths: defaults.bathrooms.min,
  maxBaths: defaults.bathrooms.max,
  minArea: defaults.area.min,
  maxArea: defaults.area.max,
  minLotArea: defaults.lotSize.min,
  maxLotArea: defaults.lotSize.max,
  minYearBuilt: defaults.yearBuilt.min,
  maxYearBuilt: defaults.yearBuilt.max,
  minPrice: defaults.listingPrice.min,
  maxPrice: defaults.listingPrice.max
};

const optionalMultifamilyNumber = z.number().optional();

const strategySchema = z.object({
  strategyType: buyBoxStrategyTypeEnum.optional(),
  minArv: z.number().min(defaults.arv.min).max(defaults.arv.max).optional(),
  minMargin: z
    .number()
    .min(defaults.margin.min)
    .max(defaults.margin.max)
    .optional(),
  preset: multifamilyRankingPresetEnum.optional(),
  primaryKpi: z
    .object({
      type: multifamilyMinimumProjectedOutcomeTypeSchema.optional(),
      mode: z.enum(['minimum', 'range']).optional(),
      minValue: optionalMultifamilyNumber,
      maxValue: optionalMultifamilyNumber,
      hardGateEnabled: z.boolean().optional()
    })
    .optional(),
  stressPreset: z.enum(['conservative', 'base', 'aggressive', 'custom']).optional()
});

const defaultStrategy = {
  strategyType: 'FIX_AND_FLIP' as BuyBoxStrategyType,
  minArv: defaults.arv.min,
  minMargin: defaults.margin.min,
  preset: undefined as typeof multifamilyRankingPresetEnum._type | undefined,
  primaryKpi: undefined as
    | {
        type?: typeof multifamilyMinimumProjectedOutcomeTypeSchema._type;
        mode?: 'minimum' | 'range';
        minValue?: number;
        maxValue?: number;
        hardGateEnabled?: boolean;
      }
    | undefined,
  stressPreset: undefined as 'conservative' | 'base' | 'aggressive' | 'custom' | undefined
};

const multifamilyRankingWeightsSchema = z.preprocess(
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
      yield: optionalMultifamilyNumber,
      upside: optionalMultifamilyNumber,
      discount: optionalMultifamilyNumber,
      risk: optionalMultifamilyNumber,
      docs: optionalMultifamilyNumber
    })
    .default({})
);

const multifamilyUnitMixSchema = z.object({
  unitType: z.string().optional(),
  units: optionalMultifamilyNumber,
  avgRent: optionalMultifamilyNumber,
  avgSqft: optionalMultifamilyNumber,
  targetPct: optionalMultifamilyNumber
});

const multifamilyDiscoverySchema = z
  .object({
    assetTypes: multifamilyAssetTypesSchema,
    minUnits: optionalMultifamilyNumber,
    maxUnits: optionalMultifamilyNumber,
    minAskingPrice: optionalMultifamilyNumber,
    maxAskingPrice: optionalMultifamilyNumber,
    minPricePerUnit: optionalMultifamilyNumber,
    maxPricePerUnit: optionalMultifamilyNumber,
    minYearBuilt: optionalMultifamilyNumber,
    maxYearBuilt: optionalMultifamilyNumber,
    minOccupancyPct: optionalMultifamilyNumber,
    maxOccupancyPct: optionalMultifamilyNumber,
    minCapRatePct: optionalMultifamilyNumber,
    maxCapRatePct: optionalMultifamilyNumber,
    minRentUpsidePct: optionalMultifamilyNumber,
    minNoiPerUnit: optionalMultifamilyNumber,
    minExpenseRatioPct: optionalMultifamilyNumber,
    maxExpenseRatioPct: optionalMultifamilyNumber,
    unitMixTargets: z
      .object({
        enabled: z.boolean().default(false)
      })
      .default({ enabled: false }),
    renovationAppetite: multifamilyRenovationAppetiteSchema,
    dealQualityGates: z
      .object({
        requireOm: multifamilyDealQualityGatePreferenceSchema,
        requireRentRoll: multifamilyDealQualityGatePreferenceSchema,
        requireT12: multifamilyDealQualityGatePreferenceSchema
      })
      .default({}),
    minimumProjectedOutcomeType: multifamilyMinimumProjectedOutcomeTypeSchema.default('yield'),
    minimumProjectedOutcomeValue: optionalMultifamilyNumber.default(6),
    rankingPreset: multifamilyRankingPresetEnum.optional(),
    rankingWeights: multifamilyRankingWeightsSchema
  })
  .default({});

const multifamilyCriteriaSchema = z.object({
  discovery: multifamilyDiscoverySchema,
  unitMix: z.array(multifamilyUnitMixSchema).default([]),
  rentRoll: z
    .object({
      physicalOccupancyPct: optionalMultifamilyNumber,
      economicOccupancyPct: optionalMultifamilyNumber,
      concessionsPct: optionalMultifamilyNumber,
      otherIncomeMonthly: optionalMultifamilyNumber
    })
    .default({}),
  income: z
    .object({
      grossScheduledRentAnnual: optionalMultifamilyNumber,
      vacancyLossPct: optionalMultifamilyNumber,
      badDebtPct: optionalMultifamilyNumber,
      lossToLeasePct: optionalMultifamilyNumber,
      otherIncomeAnnual: optionalMultifamilyNumber
    })
    .default({}),
  expenses: z
    .object({
      propertyTaxesAnnual: optionalMultifamilyNumber,
      insuranceAnnual: optionalMultifamilyNumber,
      repairsMaintenanceAnnual: optionalMultifamilyNumber,
      payrollAnnual: optionalMultifamilyNumber,
      managementFeePct: optionalMultifamilyNumber,
      payrollAndMaintenancePerUnitAnnual: optionalMultifamilyNumber,
      expenseRatioBaselinePct: optionalMultifamilyNumber
    })
    .default({}),
  utilities: z
    .object({
      utilityBillingType: multifamilyUtilityBillingTypeSchema,
      waterSewerAnnual: optionalMultifamilyNumber,
      trashAnnual: optionalMultifamilyNumber,
      electricAnnual: optionalMultifamilyNumber,
      gasAnnual: optionalMultifamilyNumber,
      reimbursementPct: optionalMultifamilyNumber,
      waterSewerPerUnitMonthly: optionalMultifamilyNumber,
      trashPerUnitMonthly: optionalMultifamilyNumber,
      electricPerUnitMonthly: optionalMultifamilyNumber,
      gasPerUnitMonthly: optionalMultifamilyNumber
    })
    .default({})
});

const defaultMultifamilyCriteria: z.infer<typeof multifamilyCriteriaSchema> = {
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
  }
};

const similarityCriteriaSchema = z.object({
  samePropertyType: z.boolean().default(false),
  sameNeighborhood: z.boolean().default(false),
  bedsMinOffset: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  bedsMaxOffset: z
    .number()
    .min(defaults.bedrooms.min)
    .max(defaults.bedrooms.max)
    .optional(),
  bathsMinOffset: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  bathsMaxOffset: z
    .number()
    .min(defaults.bathrooms.min)
    .max(defaults.bathrooms.max)
    .optional(),
  areaMinOffset: z
    .number()
    .min(defaults.area.min)
    .max(defaults.area.max)
    .optional(),
  areaMaxOffset: z
    .number()
    .min(defaults.area.min)
    .max(defaults.area.max)
    .optional(),
  lotAreaMinOffset: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  lotAreaMaxOffset: z
    .number()
    .min(defaults.lotSize.min)
    .max(defaults.lotSize.max)
    .optional(),
  yearBuiltMinOffset: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  yearBuiltMaxOffset: z
    .number()
    .min(defaults.yearBuilt.min)
    .max(defaults.yearBuilt.max)
    .optional(),
  maxDistance: z
    .number()
    .min(defaults.distance.min)
    .max(defaults.distance.max)
    .optional(),
  maxListingAgeMonths: z
    .number()
    .min(defaultSimilarityFields.saleDate.min)
    .max(defaultSimilarityFields.saleDate.max)
    .optional(),
  weight: z.number().min(0).max(1).optional()
});

const defaultSimilarityCriteriaFirstRank = {
  samePropertyType: false,
  sameNeighborhood: false,
  bedsMinOffset: defaults.bedrooms.min,
  bedsMaxOffset: defaults.bedrooms.max,
  bathsMinOffset: defaults.bathrooms.min,
  bathsMaxOffset: defaults.bathrooms.max,
  areaMinOffset: defaults.area.min,
  areaMaxOffset: defaults.area.max,
  lotAreaMinOffset: defaults.lotSize.min,
  lotAreaMaxOffset: defaults.lotSize.max,
  yearBuiltMinOffset: defaults.yearBuilt.min,
  yearBuiltMaxOffset: defaults.yearBuilt.max,
  maxDistance: defaultSimilarityFields.distance.max,
  maxListingAgeMonths: defaultSimilarityFields.saleDate.max,
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

export const targetLocationSchema = z.object({
  display: z.string(),
  type: locationTypeEnum,
  address: z.string().nullish(),
  street: z.string().nullish(),
  neighborhood: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zipCode: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish()
});

const buyboxSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .default(''),
  description: z.string().optional(),
  targetLocations: z.array(targetLocationSchema).min(1).max(3),
  propertyCriteria: propertyCriteriaSchema.default(defaultPropertyCriteria),
  strategy: strategySchema.default(defaultStrategy),
  multifamilyCriteria: multifamilyCriteriaSchema.default(defaultMultifamilyCriteria),
  weights: weightSchema
  // similarityCriteria: z
  //   .array(similarityCriteriaSchema)
  //   .default([
  //     defaultSimilarityCriteriaFirstRank,
  //     defaultSimilarityCriteriaSecondRank,
  //     defaultSimilarityCriteriaThirdRank,
  //     defaultSimilarityCriteriaFourthRank
  //   ])
});

const getDefaultBuyBoxData = () => {
  const defaultData: BuyboxSchemaData = {
    name: '',
    description: '',
    targetLocations: [],
    propertyCriteria: defaultPropertyCriteria,
    strategy: defaultStrategy,
    multifamilyCriteria: defaultMultifamilyCriteria,
    weights: DEFAULT_ATTRIBUTES.reduce((acc, attr) => {
      acc[attr.id] = attr.defaultWeight;
      return acc;
    }, {} as PropertyWeights)
    // similarityCriteria: []
  };
  return defaultData;
};

type BuyboxSchemaData = z.infer<typeof buyboxSchema>;
type buyboxSchemaType = z.infer<typeof buyboxSchema>;

export { buyboxSchema, getDefaultBuyBoxData };
export type { BuyboxSchemaData, buyboxSchemaType };
