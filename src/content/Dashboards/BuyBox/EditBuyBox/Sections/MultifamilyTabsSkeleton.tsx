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
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import styles from '../EditBuyBoxDialog.module.scss';

type MultifamilyTabsSkeletonProps = {
  title: string;
  description: string;
  tabs: string[];
  mode: 'criteria' | 'setup';
};

const defaultUnitMixRow = {
  unitType: '',
  units: 0,
  avgRent: 0,
  avgSqft: 0,
  targetPct: 0
};

const multifamilyAssetTypeOptions = [
  { value: 'MULTIFAMILY', label: 'Multifamily' },
  { value: 'GARDEN_STYLE', label: 'Garden Style' },
  { value: 'MID_RISE', label: 'Mid Rise' },
  { value: 'HIGH_RISE', label: 'High Rise' },
  { value: 'MIXED_USE', label: 'Mixed Use' }
] as const;

const multifamilyRenovationAppetiteOptions = [
  { value: 'LIGHT', label: 'Light' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HEAVY', label: 'Heavy' }
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
  { key: 'BALANCED', label: 'Balanced' },
  { key: 'CASH_FLOW', label: 'Cash Flow' },
  { key: 'VALUE_ADD', label: 'Value Add' },
  { key: 'LOW_RISK', label: 'Low Risk' },
  { key: 'DEEP_DISCOUNT', label: 'Deep Discount' }
] as const;

type RankingPresetKey =
  | (typeof rankingPresetOptions)[number]['key']
  | 'CUSTOM';

const rankingPresetWeights: Record<Exclude<RankingPresetKey, 'CUSTOM'>, Record<
  RankingWeightFieldKey,
  number
>> = {
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

type StressPresetKey = 'conservative' | 'base' | 'aggressive' | 'custom';

const stressPresetValues: Record<
  Exclude<StressPresetKey, 'custom'>,
  {
    stressVacancyPct: number;
    stressExitCapRatePct: number;
    stressInterestRatePct: number;
    downsideNoiChangePct: number;
  }
> = {
  conservative: {
    stressVacancyPct: 5,
    stressExitCapRatePct: 0.75,
    stressInterestRatePct: 1,
    downsideNoiChangePct: 10
  },
  base: {
    stressVacancyPct: 2,
    stressExitCapRatePct: 0.25,
    stressInterestRatePct: 0.5,
    downsideNoiChangePct: 5
  },
  aggressive: {
    stressVacancyPct: 1,
    stressExitCapRatePct: 0,
    stressInterestRatePct: 0,
    downsideNoiChangePct: 2
  }
};

type IncomeDefaultsPresetKey = 'conservative' | 'base' | 'aggressive';

const incomeDefaultsPresetValues: Record<
  IncomeDefaultsPresetKey,
  {
    vacancyLossPct: number;
    concessionsPct: number;
  }
> = {
  conservative: {
    vacancyLossPct: 8,
    concessionsPct: 4
  },
  base: {
    vacancyLossPct: 6,
    concessionsPct: 2
  },
  aggressive: {
    vacancyLossPct: 4,
    concessionsPct: 1
  }
};

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
  const [stressPreset, setStressPreset] = useState<StressPresetKey>('custom');
  const [showAdvancedRanking, setShowAdvancedRanking] = useState(false);
  const selectedTab = tabs[activeTab] || 'Multifamily Tab';
  const { control, register, setValue, watch } = useFormContext<any>();
  const initializedUnitMixRef = useRef(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'multifamilyCriteria.unitMix'
  });

  useEffect(() => {
    if (mode !== 'criteria' || initializedUnitMixRef.current || fields.length > 0) {
      return;
    }
    append(defaultUnitMixRow);
    initializedUnitMixRef.current = true;
  }, [append, fields.length, mode]);

  useEffect(() => {
    if (stressPreset === 'custom') {
      return;
    }

    const presetValues = stressPresetValues[stressPreset];

    setValue(
      'multifamilySetup.riskAndNotes.stressVacancyPct',
      presetValues.stressVacancyPct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
    setValue(
      'multifamilySetup.riskAndNotes.stressExitCapRatePct',
      presetValues.stressExitCapRatePct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
    setValue(
      'multifamilySetup.riskAndNotes.stressInterestRatePct',
      presetValues.stressInterestRatePct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
    setValue(
      'multifamilySetup.riskAndNotes.downsideNoiChangePct',
      presetValues.downsideNoiChangePct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
  }, [setValue, stressPreset]);

  const otherIncomeMonthly = watch('multifamilyCriteria.rentRoll.otherIncomeMonthly');
  const unitMixRows = (watch('multifamilyCriteria.unitMix') || []) as {
    units?: unknown;
  }[];

  useEffect(() => {
    const monthlyIncome = Number(otherIncomeMonthly);
    if (!Number.isFinite(monthlyIncome)) {
      return;
    }

    const totalUnits = unitMixRows.reduce((sum, row) => {
      const units = Number(row?.units ?? 0);
      return sum + (Number.isFinite(units) ? Math.max(0, units) : 0);
    }, 0);

    setValue('multifamilyCriteria.income.otherIncomeAnnual', monthlyIncome * totalUnits * 12, {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [otherIncomeMonthly, setValue, unitMixRows]);

  const rankingPreset = watch(
    'multifamilyCriteria.discovery.rankingPreset'
  ) as RankingPresetKey | undefined;

  const rankingWeightTotal = rankingWeightFields.reduce((sum, field) => {
    const value = Number(
      watch(`multifamilyCriteria.discovery.rankingWeights.${field.key}`) ?? 0
    );
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const isWeightTotalBalanced = Math.abs(rankingWeightTotal - 100) < 0.01;
  const unitMixTargetingEnabled = Boolean(
    watch('multifamilyCriteria.discovery.unitMixTargets.enabled')
  );

  const unitMixTargetPctTotal = fields.reduce((sum, _, index) => {
    const value = Number(watch(`multifamilyCriteria.unitMix.${index}.targetPct`) ?? 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const isUnitMixTargetTotalBalanced = Math.abs(unitMixTargetPctTotal - 100) < 0.01;

  const occupancyBandLow = asFiniteNumber(
    watch('multifamilyCriteria.discovery.minOccupancyPct'),
    85
  );
  const occupancyBandHigh = asFiniteNumber(
    watch('multifamilyCriteria.discovery.maxOccupancyPct'),
    95
  );
  const occupancyBand: [number, number] = [
    Math.min(occupancyBandLow, occupancyBandHigh),
    Math.max(occupancyBandLow, occupancyBandHigh)
  ];

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

  const applyIncomeDefaultsPreset = (preset: IncomeDefaultsPresetKey) => {
    const presetValues = incomeDefaultsPresetValues[preset];

    setValue('multifamilyCriteria.income.vacancyLossPct', presetValues.vacancyLossPct, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue('multifamilyCriteria.rentRoll.concessionsPct', presetValues.concessionsPct, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const applyRankingPreset = (preset: Exclude<RankingPresetKey, 'CUSTOM'>) => {
    setValue('multifamilyCriteria.discovery.rankingPreset', preset, {
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
    quickValues,
    disabled = false
  }: {
    label: string;
    fieldPath: string;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
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
    quickRanges
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
                Math.abs(rangeValue[0] - quickRange.minValue) < step / 2 + 0.0001 &&
                Math.abs(rangeValue[1] - quickRange.maxValue) < step / 2 + 0.0001;

              return (
                <Button
                  key={`${label}-${quickRange.label}`}
                  type="button"
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                  onClick={() => updateRange(quickRange.minValue, quickRange.maxValue)}
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
    setValue('multifamilyCriteria.discovery.rankingPreset', 'CUSTOM', {
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
      setValue('multifamilyCriteria.discovery.rankingPreset', 'CUSTOM', {
        shouldDirty: false,
        shouldValidate: false
      });
      return;
    }

    setValue('multifamilyCriteria.discovery.rankingPreset', 'BALANCED', {
      shouldDirty: false,
      shouldValidate: false
    });
    applyNormalizedRankingWeights(rankingPresetWeights.BALANCED, {
      shouldDirty: false,
      shouldValidate: false
    });
  }, [rankingPreset, setValue, watch]);

  const renderCriteriaTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Discovery filters
          </Typography>
          <Typography className={styles.helper_text2}>
            Define hard constraints for the target multifamily opportunity set.
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
                      label="Asset Types *"
                      size="small"
                      placeholder="Select one or more asset types"
                    />
                  )}
                  className="md:col-span-2"
                />
              )}
            />

            {renderRangeField({
              label: 'Unit Count Range *',
              minFieldPath: 'multifamilyCriteria.discovery.minUnits',
              maxFieldPath: 'multifamilyCriteria.discovery.maxUnits',
              min: 1,
              max: 500,
              step: 1,
              minInputLabel: 'Minimum Units',
              maxInputLabel: 'Maximum Units'
            })}

            {renderRangeField({
              label: 'Asking Price Range ($) *',
              minFieldPath: 'multifamilyCriteria.discovery.minAskingPrice',
              maxFieldPath: 'multifamilyCriteria.discovery.maxAskingPrice',
              min: 0,
              max: 50000000,
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
              label: 'Price Per Unit Range ($) *',
              minFieldPath: 'multifamilyCriteria.discovery.minPricePerUnit',
              maxFieldPath: 'multifamilyCriteria.discovery.maxPricePerUnit',
              min: 0,
              max: 1000000,
              step: 5000,
              minInputLabel: 'Minimum Price / Unit ($)',
              maxInputLabel: 'Maximum Price / Unit ($)',
              quickRanges: [
                { label: '$50k-$150k', minValue: 50000, maxValue: 150000 },
                { label: '$150k-$300k', minValue: 150000, maxValue: 300000 },
                { label: '$300k-$500k', minValue: 300000, maxValue: 500000 }
              ]
            })}

            {renderRangeField({
              label: 'Year Built Range *',
              minFieldPath: 'multifamilyCriteria.discovery.minYearBuilt',
              maxFieldPath: 'multifamilyCriteria.discovery.maxYearBuilt',
              min: 1800,
              max: new Date().getFullYear(),
              step: 1,
              minInputLabel: 'Minimum Year Built',
              maxInputLabel: 'Maximum Year Built',
              showNumericInputs: false,
              quickRanges: [
                { label: 'Classic', minValue: 1900, maxValue: 1979 },
                { label: '1980-1999', minValue: 1980, maxValue: 1999 },
                { label: '2000+', minValue: 2000, maxValue: new Date().getFullYear() }
              ]
            })}

            {renderSegmentedSelectionField({
              label: 'Renovation Appetite *',
              fieldPath: 'multifamilyCriteria.discovery.renovationAppetite',
              options: multifamilyRenovationAppetiteOptions as unknown as {
                value: string;
                label: string;
              }[]
            })}

            <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <Typography className="text-sm font-medium text-gray-700">
                  Occupancy target band (Min to Max)
                </Typography>
                <Typography className="text-sm font-semibold text-sky-700">
                  {occupancyBand[0].toFixed(1)}% - {occupancyBand[1].toFixed(1)}%
                </Typography>
              </div>
              <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
                Drag both handles to quickly set occupancy bounds.
              </Typography>
              <Slider
                min={0}
                max={100}
                step={0.5}
                disableSwap
                value={occupancyBand}
                getAriaLabel={(index) =>
                  index === 0
                    ? 'Minimum occupancy bound'
                    : 'Maximum occupancy bound'
                }
                getAriaValueText={(value) => `${Number(value).toFixed(1)}%`}
                onChange={(_, value) => {
                  if (!Array.isArray(value)) {
                    return;
                  }
                  setOccupancyBand(value[0], value[1]);
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Number(value).toFixed(1)}%`}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <Typography className="text-sm font-medium text-gray-700">
                Unit Mix Targeting
              </Typography>
              {unitMixTargetingEnabled && (
                <Typography
                  data-testid="unit-mix-target-total"
                  className={clsx([
                    'text-sm font-semibold',
                    isUnitMixTargetTotalBalanced ? 'text-emerald-700' : 'text-amber-700'
                  ])}
                >
                  Total target: {unitMixTargetPctTotal.toFixed(2)}%
                </Typography>
              )}
            </div>
            <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
              Enable to enforce target_pct allocation by unit type. When enabled,
              all target percentages must sum to 100.
            </Typography>
            <div className="mb-3 flex flex-wrap gap-2">
              {(
                [
                  { key: false, label: 'Disabled' },
                  { key: true, label: 'Enabled' }
                ] as { key: boolean; label: string }[]
              ).map((option) => {
                const isActive = unitMixTargetingEnabled === option.key;

                return (
                  <Button
                    key={`unit-mix-target-${option.label}`}
                    type="button"
                    size="small"
                    variant={isActive ? 'contained' : 'outlined'}
                    className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                    onClick={() =>
                      setValue(
                        'multifamilyCriteria.discovery.unitMixTargets.enabled',
                        option.key,
                        {
                          shouldDirty: true,
                          shouldValidate: true
                        }
                      )
                    }
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-col gap-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid w-full grid-cols-1 gap-3 md:grid-cols-[1fr_7rem_9rem_8rem_9rem_auto]"
                >
                  <TextField
                    label="Unit Type"
                    size="small"
                    {...register(`multifamilyCriteria.unitMix.${index}.unitType`)}
                  />
                  <TextField
                    label="Units"
                    size="small"
                    type="number"
                    {...register(`multifamilyCriteria.unitMix.${index}.units`, {
                      valueAsNumber: true
                    })}
                  />
                  <TextField
                    label="Avg Rent ($)"
                    size="small"
                    type="number"
                    {...register(`multifamilyCriteria.unitMix.${index}.avgRent`, {
                      valueAsNumber: true
                    })}
                  />
                  <TextField
                    label="Avg Sqft"
                    size="small"
                    type="number"
                    {...register(`multifamilyCriteria.unitMix.${index}.avgSqft`, {
                      valueAsNumber: true
                    })}
                  />
                  <TextField
                    label="Target %"
                    size="small"
                    type="number"
                    disabled={!unitMixTargetingEnabled}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    {...register(`multifamilyCriteria.unitMix.${index}.targetPct`, {
                      valueAsNumber: true
                    })}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    className="w-full md:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => append(defaultUnitMixRow)}
                >
                  Add Unit Type
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 1) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Strategy preset
          </Typography>
          <Typography className={styles.helper_text2}>
            Select a strategy preset. Raw scoring weights remain hidden unless you
            open Advanced Strategy.
          </Typography>
          <div className="flex flex-wrap items-center gap-2">
            {rankingPresetOptions.map((preset) => {
              const isActive = rankingPreset === preset.key;

              return (
                <Button
                  key={preset.key}
                  type="button"
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  className={isActive ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]' : ''}
                  onClick={() => applyRankingPreset(preset.key)}
                >
                  {preset.label}
                </Button>
              );
            })}
            {rankingPreset === 'CUSTOM' && (
              <Chip label="Custom" color="primary" size="small" />
            )}
          </div>

          <Typography
            data-testid="ranking-weight-total"
            className={clsx([
              styles.helper_text2,
              isWeightTotalBalanced ? 'text-emerald-700' : 'text-amber-700'
            ])}
          >
            Total weight: {rankingWeightTotal.toFixed(2)} / 100
          </Typography>
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

                            setValue('multifamilyCriteria.discovery.rankingPreset', 'CUSTOM', {
                              shouldDirty: true,
                              shouldValidate: true
                            });

                            if (nextTotal > 100) {
                              applyNormalizedRankingWeights(nextWeights);
                              return;
                            }

                            controllerField.onChange(sanitizedValue);
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
        </div>
      );
    }

    if (activeTab === 2) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Deal quality gates
          </Typography>
          <Typography className={styles.helper_text2}>
            Set each doc preference as Optional, Preferred, or Required.
            Required excludes deals missing the doc. Preferred boosts document score.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderDealGateField({
              label: 'Require OM (Offering Memorandum)',
              fieldPath: 'multifamilyCriteria.discovery.dealQualityGates.requireOm'
            })}
            {renderDealGateField({
              label: 'Require Rent Roll',
              fieldPath: 'multifamilyCriteria.discovery.dealQualityGates.requireRentRoll'
            })}
            {renderDealGateField({
              label: 'Require T12',
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

  const renderSetupTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="flex flex-col gap-y-6">
          <Typography className={styles.helper_text2}>
            Defaults are used only when listing and documents do not provide a value.
          </Typography>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Income Defaults
            </Typography>
            <Typography className={clsx([styles.helper_text2, 'mb-3'])}>
              Apply a preset, then fine-tune vacancy, concessions, and other income
              assumptions.
            </Typography>
            <div className="mb-3 flex flex-wrap gap-2">
              {(
                [
                  { key: 'conservative', label: 'Conservative preset' },
                  { key: 'base', label: 'Base preset' },
                  { key: 'aggressive', label: 'Aggressive preset' }
                ] as { key: IncomeDefaultsPresetKey; label: string }[]
              ).map((preset) => (
                <Button
                  key={preset.key}
                  type="button"
                  variant="outlined"
                  onClick={() => applyIncomeDefaultsPreset(preset.key)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Gross Scheduled Rent (Annual)"
                size="small"
                type="number"
                {...register('multifamilyCriteria.income.grossScheduledRentAnnual', {
                  valueAsNumber: true
                })}
              />
              {renderSliderField({
                label: 'Vacancy Loss',
                fieldPath: 'multifamilyCriteria.income.vacancyLossPct',
                min: 0,
                max: 30,
                step: 0.5,
                quickValues: [3, 5, 8, 12]
              })}
              {renderSliderField({
                label: 'Concessions',
                fieldPath: 'multifamilyCriteria.rentRoll.concessionsPct',
                min: 0,
                max: 20,
                step: 0.5,
                quickValues: [0, 2, 4, 6]
              })}
              <TextField
                label="Other Income / Unit / Month"
                size="small"
                type="number"
                {...register('multifamilyCriteria.rentRoll.otherIncomeMonthly', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Other Income (Annual, Derived)"
                size="small"
                value={
                  Number.isFinite(Number(watch('multifamilyCriteria.income.otherIncomeAnnual')))
                    ? Number(watch('multifamilyCriteria.income.otherIncomeAnnual'))
                    : ''
                }
                InputProps={{ readOnly: true }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Expense Defaults
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {renderSliderField({
                label: 'Management Fee',
                fieldPath: 'multifamilyCriteria.expenses.managementFeePct',
                min: 0,
                max: 20,
                step: 0.5,
                quickValues: [2, 3, 5, 7]
              })}
              <TextField
                label="Reserve / Unit / Year"
                size="small"
                type="number"
                {...register('multifamilySetup.renovationCapex.capexReservePerUnit', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Payroll & Maintenance / Unit / Year"
                size="small"
                type="number"
                {...register('multifamilyCriteria.expenses.payrollAndMaintenancePerUnitAnnual', {
                  valueAsNumber: true
                })}
              />
              {renderSliderField({
                label: 'Expense Ratio Baseline',
                fieldPath: 'multifamilyCriteria.expenses.expenseRatioBaselinePct',
                min: 0,
                max: 100,
                step: 0.5,
                quickValues: [35, 45, 55, 65]
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Utilities Defaults
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Water/Sewer / Unit / Month"
                size="small"
                type="number"
                {...register('multifamilyCriteria.utilities.waterSewerPerUnitMonthly', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Trash / Unit / Month"
                size="small"
                type="number"
                {...register('multifamilyCriteria.utilities.trashPerUnitMonthly', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Electric / Unit / Month"
                size="small"
                type="number"
                {...register('multifamilyCriteria.utilities.electricPerUnitMonthly', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Gas / Unit / Month"
                size="small"
                type="number"
                {...register('multifamilyCriteria.utilities.gasPerUnitMonthly', {
                  valueAsNumber: true
                })}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Taxes and Insurance Defaults
            </Typography>
            <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
              Taxes and insurance are market based proxies and are locked unless
              verified by documents.
            </Typography>
            <Chip
              label="Source: market/county proxy"
              size="small"
              variant="outlined"
              className="mb-3 w-fit"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Property Taxes / Unit / Year"
                size="small"
                type="number"
                InputProps={{ readOnly: true }}
                {...register('multifamilyCriteria.expenses.propertyTaxesAnnual', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Insurance / Unit / Year"
                size="small"
                type="number"
                InputProps={{ readOnly: true }}
                {...register('multifamilyCriteria.expenses.insuranceAnnual', {
                  valueAsNumber: true
                })}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Typography className={clsx([styles.subheader, 'mb-2'])}>
              Financing Defaults
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {renderSliderField({
                label: 'Interest Rate',
                fieldPath: 'multifamilySetup.loanAssumptions.interestRatePct',
                min: 0,
                max: 20,
                step: 0.1,
                quickValues: [4, 5.5, 7, 9]
              })}
              {renderSliderField({
                label: 'Loan-to-Value',
                fieldPath: 'multifamilySetup.loanAssumptions.ltvPct',
                min: 0,
                max: 90,
                step: 1,
                quickValues: [55, 65, 75, 80]
              })}
              <TextField
                label="Amortization (Years)"
                size="small"
                type="number"
                {...register('multifamilySetup.loanAssumptions.amortizationYears', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Loan Term (Years)"
                size="small"
                type="number"
                {...register('multifamilySetup.loanAssumptions.loanTermYears', {
                  valueAsNumber: true
                })}
              />
              <TextField
                label="Interest Only (Months)"
                size="small"
                type="number"
                {...register('multifamilySetup.loanAssumptions.interestOnlyMonths', {
                  valueAsNumber: true
                })}
              />
              {renderSliderField({
                label: 'Minimum DSCR',
                fieldPath: 'multifamilySetup.loanAssumptions.minimumDscr',
                min: 0.8,
                max: 2.5,
                step: 0.05,
                suffix: '',
                quickValues: [1, 1.2, 1.35, 1.5]
              })}
              {renderSliderField({
                label: 'Closing Costs',
                fieldPath: 'multifamilySetup.capitalStack.closingCostsPct',
                min: 0,
                max: 15,
                step: 0.1,
                quickValues: [1, 2, 3, 5]
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 1) {
      const isCustomPreset = stressPreset === 'custom';

      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={styles.helper_text2}>
            Choose a stress preset. Select Custom to unlock manual edits.
          </Typography>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: 'conservative', label: 'Conservative' },
                { key: 'base', label: 'Base' },
                { key: 'aggressive', label: 'Aggressive' },
                { key: 'custom', label: 'Custom' }
              ] as { key: StressPresetKey; label: string }[]
            ).map((preset) => (
              <Button
                key={preset.key}
                type="button"
                variant={stressPreset === preset.key ? 'contained' : 'outlined'}
                className={
                  stressPreset === preset.key
                    ? 'bg-[#9747FF] text-white hover:bg-[#5500c4]'
                    : ''
                }
                onClick={() => setStressPreset(preset.key)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <TextField
              label="Stress Test Vacancy (%)"
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              InputProps={{ readOnly: !isCustomPreset }}
              InputLabelProps={{ shrink: true }}
              {...register('multifamilySetup.riskAndNotes.stressVacancyPct', {
                valueAsNumber: true
              })}
            />
            <TextField
              label="Stress Test Exit Cap (%)"
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              InputProps={{ readOnly: !isCustomPreset }}
              InputLabelProps={{ shrink: true }}
              {...register('multifamilySetup.riskAndNotes.stressExitCapRatePct', {
                valueAsNumber: true
              })}
            />
            <TextField
              label="Stress Test Interest Rate (%)"
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              InputProps={{ readOnly: !isCustomPreset }}
              InputLabelProps={{ shrink: true }}
              {...register('multifamilySetup.riskAndNotes.stressInterestRatePct', {
                valueAsNumber: true
              })}
            />
            <TextField
              label="Downside NOI Change (%)"
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              InputProps={{ readOnly: !isCustomPreset }}
              InputLabelProps={{ shrink: true }}
              {...register('multifamilySetup.riskAndNotes.downsideNoiChangePct', {
                valueAsNumber: true
              })}
            />
          </div>
          <TextField
            label="Notes"
            size="small"
            multiline
            minRows={4}
            InputLabelProps={{ shrink: true }}
            {...register('multifamilySetup.riskAndNotes.notes')}
          />
        </div>
      );
    }

    return (
      <Typography className={styles.helper_text2}>
        Defaults tab content is not available yet.
      </Typography>
    );
  };

  return (
    <div className="grow flex w-full max-w-full flex-col overflow-x-hidden px-4 pt-8">
      <Typography className={clsx([styles.header, 'mb-2'])}>{title}</Typography>
      <Typography className={clsx([styles.helper_text2, 'mb-6'])}>
        {description}
      </Typography>

      {mode === 'setup' && (
        <Typography className={clsx([styles.helper_text2, 'mb-4'])}>
          Defaults are used only when listing and documents do not provide a value.
        </Typography>
      )}

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

      <div className="mt-4 max-w-full overflow-x-hidden rounded-lg border border-dashed border-gray-300 bg-white/70 p-4 md:p-6 [&_.MuiFormControl-root]:w-full">
        <Typography className={clsx([styles.subheader, 'mb-2'])}>
          {selectedTab}
        </Typography>
        {mode === 'criteria' ? renderCriteriaTabContent() : renderSetupTabContent()}
      </div>
    </div>
  );
};

export default MultifamilyTabsSkeleton;
