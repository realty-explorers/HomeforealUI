import {
  Autocomplete,
  Button,
  Chip,
  Collapse,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from '../EditBuyBoxDialog.module.scss';

type MultifamilyTabsSkeletonProps = {
  title: string;
  description: string;
  tabs: string[];
  mode?: string;
};

const multifamilyAssetTypeOptions = [
  { value: 'MULTIFAMILY_GARDEN', label: 'Garden style' },
  { value: 'MULTIFAMILY_MIDRISE', label: 'Mid rise' },
  { value: 'MULTIFAMILY_HIGHRISE', label: 'High rise' },
  { value: 'MULTIFAMILY_SMALL', label: 'Small multifamily' },
  { value: 'MIXED_USE_RESIDENTIAL', label: 'Mixed use residential' },
  { value: 'STUDENT_HOUSING', label: 'Student housing' },
  { value: 'SENIOR_HOUSING', label: 'Senior housing' }
] as const;

const multifamilyRenovationAppetiteOptions = [
  { value: 'LIGHT', label: 'Turnkey' },
  { value: 'MODERATE', label: 'Light Value Add' },
  { value: 'HEAVY', label: 'Heavy Value Add' },
  { value: 'REPOSITION', label: 'Reposition' }
] as const;

const multifamilyUtilityBillingTypeOptions = [
  { value: 'OWNER_PAID', label: 'Owner paid' },
  { value: 'TENANT_PAID', label: 'Tenant paid' },
  { value: 'RUBS', label: 'RUBS' }
] as const;

const dealQualityGatePreferenceOptions = [
  { value: 'OPTIONAL', label: 'Optional' },
  { value: 'PREFERRED', label: 'Preferred' },
  { value: 'REQUIRED', label: 'Required' }
] as const;

type DealQualityGatePreference =
  (typeof dealQualityGatePreferenceOptions)[number]['value'];

const rankingWeightFields = [
  { key: 'yield', label: 'Yield weight' },
  { key: 'upside', label: 'Upside weight' },
  { key: 'discount', label: 'Discount weight' },
  { key: 'risk', label: 'Risk weight' },
  { key: 'docs', label: 'Document quality weight' }
] as const;

type RankingWeightFieldKey = (typeof rankingWeightFields)[number]['key'];

const rankingPresetOptions = [
  {
    key: 'CORE',
    label: 'Core',
    description: 'Prioritizes stability and durable yield.'
  },
  {
    key: 'BALANCED',
    label: 'Balanced',
    description: 'Balances yield, upside, discount, and risk.'
  },
  {
    key: 'CASH_FLOW',
    label: 'Cash Flow',
    description: 'Prioritizes immediate income and operating reliability.'
  },
  {
    key: 'VALUE_ADD',
    label: 'Value Add',
    description: 'Prioritizes rent upside and recoverable inefficiency.'
  },
  {
    key: 'OPPORTUNISTIC',
    label: 'Opportunistic',
    description: 'Prioritizes larger upside with higher acceptable risk.'
  },
  {
    key: 'DEEP_DISCOUNT',
    label: 'Deep Discount',
    description: 'Prioritizes price dislocation versus projected value.'
  }
] as const;

type VisibleRankingPresetKey = (typeof rankingPresetOptions)[number]['key'];
type RankingPresetKey = VisibleRankingPresetKey | 'LOW_RISK' | 'CUSTOM';

type MinimumProjectedOutcomeType =
  | 'yield'
  | 'cash_yield'
  | 'rent_upside'
  | 'irr'
  | 'value_gap';

type MinimumProjectedOutcomeConfig = {
  type: MinimumProjectedOutcomeType;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  suffix: '%';
};

const minimumProjectedOutcomeConfigByType: Record<
  MinimumProjectedOutcomeType,
  MinimumProjectedOutcomeConfig
> = {
  yield: {
    type: 'yield',
    label: 'Minimum Yield',
    min: 0,
    max: 15,
    step: 0.1,
    defaultValue: 6,
    suffix: '%'
  },
  cash_yield: {
    type: 'cash_yield',
    label: 'Minimum Cash Yield',
    min: 0,
    max: 15,
    step: 0.1,
    defaultValue: 7,
    suffix: '%'
  },
  rent_upside: {
    type: 'rent_upside',
    label: 'Minimum Rent Upside',
    min: 0,
    max: 50,
    step: 0.5,
    defaultValue: 10,
    suffix: '%'
  },
  irr: {
    type: 'irr',
    label: 'Minimum IRR',
    min: 0,
    max: 40,
    step: 0.25,
    defaultValue: 14,
    suffix: '%'
  },
  value_gap: {
    type: 'value_gap',
    label: 'Minimum Value Gap',
    min: 0,
    max: 40,
    step: 0.25,
    defaultValue: 12,
    suffix: '%'
  }
};

const minimumProjectedOutcomeTypeByPreset: Record<
  Exclude<RankingPresetKey, 'CUSTOM'>,
  MinimumProjectedOutcomeType
> = {
  CORE: 'yield',
  BALANCED: 'yield',
  CASH_FLOW: 'cash_yield',
  VALUE_ADD: 'rent_upside',
  OPPORTUNISTIC: 'irr',
  LOW_RISK: 'yield',
  DEEP_DISCOUNT: 'value_gap'
};

const strategyPresetVisualProfile: Record<
  VisibleRankingPresetKey,
  {
    yield: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
    upside: 'low' | 'medium' | 'high';
    stability: 'low' | 'medium' | 'high';
  }
> = {
  CORE: {
    yield: 'medium',
    risk: 'low',
    upside: 'low',
    stability: 'high'
  },
  BALANCED: {
    yield: 'medium',
    risk: 'medium',
    upside: 'medium',
    stability: 'medium'
  },
  CASH_FLOW: {
    yield: 'high',
    risk: 'medium',
    upside: 'low',
    stability: 'medium'
  },
  VALUE_ADD: {
    yield: 'medium',
    risk: 'medium',
    upside: 'high',
    stability: 'medium'
  },
  OPPORTUNISTIC: {
    yield: 'low',
    risk: 'high',
    upside: 'high',
    stability: 'low'
  },
  DEEP_DISCOUNT: {
    yield: 'medium',
    risk: 'medium',
    upside: 'medium',
    stability: 'low'
  }
};

const strategyLevelWidth: Record<'low' | 'medium' | 'high', string> = {
  low: '33%',
  medium: '66%',
  high: '100%'
};

type LiveFilterPreviewState = {
  matchingDeals: number;
  averageProjectedIrrPct: number;
  averagePricePerUnit: number;
  averageRentUpsidePct: number;
  updatedAt: string;
};

const rankingPresetWeights: Record<Exclude<RankingPresetKey, 'CUSTOM'>, Record<
  RankingWeightFieldKey,
  number
>> = {
  CORE: {
    yield: 25,
    upside: 10,
    discount: 15,
    risk: 35,
    docs: 15
  },
  BALANCED: {
    yield: 25,
    upside: 25,
    discount: 25,
    risk: 15,
    docs: 10
  },
  CASH_FLOW: {
    yield: 35,
    upside: 15,
    discount: 20,
    risk: 20,
    docs: 10
  },
  VALUE_ADD: {
    yield: 20,
    upside: 35,
    discount: 25,
    risk: 10,
    docs: 10
  },
  OPPORTUNISTIC: {
    yield: 15,
    upside: 40,
    discount: 20,
    risk: 15,
    docs: 10
  },
  LOW_RISK: {
    yield: 20,
    upside: 10,
    discount: 15,
    risk: 40,
    docs: 15
  },
  DEEP_DISCOUNT: {
    yield: 15,
    upside: 20,
    discount: 40,
    risk: 15,
    docs: 10
  }
};

const rankingPresetExplainability: Record<
  Exclude<RankingPresetKey, 'CUSTOM'>,
  {
    topDrivers: string[];
    topPenalties: string[];
    docsSummary: string;
  }
> = {
  CORE: {
    topDrivers: ['Stable yield', 'Lower risk profile', 'Document quality'],
    topPenalties: ['High execution risk', 'Missing core docs'],
    docsSummary: 'Documents carry meaningful weight for deal confidence.'
  },
  BALANCED: {
    topDrivers: ['Yield', 'Upside', 'Discount'],
    topPenalties: ['Risk exposure', 'Missing documents'],
    docsSummary: 'Documents influence ranking but do not dominate.'
  },
  CASH_FLOW: {
    topDrivers: ['Yield', 'Discount', 'Risk control'],
    topPenalties: ['Weak in-place cash flow', 'Missing documents'],
    docsSummary: 'Documents support confidence in cash flow durability.'
  },
  VALUE_ADD: {
    topDrivers: ['Rent upside', 'Discount to value', 'Price per unit context'],
    topPenalties: ['High risk', 'Missing documents'],
    docsSummary: 'Documents remain important for validating upside assumptions.'
  },
  OPPORTUNISTIC: {
    topDrivers: ['Upside', 'Discount', 'Flexible risk tolerance'],
    topPenalties: ['Execution complexity', 'Missing documents'],
    docsSummary: 'Document quality still contributes to tie-breaking confidence.'
  },
  LOW_RISK: {
    topDrivers: ['Risk control', 'Document quality', 'Yield stability'],
    topPenalties: ['High risk signals', 'Missing required docs'],
    docsSummary: 'Document strength is emphasized to reduce uncertainty.'
  },
  DEEP_DISCOUNT: {
    topDrivers: ['Discount to value', 'Upside', 'Yield'],
    topPenalties: ['High risk', 'Low documentation quality'],
    docsSummary: 'Documents help verify discount quality before ranking.'
  }
};

type StressPresetKey = 'conservative' | 'base' | 'aggressive' | 'custom';

const asFiniteNumber = (value: unknown, fallback: number) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const sanitizeWeightValue = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, numericValue));
};

