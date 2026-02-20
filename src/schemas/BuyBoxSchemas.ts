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

const strategySchema = z.object({
  strategyType: buyBoxStrategyTypeEnum.optional(),
  minArv: z.number().min(defaults.arv.min).max(defaults.arv.max).optional(),
  minMargin: z
    .number()
    .min(defaults.margin.min)
    .max(defaults.margin.max)
    .optional()
});

const defaultStrategy = {
  strategyType: 'FIX_AND_FLIP' as BuyBoxStrategyType,
  minArv: defaults.arv.min,
  minMargin: defaults.margin.min
};

const optionalMultifamilyNumber = z.number().optional();

const multifamilyUnitMixSchema = z.object({
  unitType: z.string().optional(),
  units: optionalMultifamilyNumber,
  avgRent: optionalMultifamilyNumber,
  avgSqft: optionalMultifamilyNumber
});

const multifamilyCriteriaSchema = z.object({
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
      otherIncomeAnnual: optionalMultifamilyNumber
    })
    .default({}),
  expenses: z
    .object({
      propertyTaxesAnnual: optionalMultifamilyNumber,
      insuranceAnnual: optionalMultifamilyNumber,
      repairsMaintenanceAnnual: optionalMultifamilyNumber,
      payrollAnnual: optionalMultifamilyNumber,
      managementFeePct: optionalMultifamilyNumber
    })
    .default({}),
  utilities: z
    .object({
      waterSewerAnnual: optionalMultifamilyNumber,
      trashAnnual: optionalMultifamilyNumber,
      electricAnnual: optionalMultifamilyNumber,
      gasAnnual: optionalMultifamilyNumber,
      reimbursementPct: optionalMultifamilyNumber
    })
    .default({})
});

const multifamilySetupSchema = z.object({
  capitalStack: z
    .object({
      purchasePrice: optionalMultifamilyNumber,
      closingCostsPct: optionalMultifamilyNumber,
      equityPct: optionalMultifamilyNumber,
      preferredReturnPct: optionalMultifamilyNumber
    })
    .default({}),
  loanAssumptions: z
    .object({
      interestRatePct: optionalMultifamilyNumber,
      ltvPct: optionalMultifamilyNumber,
      amortizationYears: optionalMultifamilyNumber,
      loanTermYears: optionalMultifamilyNumber,
      interestOnlyMonths: optionalMultifamilyNumber,
      minimumDscr: optionalMultifamilyNumber
    })
    .default({}),
  renovationCapex: z
    .object({
      interiorBudget: optionalMultifamilyNumber,
      exteriorBudget: optionalMultifamilyNumber,
      commonAreaBudget: optionalMultifamilyNumber,
      contingencyPct: optionalMultifamilyNumber,
      capexReservePerUnit: optionalMultifamilyNumber,
      timelineMonths: optionalMultifamilyNumber
    })
    .default({}),
  exitScenario: z
    .object({
      holdPeriodYears: optionalMultifamilyNumber,
      exitCapRatePct: optionalMultifamilyNumber,
      annualRentGrowthPct: optionalMultifamilyNumber,
      annualExpenseGrowthPct: optionalMultifamilyNumber,
      sellingCostsPct: optionalMultifamilyNumber
    })
    .default({}),
  riskAndNotes: z
    .object({
      stressVacancyPct: optionalMultifamilyNumber,
      stressExitCapRatePct: optionalMultifamilyNumber,
      stressInterestRatePct: optionalMultifamilyNumber,
      downsideNoiChangePct: optionalMultifamilyNumber,
      notes: z.string().optional().default('')
    })
    .default({})
});

const defaultMultifamilyCriteria = {
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

const defaultMultifamilySetup = {
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
  multifamilySetup: multifamilySetupSchema.default(defaultMultifamilySetup),
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
    multifamilySetup: defaultMultifamilySetup,
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