const normalizeRankingWeights = (
  weights: Partial<Record<RankingWeightFieldKey, unknown>>
) => {
  const normalizedWeights = rankingWeightFields.reduce((acc, field) => {
    acc[field.key] = sanitizeWeightValue(weights[field.key]);
    return acc;
  }, {} as Record<RankingWeightFieldKey, number>);

  const total = rankingWeightFields.reduce(
    (sum, field) => sum + normalizedWeights[field.key],
    0
  );

  if (total <= 0) {
    const evenWeight = Number((100 / rankingWeightFields.length).toFixed(2));
    let assignedWeight = 0;

    rankingWeightFields.forEach((field, index) => {
      const nextValue =
        index === rankingWeightFields.length - 1
          ? Number((100 - assignedWeight).toFixed(2))
          : evenWeight;

      if (index < rankingWeightFields.length - 1) {
        assignedWeight += nextValue;
      }

      normalizedWeights[field.key] = nextValue;
    });

    return normalizedWeights;
  }

  let assignedWeight = 0;

  rankingWeightFields.forEach((field, index) => {
    const nextValue =
      index === rankingWeightFields.length - 1
        ? Number((100 - assignedWeight).toFixed(2))
        : Number(((normalizedWeights[field.key] / total) * 100).toFixed(2));

    if (index < rankingWeightFields.length - 1) {
      assignedWeight += nextValue;
    }

    normalizedWeights[field.key] = nextValue;
  });

  return normalizedWeights;
};

const MultifamilyTabsSkeleton = ({
  title,
  description,
  tabs,
  mode
}: MultifamilyTabsSkeletonProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAdvancedRanking, setShowAdvancedRanking] = useState(false);
  const selectedTab = tabs[activeTab] || 'Multifamily Tab';
  const normalizedMode = (mode || '').trim().toLowerCase();
  const isStrategySection =
    normalizedMode === 'strategy' || title.trim().toLowerCase() === 'strategy';
  const isUnderwritingSection = normalizedMode === 'underwriting';
  const isStressSection = normalizedMode === 'stress';
  const isReviewSection = normalizedMode === 'review';
  const showSectionIntro = !isStrategySection && !isUnderwritingSection && !isStressSection && !isReviewSection;
  const showSingleStrategyLayout = isStrategySection && tabs.length === 1;
  const { control, register, setValue, watch } = useFormContext<any>();

  const otherIncomeMonthly = watch('multifamilyCriteria.rentRoll.otherIncomeMonthly');
  const unitMixRows = (watch('multifamilyCriteria.unitMix') || []) as {
    units?: unknown;
  }[];
  const otherIncomeAnnual = asFiniteNumber(
    watch('multifamilyCriteria.income.otherIncomeAnnual'),
    0
  );

  useEffect(() => {
    const monthlyIncome = Number(otherIncomeMonthly);
    if (!Number.isFinite(monthlyIncome)) {
      return;
    }

    const totalUnits = unitMixRows.reduce((sum, row) => {
      const units = Number(row?.units ?? 0);
      return sum + (Number.isFinite(units) ? Math.max(0, units) : 0);
    }, 0);

    const derivedAnnualIncome = monthlyIncome * totalUnits * 12;

    if (Math.abs(derivedAnnualIncome - otherIncomeAnnual) < 0.01) {
      return;
    }

    setValue('multifamilyCriteria.income.otherIncomeAnnual', derivedAnnualIncome, {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [otherIncomeAnnual, otherIncomeMonthly, setValue, unitMixRows]);

  const rankingPreset = watch('strategy.preset') as RankingPresetKey | undefined;
  const watchedMinimumProjectedOutcomeType = watch(
    'strategy.primaryKpi.type'
  ) as MinimumProjectedOutcomeType | undefined;
  const minimumProjectedOutcomeValueRaw = watch('strategy.primaryKpi.minValue');
  const watchedKpiMode = watch('strategy.primaryKpi.mode') as 'minimum' | 'range' | undefined;

  const presetMinimumProjectedOutcomeType =
    rankingPreset && rankingPreset !== 'CUSTOM'
      ? minimumProjectedOutcomeTypeByPreset[rankingPreset]
      : undefined;
  const minimumProjectedOutcomeType =
    presetMinimumProjectedOutcomeType ||
    (watchedMinimumProjectedOutcomeType &&
    minimumProjectedOutcomeConfigByType[watchedMinimumProjectedOutcomeType]
      ? watchedMinimumProjectedOutcomeType
      : 'yield');
  const minimumProjectedOutcomeConfig =
    minimumProjectedOutcomeConfigByType[minimumProjectedOutcomeType];

  useEffect(() => {
    const nextType = minimumProjectedOutcomeType;
    const nextConfig = minimumProjectedOutcomeConfigByType[nextType];
    const currentValue = Number(minimumProjectedOutcomeValueRaw);
    const shouldResetValueToPresetDefault =
      watchedMinimumProjectedOutcomeType !== nextType;
    const normalizedValue =
      shouldResetValueToPresetDefault || !Number.isFinite(currentValue)
        ? nextConfig.defaultValue
        : Math.max(nextConfig.min, Math.min(nextConfig.max, currentValue));

    if (watchedMinimumProjectedOutcomeType !== nextType) {
      setValue('strategy.primaryKpi.type', nextType, {
        shouldDirty: false,
        shouldValidate: true
      });
    }

    if (
      !Number.isFinite(currentValue) ||
      Math.abs(normalizedValue - currentValue) > 0.0001
    ) {
      setValue('strategy.primaryKpi.minValue', normalizedValue, {
        shouldDirty: false,
        shouldValidate: true
      });
    }
  }, [
    minimumProjectedOutcomeType,
    minimumProjectedOutcomeValueRaw,
    setValue,
    watchedMinimumProjectedOutcomeType
  ]);

  const rankingWeightTotal = rankingWeightFields.reduce((sum, field) => {
    const value = Number(
      watch(`multifamilyCriteria.discovery.rankingWeights.${field.key}`) ?? 0
    );
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const isWeightTotalBalanced = Math.abs(rankingWeightTotal - 100) < 0.01;

  const occupancyBandLow = asFiniteNumber(
    watch('multifamilyCriteria.discovery.minOccupancyPct'),
    70
  );
  const occupancyBandHigh = asFiniteNumber(
    watch('multifamilyCriteria.discovery.maxOccupancyPct'),
    95
  );
  const occupancyBand: [number, number] = [
    Math.min(occupancyBandLow, occupancyBandHigh),
    Math.max(occupancyBandLow, occupancyBandHigh)
  ];

  const discoveryAssetTypes = (watch('multifamilyCriteria.discovery.assetTypes') || []) as string[];
  const minUnits = asFiniteNumber(watch('multifamilyCriteria.discovery.minUnits'), 10);
  const minCapRatePct = asFiniteNumber(watch('multifamilyCriteria.discovery.minCapRatePct'), 4);
  const maxCapRatePct = asFiniteNumber(watch('multifamilyCriteria.discovery.maxCapRatePct'), 10);
  const minPricePerUnit = asFiniteNumber(
    watch('multifamilyCriteria.discovery.minPricePerUnit'),
    50000
  );
  const maxPricePerUnit = asFiniteNumber(
    watch('multifamilyCriteria.discovery.maxPricePerUnit'),
    350000
  );
  const minRentUpsidePct = asFiniteNumber(
    watch('multifamilyCriteria.discovery.minRentUpsidePct'),
    5
  );

  const liveFilterPreviewReady = discoveryAssetTypes.length > 0;
  const liveFilterPreview: LiveFilterPreviewState = {
    matchingDeals: Math.max(
      0,
      Math.round(
        discoveryAssetTypes.length * 120 -
          minUnits / 5 -
          ((minPricePerUnit + maxPricePerUnit) / 2) / 6000 +
          Math.max(0, 20 - (minCapRatePct + maxCapRatePct) / 2)
      )
    ),
    averageProjectedIrrPct:
      (minCapRatePct + maxCapRatePct) / 2 + Math.max(0, minRentUpsidePct * 0.15),
    averagePricePerUnit: (minPricePerUnit + maxPricePerUnit) / 2,
    averageRentUpsidePct: minRentUpsidePct,
    updatedAt: new Date().toLocaleTimeString()
  };

  const setOccupancyBand = (economicPct: number, physicalPct: number) => {
    const normalizedEconomicPct = Math.max(0, Math.min(100, economicPct));
    const normalizedPhysicalPct = Math.max(
      normalizedEconomicPct,
      Math.min(100, physicalPct)
    );

    setValue('multifamilyCriteria.discovery.minOccupancyPct', normalizedEconomicPct, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue('multifamilyCriteria.discovery.maxOccupancyPct', normalizedPhysicalPct, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const applyRankingPreset = (preset: Exclude<RankingPresetKey, 'CUSTOM'>) => {
    setValue('strategy.preset', preset, {
      shouldDirty: true,
      shouldValidate: true
    });
    applyNormalizedRankingWeights(rankingPresetWeights[preset]);
  };

  const renderSliderField = ({
    label,
    fieldPath,
    min,
    max,
    step = 1,
    suffix = '%',
    helperText,
    quickValues,
    disabled = false
  }: {
    label: string;
    fieldPath: string;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    helperText?: string;
    quickValues?: number[];
    disabled?: boolean;
  }) => {
    const currentValue = asFiniteNumber(watch(fieldPath), min);
    const precision = Number.isInteger(step) ? 0 : step >= 0.1 ? 1 : 2;
    const formatValue = (value: number) =>
      `${value.toFixed(precision)}${suffix}`.trim();

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <Typography className="text-sm font-medium text-gray-700">{label}</Typography>
          <Typography className="text-sm font-semibold text-sky-700">
            {formatValue(currentValue)}
          </Typography>
        </div>
        {helperText && (
          <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
            {helperText}
          </Typography>
        )}

        {!!quickValues?.length && (
          <div className="mb-2 flex flex-wrap gap-2">
            {quickValues.map((quickValue) => {
              const isActive = Math.abs(currentValue - quickValue) < step / 2 + 0.0001;
              return (
                <Button
                  key={`${fieldPath}-${quickValue}`}
                  type="button"
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  disabled={disabled}
                  className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                  onClick={() =>
                    setValue(fieldPath, quickValue, {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                  }
                >
                  {formatValue(quickValue)}
                </Button>
              );
            })}
          </div>
        )}

        <Controller
          name={fieldPath as any}
          control={control}
          render={({ field }) => (
            <Slider
              aria-label={label}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              value={asFiniteNumber(field.value, min)}
              onChange={(_, value) => {
                if (Array.isArray(value)) {
                  return;
                }
                field.onChange(value);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatValue(Number(value))}
            />
          )}
        />
        <TextField
          className="mt-2"
          label={`${label} value`}
          size="small"
          type="number"
          disabled={disabled}
          inputProps={{ min, max, step }}
          value={currentValue}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            if (!Number.isFinite(nextValue)) {
              return;
            }

            const normalizedValue = Math.max(min, Math.min(max, nextValue));
            setValue(fieldPath, normalizedValue, {
              shouldDirty: true,
              shouldValidate: true
            });
          }}
        />
      </div>
    );
  };

  const renderRangeField = ({
    label,
    minFieldPath,
    maxFieldPath,
    min,
    max,
    step = 1,
    suffix = '',
    minInputLabel,
    maxInputLabel,
    showNumericInputs = true,
    quickRanges,
    quickRangeBehavior = 'set-both'
  }: {
    label: string;
    minFieldPath: string;
    maxFieldPath: string;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    minInputLabel: string;
    maxInputLabel: string;
    showNumericInputs?: boolean;
    quickRanges?: { label: string; minValue: number; maxValue: number }[];
    quickRangeBehavior?: 'set-both' | 'threshold-min';
  }) => {
    const rawMinValue = asFiniteNumber(watch(minFieldPath), min);
    const rawMaxValue = asFiniteNumber(watch(maxFieldPath), max);
    const rangeValue: [number, number] = [
      Math.min(rawMinValue, rawMaxValue),
      Math.max(rawMinValue, rawMaxValue)
    ];
    const precision = Number.isInteger(step) ? 0 : step >= 0.1 ? 1 : 2;
    const formatValue = (value: number) =>
      `${value.toFixed(precision)}${suffix}`.trim();

    const updateRange = (nextMin: number, nextMax: number) => {
      const normalizedMin = Math.max(min, Math.min(max, Math.min(nextMin, nextMax)));
      const normalizedMax = Math.max(
        normalizedMin,
        Math.min(max, Math.max(nextMin, nextMax))
      );

      setValue(minFieldPath, normalizedMin, {
        shouldDirty: true,
        shouldValidate: true
      });
      setValue(maxFieldPath, normalizedMax, {
        shouldDirty: true,
        shouldValidate: true
      });
    };

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
        <div className="mb-2 flex items-center justify-between gap-3">
          <Typography className="text-sm font-medium text-gray-700">{label}</Typography>
          <Typography className="text-sm font-semibold text-sky-700">
            {formatValue(rangeValue[0])} - {formatValue(rangeValue[1])}
          </Typography>
        </div>
        {!!quickRanges?.length && (
          <div className="mb-2 flex flex-wrap gap-2">
            {quickRanges.map((quickRange) => {
              const isActive =
                quickRangeBehavior === 'threshold-min'
                  ? Math.abs(rangeValue[0] - quickRange.minValue) < step / 2 + 0.0001
                  : Math.abs(rangeValue[0] - quickRange.minValue) < step / 2 + 0.0001 &&
                    Math.abs(rangeValue[1] - quickRange.maxValue) < step / 2 + 0.0001;

              return (
                <Button
                  key={`${label}-${quickRange.label}`}
                  type="button"
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                  onClick={() => {
                    if (quickRangeBehavior === 'threshold-min') {
                      const nextMax =
                        rangeValue[1] < quickRange.minValue ? max : Math.max(rangeValue[1], quickRange.minValue);
                      updateRange(quickRange.minValue, nextMax);
                      return;
                    }

                    updateRange(quickRange.minValue, quickRange.maxValue);
                  }}
                >
                  {quickRange.label}
                </Button>
              );
            })}
          </div>
        )}
        <Slider
          min={min}
          max={max}
          step={step}
          disableSwap
          value={rangeValue}
          onChange={(_, value) => {
            if (!Array.isArray(value)) {
              return;
            }

            updateRange(value[0], value[1]);
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatValue(Number(value))}
        />
        {showNumericInputs && (
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            <TextField
              label={minInputLabel}
              size="small"
              type="number"
              inputProps={{ min, max, step }}
              value={rangeValue[0]}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                if (!Number.isFinite(nextValue)) {
                  return;
                }

                updateRange(nextValue, rangeValue[1]);
              }}
            />
            <TextField
              label={maxInputLabel}
              size="small"
              type="number"
              inputProps={{ min, max, step }}
              value={rangeValue[1]}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                if (!Number.isFinite(nextValue)) {
                  return;
                }

                updateRange(rangeValue[0], nextValue);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderSegmentedSelectionField = ({
    label,
    fieldPath,
    options
  }: {
    label: string;
    fieldPath: string;
    options: { value: string; label: string }[];
  }) => {
    const selectedValue = watch(fieldPath);

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <Typography className="text-sm font-medium text-gray-700">{label}</Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <Button
                key={`${fieldPath}-${option.value}`}
                type="button"
                size="small"
                variant={isActive ? 'contained' : 'outlined'}
                className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                onClick={() =>
                  setValue(fieldPath, option.value, {
                    shouldDirty: true,
                    shouldValidate: true
                  })
                }
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDealGateField = ({
    label,
    fieldPath
  }: {
    label: string;
    fieldPath: string;
  }) => {
    const selectedValue = watch(fieldPath) as DealQualityGatePreference | undefined;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <Typography className="text-sm font-medium text-gray-700">{label}</Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {dealQualityGatePreferenceOptions.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <Button
                key={`${fieldPath}-${option.value}`}
                type="button"
                size="small"
                variant={isActive ? 'contained' : 'outlined'}
                className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                onClick={() =>
                  setValue(fieldPath, option.value, {
                    shouldDirty: true,
                    shouldValidate: true
                  })
                }
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const applyNormalizedRankingWeights = (
    weights: Partial<Record<RankingWeightFieldKey, unknown>>,
    options: {
      shouldDirty?: boolean;
      shouldValidate?: boolean;
    } = {}
  ) => {
    const { shouldDirty = true, shouldValidate = true } = options;
    const normalizedWeights = normalizeRankingWeights(weights);

    rankingWeightFields.forEach((rankingField) => {
      setValue(
        `multifamilyCriteria.discovery.rankingWeights.${rankingField.key}`,
        normalizedWeights[rankingField.key],
        {
          shouldDirty,
          shouldValidate
        }
      );
    });
  };

  const handleNormalizeWeights = () => {
    const currentWeights = (watch('multifamilyCriteria.discovery.rankingWeights') ||
      {}) as Partial<
      Record<RankingWeightFieldKey, unknown>
    >;
    setValue('strategy.preset', 'CUSTOM', {
      shouldDirty: true,
      shouldValidate: true
    });
    applyNormalizedRankingWeights(currentWeights);
  };

  useEffect(() => {
    if (rankingPreset) {
      return;
    }

    const currentWeights = (watch('multifamilyCriteria.discovery.rankingWeights') ||
      {}) as Partial<Record<RankingWeightFieldKey, unknown>>;
    const hasConfiguredWeight = rankingWeightFields.some(
      (field) => sanitizeWeightValue(currentWeights[field.key]) > 0
    );

    if (hasConfiguredWeight) {
      setValue('strategy.preset', 'CUSTOM', {
        shouldDirty: false,
        shouldValidate: false
      });
      return;
    }

    setValue('strategy.preset', 'BALANCED', {
      shouldDirty: false,
      shouldValidate: false
    });
    applyNormalizedRankingWeights(rankingPresetWeights.BALANCED, {
      shouldDirty: false,
      shouldValidate: false
    });
  }, [rankingPreset, setValue, watch]);

  const renderUnderwritingTabContent = () => {
    const normalizedTabLabel = `${tabs[activeTab] || ''}`.toLowerCase();
    const isIncomeTab = normalizedTabLabel.includes('income');
    const isExpensesTab = normalizedTabLabel.includes('expense');
    const isUtilitiesTab = normalizedTabLabel.includes('util');

    if (isIncomeTab) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Income Assumptions
          </Typography>
          <Typography className={styles.helper_text2}>
            Configure rent roll and income assumptions for underwriting.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderSliderField({
              label: 'Physical Occupancy %',
              fieldPath: 'multifamilyCriteria.rentRoll.physicalOccupancyPct',
              min: 0,
              max: 100,
              step: 1,
              suffix: '%',
              quickValues: [85, 90, 95]
            })}
            {renderSliderField({
              label: 'Economic Occupancy %',
              fieldPath: 'multifamilyCriteria.rentRoll.economicOccupancyPct',
              min: 0,
              max: 100,
              step: 1,
              suffix: '%',
              quickValues: [80, 85, 90, 95]
            })}
            {renderSliderField({
              label: 'Concessions %',
              fieldPath: 'multifamilyCriteria.rentRoll.concessionsPct',
              min: 0,
              max: 20,
              step: 0.5,
              suffix: '%',
              quickValues: [0, 2, 5]
            })}
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Other Income per Unit (Monthly)"
                size="small"
                type="number"
                inputProps={{ min: 0, max: 1000, step: 10 }}
                {...register('multifamilyCriteria.rentRoll.otherIncomeMonthly', {
                  valueAsNumber: true
                })}
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
              <TextField
                label="Gross Scheduled Rent (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.income.grossScheduledRentAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            {renderSliderField({
              label: 'Vacancy Loss %',
              fieldPath: 'multifamilyCriteria.income.vacancyLossPct',
              min: 0,
              max: 20,
              step: 0.5,
              suffix: '%',
              quickValues: [5, 8, 10]
            })}
            {renderSliderField({
              label: 'Bad Debt %',
              fieldPath: 'multifamilyCriteria.income.badDebtPct',
              min: 0,
              max: 10,
              step: 0.5,
              suffix: '%',
              quickValues: [1, 2, 3]
            })}
            {renderSliderField({
              label: 'Loss to Lease %',
              fieldPath: 'multifamilyCriteria.income.lossToLeasePct',
              min: 0,
              max: 20,
              step: 0.5,
              suffix: '%',
              quickValues: [0, 5, 10]
            })}
          </div>
        </div>
      );
    }

    if (isExpensesTab) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Expense Assumptions
          </Typography>
          <Typography className={styles.helper_text2}>
            Configure operating expense assumptions for underwriting.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Property Taxes (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.expenses.propertyTaxesAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Insurance (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 500 }}
                {...register('multifamilyCriteria.expenses.insuranceAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Repairs & Maintenance (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.expenses.repairsMaintenanceAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Payroll (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.expenses.payrollAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            {renderSliderField({
              label: 'Management Fee %',
              fieldPath: 'multifamilyCriteria.expenses.managementFeePct',
              min: 0,
              max: 10,
              step: 0.25,
              suffix: '%',
              quickValues: [2, 3, 4]
            })}
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Payroll & Maintenance per Unit (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 100 }}
                {...register('multifamilyCriteria.expenses.payrollAndMaintenancePerUnitAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            {renderSliderField({
              label: 'Expense Ratio Baseline %',
              fieldPath: 'multifamilyCriteria.expenses.expenseRatioBaselinePct',
              min: 20,
              max: 70,
              step: 1,
              suffix: '%',
              quickValues: [35, 45, 55]
            })}
          </div>
        </div>
      );
    }

    if (isUtilitiesTab) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Utility Assumptions
          </Typography>
          <Typography className={styles.helper_text2}>
            Configure utility billing and expense assumptions.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderSegmentedSelectionField({
              label: 'Utility Billing Type',
              fieldPath: 'multifamilyCriteria.utilities.utilityBillingType',
              options: multifamilyUtilityBillingTypeOptions as unknown as {
                value: string;
                label: string;
              }[]
            })}
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Water & Sewer (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.utilities.waterSewerAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Trash (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 500 }}
                {...register('multifamilyCriteria.utilities.trashAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Electric (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 1000 }}
                {...register('multifamilyCriteria.utilities.electricAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Gas (Annual)"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 500 }}
                {...register('multifamilyCriteria.utilities.gasAnnual', {
                  valueAsNumber: true
                })}
                fullWidth
              />
            </div>
            {renderSliderField({
              label: 'Utility Reimbursement %',
              fieldPath: 'multifamilyCriteria.utilities.reimbursementPct',
              min: 0,
              max: 100,
              step: 5,
              suffix: '%',
              quickValues: [0, 50, 100]
            })}
          </div>
        </div>
      );
    }

    return (
      <Typography className={styles.helper_text2}>
        Select a tab to configure underwriting assumptions.
      </Typography>
    );
  };

  const renderCriteriaTabContent = () => {
    const normalizedCriteriaTabLabel = `${tabs[activeTab] || ''}`.toLowerCase();
    const isDealFiltersTab =
      normalizedCriteriaTabLabel.includes('deal filters') ||
      normalizedCriteriaTabLabel.includes('buybox filters') ||
      normalizedCriteriaTabLabel.includes('discovery');
    const isStrategyTab = normalizedCriteriaTabLabel.includes('strategy');
    const isQualityGatesTab = normalizedCriteriaTabLabel.includes('quality gates');

    if (isDealFiltersTab) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Deal filters
          </Typography>
          <Typography className={styles.helper_text2}>
            Set the deal profile you want us to search for.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Controller
              name="multifamilyCriteria.discovery.assetTypes"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={multifamilyAssetTypeOptions as unknown as {
                    value: string;
                    label: string;
                  }[]}
                  getOptionLabel={(option) => option.label}
                  value={(multifamilyAssetTypeOptions as readonly { value: string; label: string }[]).filter(
                    (option) =>
                      Array.isArray(field.value) && field.value.includes(option.value)
                  )}
                  onChange={(_, selectedOptions) => {
                    field.onChange(selectedOptions.map((option) => option.value));
                  }}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => {
                      const tagProps = getTagProps({ index });
                      return (
                        <Chip
                          {...tagProps}
                          key={option.value}
                          label={option.label}
                          size="small"
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Asset Type *"
                      size="small"
                      placeholder="Select one or more property types"
                    />
                  )}
                  className="md:col-span-2"
                />
              )}
            />

            {renderRangeField({
              label: 'Units *',
              minFieldPath: 'multifamilyCriteria.discovery.minUnits',
              maxFieldPath: 'multifamilyCriteria.discovery.maxUnits',
              min: 2,
              max: 2000,
              step: 1,
              minInputLabel: 'Minimum Units',
              maxInputLabel: 'Maximum Units',
              quickRanges: [
                { label: '10+', minValue: 10, maxValue: 2000 },
                { label: '25+', minValue: 25, maxValue: 2000 },
                { label: '50+', minValue: 50, maxValue: 2000 },
                { label: '100+', minValue: 100, maxValue: 2000 },
                { label: '200+', minValue: 200, maxValue: 2000 }
              ],
              quickRangeBehavior: 'threshold-min'
            })}

            {renderRangeField({
              label: 'Total purchase price ($) *',
              minFieldPath: 'multifamilyCriteria.discovery.minAskingPrice',
              maxFieldPath: 'multifamilyCriteria.discovery.maxAskingPrice',
              min: 0,
              max: 200000000,
              step: 50000,
              minInputLabel: 'Minimum Asking Price ($)',
              maxInputLabel: 'Maximum Asking Price ($)',
              quickRanges: [
                { label: '$1M-$5M', minValue: 1000000, maxValue: 5000000 },
                { label: '$5M-$15M', minValue: 5000000, maxValue: 15000000 },
                { label: '$15M-$30M', minValue: 15000000, maxValue: 30000000 }
              ]
            })}

            {renderRangeField({
              label: 'Price per unit ($) *',
              minFieldPath: 'multifamilyCriteria.discovery.minPricePerUnit',
              maxFieldPath: 'multifamilyCriteria.discovery.maxPricePerUnit',
              min: 0,
              max: 2000000,
              step: 5000,
              minInputLabel: 'Minimum Price / Unit ($)',
              maxInputLabel: 'Maximum Price / Unit ($)',
              quickRanges: [
                { label: 'Under $75k', minValue: 0, maxValue: 75000 },
                { label: '$75k-$125k', minValue: 75000, maxValue: 125000 },
                { label: '$125k-$200k', minValue: 125000, maxValue: 200000 },
                { label: '$200k-$350k', minValue: 200000, maxValue: 350000 },
                { label: '$350k+', minValue: 350000, maxValue: 2000000 }
              ]
            })}

            {renderRangeField({
              label: 'Year Built Range *',
              minFieldPath: 'multifamilyCriteria.discovery.minYearBuilt',
              maxFieldPath: 'multifamilyCriteria.discovery.maxYearBuilt',
              min: 1900,
              max: new Date().getFullYear() + 1,
              step: 1,
              minInputLabel: 'Minimum Year Built',
              maxInputLabel: 'Maximum Year Built',
              showNumericInputs: false,
              quickRanges: [
                { label: 'Vintage 1960-1979', minValue: 1960, maxValue: 1979 },
                { label: 'Classic 1980-1999', minValue: 1980, maxValue: 1999 },
                { label: 'Modern 2000-2014', minValue: 2000, maxValue: 2014 },
                {
                  label: 'New 2015+',
                  minValue: 2015,
                  maxValue: new Date().getFullYear() + 1
                }
              ]
            })}

            {renderSegmentedSelectionField({
              label: 'Value add level *',
              fieldPath: 'multifamilyCriteria.discovery.renovationAppetite',
              options: multifamilyRenovationAppetiteOptions as unknown as {
                value: string;
                label: string;
              }[]
            })}

            <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <Typography className="text-sm font-medium text-gray-700">
                  Current occupancy range
                </Typography>
                <Typography className="text-sm font-semibold text-sky-700">
                  {occupancyBand[0].toFixed(0)}% - {occupancyBand[1].toFixed(0)}%
                </Typography>
              </div>
              <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
                This reflects current occupancy, not target occupancy.
              </Typography>
              <div className="mb-2 flex flex-wrap gap-2">
                {(
                  [
                    { label: 'Stabilized', min: 85, max: 95 },
                    { label: 'Value add', min: 70, max: 90 },
                    { label: 'Distressed', min: 40, max: 75 }
                  ] as { label: string; min: number; max: number }[]
                ).map((preset) => {
                  const isActive = occupancyBand[0] === preset.min && occupancyBand[1] === preset.max;

                  return (
                    <Button
                      key={`occupancy-${preset.label}`}
                      type="button"
                      size="small"
                      variant={isActive ? 'contained' : 'outlined'}
                      className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                      onClick={() => setOccupancyBand(preset.min, preset.max)}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                disableSwap
                value={occupancyBand}
                getAriaLabel={(index) =>
                  index === 0
                    ? 'Minimum occupancy bound'
                    : 'Maximum occupancy bound'
                }
                getAriaValueText={(value) => `${Number(value).toFixed(0)}%`}
                onChange={(_, value) => {
                  if (!Array.isArray(value)) {
                    return;
                  }
                  setOccupancyBand(value[0], value[1]);
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Number(value).toFixed(0)}%`}
              />
            </div>

            {renderRangeField({
              label: 'Cap rate range',
              minFieldPath: 'multifamilyCriteria.discovery.minCapRatePct',
              maxFieldPath: 'multifamilyCriteria.discovery.maxCapRatePct',
              min: 0,
              max: 20,
              step: 0.1,
              minInputLabel: 'Minimum Cap Rate (%)',
              maxInputLabel: 'Maximum Cap Rate (%)',
              suffix: '%'
            })}

            {renderSliderField({
              label: 'Minimum rent upside',
              fieldPath: 'multifamilyCriteria.discovery.minRentUpsidePct',
              min: 0,
              max: 50,
              step: 0.5,
              quickValues: [0, 5, 10, 15]
            })}

            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <TextField
                label="Minimum NOI per unit"
                size="small"
                type="number"
                inputProps={{ min: 0, max: 50000, step: 50 }}
                {...register('multifamilyCriteria.discovery.minNoiPerUnit', {
                  valueAsNumber: true
                })}
              />
            </div>

            {renderRangeField({
              label: 'Expense ratio range',
              minFieldPath: 'multifamilyCriteria.discovery.minExpenseRatioPct',
              maxFieldPath: 'multifamilyCriteria.discovery.maxExpenseRatioPct',
              min: 0,
              max: 90,
              step: 0.5,
              minInputLabel: 'Minimum Expense Ratio (%)',
              maxInputLabel: 'Maximum Expense Ratio (%)',
              suffix: '%'
            })}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Live preview
            </Typography>
            {!liveFilterPreviewReady ? (
              <Typography className={styles.helper_text2}>
                Enter location and core filters to preview matching deals.
              </Typography>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded border border-gray-200 p-2">
                  <Typography className="text-xs font-medium uppercase text-gray-500">
                    Matching deals
                  </Typography>
                  <Typography className="text-lg font-semibold text-gray-800">
                    {liveFilterPreview.matchingDeals.toLocaleString()}
                  </Typography>
                </div>
                <div className="rounded border border-gray-200 p-2">
                  <Typography className="text-xs font-medium uppercase text-gray-500">
                    Average {minimumProjectedOutcomeConfig.label.replace('Minimum ', '')}
                  </Typography>
                  <Typography className="text-lg font-semibold text-gray-800">
                    {liveFilterPreview.averageProjectedIrrPct.toFixed(2)}%
                  </Typography>
                </div>
                <div className="rounded border border-gray-200 p-2">
                  <Typography className="text-xs font-medium uppercase text-gray-500">
                    Average price per unit
                  </Typography>
                  <Typography className="text-lg font-semibold text-gray-800">
                    ${Math.round(liveFilterPreview.averagePricePerUnit).toLocaleString()}
                  </Typography>
                </div>
                <div className="rounded border border-gray-200 p-2">
                  <Typography className="text-xs font-medium uppercase text-gray-500">
                    Average rent upside
                  </Typography>
                  <Typography className="text-lg font-semibold text-gray-800">
                    {liveFilterPreview.averageRentUpsidePct.toFixed(1)}%
                  </Typography>
                </div>
                <div className="rounded border border-gray-200 p-2">
                  <Typography className="text-xs font-medium uppercase text-gray-500">
                    Updated at
                  </Typography>
                  <Typography className="text-lg font-semibold text-gray-800">
                    {liveFilterPreview.updatedAt}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (isStrategyTab) {
      const explainabilityPreset: Exclude<RankingPresetKey, 'CUSTOM'> =
        rankingPreset && rankingPreset !== 'CUSTOM' ? rankingPreset : 'BALANCED';
      const explainability = rankingPresetExplainability[explainabilityPreset];

      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={styles.helper_text2}>
            Choose what kind of deals should rise to the top.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rankingPresetOptions.map((preset) => {
              const isActive = rankingPreset === preset.key;
              const profile = strategyPresetVisualProfile[preset.key];

              return (
                <Button
                  key={preset.key}
                  type="button"
                  variant={isActive ? 'contained' : 'outlined'}
                  className={clsx([
                    'h-auto w-full flex-col items-start rounded-lg px-3 py-3 text-left normal-case',
                    isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : 'text-gray-700'
                  ])}
                  onClick={() => applyRankingPreset(preset.key)}
                >
                  <span className="mb-2 text-sm font-semibold">{preset.label}</span>
                  <span className="mb-2 text-xs opacity-90">{preset.description}</span>
                  {(
                    [
                      { key: 'yield', label: 'Yield' },
                      { key: 'risk', label: 'Risk' },
                      { key: 'upside', label: 'Upside' },
                      { key: 'stability', label: 'Stability' }
                    ] as {
                      key: keyof typeof profile;
                      label: string;
                    }[]
                  ).map((metric) => (
                    <span
                      key={`${preset.key}-${metric.key}`}
                      className="mb-1 flex w-full items-center gap-2 text-xs"
                    >
                      <span className="w-[52px] shrink-0 text-left">{metric.label}</span>
                      <span
                        className={clsx([
                          'h-1.5 rounded-full',
                          isActive ? 'bg-white/90' : 'bg-[#9747FF]'
                        ])}
                        style={{ width: strategyLevelWidth[profile[metric.key]] }}
                      />
                    </span>
                  ))}
                </Button>
              );
            })}
            {rankingPreset === 'CUSTOM' && (
              <Chip label="Custom" color="primary" size="small" />
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-1'])}>
              How deals will be prioritized
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Typography className="text-sm font-semibold text-gray-700">
                  Top drivers
                </Typography>
                <ul className="ml-5 mt-1 list-disc text-sm text-gray-600">
                  {explainability.topDrivers.map((driver) => (
                    <li key={`${explainabilityPreset}-driver-${driver}`}>{driver}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Typography className="text-sm font-semibold text-gray-700">
                  Top penalties
                </Typography>
                <ul className="ml-5 mt-1 list-disc text-sm text-gray-600">
                  {explainability.topPenalties.map((penalty) => (
                    <li key={`${explainabilityPreset}-penalty-${penalty}`}>{penalty}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Typography className="text-sm font-semibold text-gray-700">
                  Document importance
                </Typography>
                <Typography className="mt-1 text-sm text-gray-600">
                  {explainability.docsSummary}
                </Typography>
              </div>
            </div>
          </div>

          {renderSliderField({
            label: minimumProjectedOutcomeConfig.label,
            fieldPath: 'strategy.primaryKpi.minValue',
            min: minimumProjectedOutcomeConfig.min,
            max: minimumProjectedOutcomeConfig.max,
            step: minimumProjectedOutcomeConfig.step,
            suffix: minimumProjectedOutcomeConfig.suffix,
            helperText: 'Only show deals that meet at least this projected outcome.'
          })}

          <Typography
            data-testid="ranking-weight-total"
            className={clsx([
              styles.helper_text2,
              isWeightTotalBalanced ? 'text-emerald-700' : 'text-amber-700'
            ])}
          >
            Total weight: {rankingWeightTotal.toFixed(2)} / 100
          </Typography>

          <>
            <Button
              type="button"
              variant="outlined"
              className="w-fit"
              onClick={() => setShowAdvancedRanking((previous) => !previous)}
            >
              {showAdvancedRanking ? 'Hide Advanced Strategy' : 'Show Advanced Strategy'}
            </Button>

            <Collapse in={showAdvancedRanking}>
              <div className="mt-3 flex flex-col gap-y-3">
                <div className="flex flex-wrap gap-2">
                  {!isWeightTotalBalanced && (
                    <Button
                      type="button"
                      variant="outlined"
                      className="w-fit"
                      onClick={handleNormalizeWeights}
                    >
                      Auto normalize to 100
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outlined"
                    className="w-fit"
                    onClick={() =>
                      applyRankingPreset(
                        rankingPreset && rankingPreset !== 'CUSTOM'
                          ? rankingPreset
                          : 'BALANCED'
                      )
                    }
                  >
                    Reset to preset
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    className="w-fit"
                    onClick={() => {
                      setValue('strategy.preset', 'CUSTOM', {
                        shouldDirty: true,
                        shouldValidate: true
                      });
                      handleNormalizeWeights();
                    }}
                  >
                    Save custom
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {rankingWeightFields.map((field) => (
                    <div
                      key={field.key}
                      className="rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <Typography className="text-sm font-medium text-gray-700">
                          {field.label}
                        </Typography>
                        <Typography className="text-sm font-semibold text-sky-700">
                          {asFiniteNumber(
                            watch(`multifamilyCriteria.discovery.rankingWeights.${field.key}`),
                            0
                          ).toFixed(1)}%
                        </Typography>
                      </div>
                      <Controller
                        name={`multifamilyCriteria.discovery.rankingWeights.${field.key}` as any}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Slider
                            aria-label={field.label}
                            min={0}
                            max={100}
                            step={0.1}
                            value={asFiniteNumber(controllerField.value, 0)}
                            onChange={(_, value) => {
                              if (Array.isArray(value)) {
                                return;
                              }

                              const sanitizedValue = sanitizeWeightValue(value);
                              const currentWeights = (watch(
                                'multifamilyCriteria.discovery.rankingWeights'
                              ) || {}) as Partial<Record<RankingWeightFieldKey, unknown>>;
                              const nextWeights = {
                                ...currentWeights,
                                [field.key]: sanitizedValue
                              };
                              const nextTotal = rankingWeightFields.reduce(
                                (sum, rankingField) =>
                                  sum + sanitizeWeightValue(nextWeights[rankingField.key]),
                                0
                              );

                              setValue('strategy.preset', 'CUSTOM', {
                                shouldDirty: true,
                                shouldValidate: true
                              });

                              if (nextTotal <= 0) {
                                controllerField.onChange(sanitizedValue);
                                return;
                              }

                              applyNormalizedRankingWeights(nextWeights);
                            }}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${Number(value).toFixed(1)}%`}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </>
        </div>
      );
    }

    if (isQualityGatesTab) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Deal quality gates
          </Typography>
          <Typography className={styles.helper_text2}>
            Optional shows all deals. Preferred boosts deals that include the
            document. Required hides deals missing the document.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderDealGateField({
              label: 'Offering memorandum',
              fieldPath: 'multifamilyCriteria.discovery.dealQualityGates.requireOm'
            })}
            {renderDealGateField({
              label: 'Rent roll',
              fieldPath: 'multifamilyCriteria.discovery.dealQualityGates.requireRentRoll'
            })}
            {renderDealGateField({
              label: 'T12 operating statement',
              fieldPath: 'multifamilyCriteria.discovery.dealQualityGates.requireT12'
            })}
          </div>
        </div>
      );
    }

    return (
      <Typography className={styles.helper_text2}>
        Discovery tab content is not available yet.
      </Typography>
    );
  };

  const renderStressTabContent = () => {
    return (
      <div className="flex flex-col gap-y-3">
        <Typography className={clsx([styles.subheader, 'mb-1'])}>
          Stress Testing
        </Typography>
        <Typography className={styles.helper_text2}>
          Test your strategy against adverse market conditions.
        </Typography>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {renderSliderField({
            label: 'Vacancy Increase %',
            fieldPath: 'multifamilyCriteria.stressTest.vacancyIncreasePct',
            min: 0,
            max: 30,
            step: 1,
            suffix: '%',
            quickValues: [5, 10, 15]
          })}
          {renderSliderField({
            label: 'Expense Increase %',
            fieldPath: 'multifamilyCriteria.stressTest.expenseIncreasePct',
            min: 0,
            max: 30,
            step: 1,
            suffix: '%',
            quickValues: [5, 10, 15]
          })}
          {renderSliderField({
            label: 'Rent Decrease %',
            fieldPath: 'multifamilyCriteria.stressTest.rentDecreasePct',
            min: 0,
            max: 30,
            step: 1,
            suffix: '%',
            quickValues: [5, 10, 15]
          })}
          {renderSliderField({
            label: 'Exit Cap Increase %',
            fieldPath: 'multifamilyCriteria.stressTest.exitCapIncreasePct',
            min: 0,
            max: 5,
            step: 0.25,
            suffix: '%',
            quickValues: [0.5, 1, 2]
          })}
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <TextField
              label="Construction Delay (Months)"
              size="small"
              type="number"
              inputProps={{ min: 0, max: 24, step: 1 }}
              {...register('multifamilyCriteria.stressTest.constructionDelayMonths', {
                valueAsNumber: true
              })}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  };

  const renderReviewTabContent = () => {
    const formValues = watch();
    const buyBoxName = formValues.name || 'Unnamed BuyBox';
    const strategyType = formValues.strategy?.strategyType || 'MULTIFAMILY';
    const preset = formValues.strategy?.preset || 'BALANCED';

    return (
      <div className="flex flex-col gap-y-3">
        <Typography className={clsx([styles.subheader, 'mb-1'])}>
          Review & Save
        </Typography>
        <Typography className={styles.helper_text2}>
          Review your BuyBox configuration before saving.
        </Typography>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <Typography className="mb-2 text-lg font-semibold">BuyBox Name</Typography>
          <TextField
            {...register('name')}
            fullWidth
            size="small"
            label="Name"
            helperText="Edit the name before saving"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <Typography className="mb-2 text-lg font-semibold">Strategy Summary</Typography>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Strategy Type:</div>
            <div className="font-medium">{strategyType}</div>
            <div className="text-gray-600">Strategy Preset:</div>
            <div className="font-medium">{preset}</div>
            <div className="text-gray-600">Primary KPI:</div>
            <div className="font-medium">{formValues.strategy?.primaryKpi?.type || 'yield'}</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <Typography className="mb-2 text-lg font-semibold">Configuration Complete</Typography>
          <Typography className="text-sm text-gray-600">
            All {tabs.length} steps have been configured. Click Save & Finish to create your BuyBox.
          </Typography>
        </div>
      </div>
    );
  };

  const getTabContent = () => {
    if (isUnderwritingSection) {
      return renderUnderwritingTabContent();
    }
    if (isStressSection) {
      return renderStressTabContent();
    }
    if (isReviewSection) {
      return renderReviewTabContent();
    }
    return renderCriteriaTabContent();
  };

  return (
    <div
      className={clsx([
        'grow flex w-full max-w-full flex-col overflow-x-hidden px-4',
        showSingleStrategyLayout ? 'pt-0' : 'pt-8'
      ])}
    >
      {showSectionIntro && (
        <>
          <Typography className={clsx([styles.header, 'mb-2'])}>{title}</Typography>
          <Typography className={clsx([styles.helper_text2, 'mb-6'])}>
            {description}
          </Typography>
        </>
      )}

      {!showSingleStrategyLayout && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          className="max-w-full"
          sx={{
            maxWidth: '100%',
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important'
            },
            '& .MuiTabs-flexContainer': {
              flexWrap: 'nowrap'
            }
          }}
        >
          {tabs.map((tabLabel, index) => (
            <Tab
              key={tabLabel}
              label={`${index + 1}. ${tabLabel}`}
              sx={{
                minWidth: 'max-content'
              }}
            />
          ))}
        </Tabs>
      )}

      <div
        className={clsx([
          'max-w-full overflow-x-hidden rounded-lg border border-dashed border-gray-300 bg-white/70 p-4 md:p-6 [&_.MuiFormControl-root]:w-full',
          showSingleStrategyLayout ? 'mt-0' : 'mt-4'
        ])}
      >
        <Typography className={clsx([styles.subheader, 'mb-2'])}>
          {selectedTab}
        </Typography>
        {getTabContent()}
      </div>
    </div>
  );
};

export default MultifamilyTabsSkeleton;
