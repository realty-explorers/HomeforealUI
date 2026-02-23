import { Button, Slider, Tab, Tabs, TextField, Typography } from '@mui/material';
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
  avgSqft: 0
};

const rankingWeightFields = [
  { key: 'beds', label: 'Beds relevance weight' },
  { key: 'baths', label: 'Baths relevance weight' },
  { key: 'area', label: 'Area relevance weight' },
  { key: 'lotArea', label: 'Lot area relevance weight' },
  { key: 'yearBuilt', label: 'Year built relevance weight' },
  { key: 'distance', label: 'Distance relevance weight' },
  { key: 'listDate', label: 'Listing recency relevance weight' }
] as const;

type RankingWeightFieldKey = (typeof rankingWeightFields)[number]['key'];

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
    stressVacancyPct: 12,
    stressExitCapRatePct: 2,
    stressInterestRatePct: 2,
    downsideNoiChangePct: 12
  },
  base: {
    stressVacancyPct: 8,
    stressExitCapRatePct: 1,
    stressInterestRatePct: 1,
    downsideNoiChangePct: 8
  },
  aggressive: {
    stressVacancyPct: 4,
    stressExitCapRatePct: 0.5,
    stressInterestRatePct: 0.5,
    downsideNoiChangePct: 4
  }
};

type IncomeDefaultsPresetKey = 'conservative' | 'base' | 'aggressive';

const incomeDefaultsPresetValues: Record<
  IncomeDefaultsPresetKey,
  {
    vacancyLossPct: number;
    badDebtPct: number;
    concessionsPct: number;
  }
> = {
  conservative: {
    vacancyLossPct: 8,
    badDebtPct: 4,
    concessionsPct: 4
  },
  base: {
    vacancyLossPct: 6,
    badDebtPct: 2,
    concessionsPct: 2
  },
  aggressive: {
    vacancyLossPct: 4,
    badDebtPct: 1,
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

  const rankingWeightTotal = rankingWeightFields.reduce((sum, field) => {
    const value = Number(watch(`weights.${field.key}`) ?? 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const isWeightTotalBalanced = Math.abs(rankingWeightTotal - 100) < 0.01;

  const occupancyBandLow = asFiniteNumber(
    watch('multifamilyCriteria.rentRoll.economicOccupancyPct'),
    85
  );
  const occupancyBandHigh = asFiniteNumber(
    watch('multifamilyCriteria.rentRoll.physicalOccupancyPct'),
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

    setValue(
      'multifamilyCriteria.rentRoll.economicOccupancyPct',
      normalizedEconomicPct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
    setValue(
      'multifamilyCriteria.rentRoll.physicalOccupancyPct',
      normalizedPhysicalPct,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );
  };

  const applyIncomeDefaultsPreset = (preset: IncomeDefaultsPresetKey) => {
    const presetValues = incomeDefaultsPresetValues[preset];

    setValue('multifamilyCriteria.income.vacancyLossPct', presetValues.vacancyLossPct, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue('multifamilyCriteria.income.badDebtPct', presetValues.badDebtPct, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue('multifamilyCriteria.rentRoll.concessionsPct', presetValues.concessionsPct, {
      shouldDirty: true,
      shouldValidate: true
    });
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

  const applyNormalizedRankingWeights = (
    weights: Partial<Record<RankingWeightFieldKey, unknown>>
  ) => {
    const normalizedWeights = normalizeRankingWeights(weights);

    rankingWeightFields.forEach((rankingField) => {
      setValue(`weights.${rankingField.key}`, normalizedWeights[rankingField.key], {
        shouldDirty: true,
        shouldValidate: true
      });
    });
  };

  const handleNormalizeWeights = () => {
    const currentWeights = (watch('weights') || {}) as Partial<
      Record<RankingWeightFieldKey, unknown>
    >;
    applyNormalizedRankingWeights(currentWeights);
  };

  const renderCriteriaTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Occupancy and baseline filters
          </Typography>
          <Typography className={styles.helper_text2}>
            Use these discovery inputs to narrow opportunities before ranking.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <Typography className="text-sm font-medium text-gray-700">
                  Occupancy target band (Economic to Physical)
                </Typography>
                <Typography className="text-sm font-semibold text-sky-700">
                  {occupancyBand[0].toFixed(1)}% - {occupancyBand[1].toFixed(1)}%
                </Typography>
              </div>
              <Typography className={clsx([styles.helper_text2, 'mb-2'])}>
                Drag both handles to define lower and upper occupancy bounds quickly.
              </Typography>
              <div className="mb-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => setOccupancyBand(90, 96)}
                >
                  Stabilized
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => setOccupancyBand(82, 92)}
                >
                  Value-Add
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => setOccupancyBand(72, 86)}
                >
                  Heavy Lift
                </Button>
              </div>
              <Slider
                min={60}
                max={100}
                step={0.5}
                disableSwap
                value={occupancyBand}
                getAriaLabel={(index) =>
                  index === 0
                    ? 'Economic occupancy lower bound'
                    : 'Physical occupancy upper bound'
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
            {renderSliderField({
              label: 'Concessions tolerance',
              fieldPath: 'multifamilyCriteria.rentRoll.concessionsPct',
              min: 0,
              max: 20,
              step: 0.5,
              quickValues: [0, 2, 4, 6, 8]
            })}
            <TextField
              label="Other Income (Monthly)"
              size="small"
              type="number"
              {...register('multifamilyCriteria.rentRoll.otherIncomeMonthly', {
                valueAsNumber: true
              })}
            />
            <TextField
              label="Gross Scheduled Rent (Annual)"
              size="small"
              type="number"
              {...register('multifamilyCriteria.income.grossScheduledRentAnnual', {
                valueAsNumber: true
              })}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 1) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Unit mix preferences
          </Typography>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid w-full grid-cols-1 gap-3 md:grid-cols-[1fr_8rem_10rem_10rem_auto]"
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
      );
    }

    if (activeTab === 2) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Deal quality gates
          </Typography>
          <Typography className={styles.helper_text2}>
            Apply conservative quality thresholds before opportunities are scored.
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderSliderField({
              label: 'Maximum Vacancy Loss',
              fieldPath: 'multifamilyCriteria.income.vacancyLossPct',
              min: 0,
              max: 30,
              step: 0.5,
              quickValues: [3, 5, 8, 12]
            })}
            {renderSliderField({
              label: 'Maximum Bad Debt',
              fieldPath: 'multifamilyCriteria.income.badDebtPct',
              min: 0,
              max: 20,
              step: 0.5,
              quickValues: [1, 2, 4, 6]
            })}
            {renderSliderField({
              label: 'Maximum Management Fee',
              fieldPath: 'multifamilyCriteria.expenses.managementFeePct',
              min: 0,
              max: 20,
              step: 0.5,
              quickValues: [2, 3, 5, 8]
            })}
            {renderSliderField({
              label: 'Minimum Utility Reimbursement',
              fieldPath: 'multifamilyCriteria.utilities.reimbursementPct',
              min: 0,
              max: 100,
              step: 1,
              quickValues: [0, 25, 50, 75]
            })}
            <TextField
              label="Minimum Other Income (Annual)"
              size="small"
              type="number"
              {...register('multifamilyCriteria.income.otherIncomeAnnual', {
                valueAsNumber: true
              })}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 3) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Ranking weights
          </Typography>
          <Typography className={styles.helper_text2}>
            Tune legacy ranking signals used to prioritize multifamily opportunities.
          </Typography>
          <Typography
            data-testid="ranking-weight-total"
            className={clsx([
              styles.helper_text2,
              isWeightTotalBalanced ? 'text-emerald-700' : 'text-amber-700'
            ])}
          >
            Total weight: {rankingWeightTotal.toFixed(2)} / 100
          </Typography>
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
                    {asFiniteNumber(watch(`weights.${field.key}`), 0).toFixed(1)}%
                  </Typography>
                </div>
                <Controller
                  name={`weights.${field.key}` as any}
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
                        const currentWeights = (watch('weights') || {}) as Partial<
                          Record<RankingWeightFieldKey, unknown>
                        >;
                        const nextWeights = {
                          ...currentWeights,
                          [field.key]: sanitizedValue
                        };
                        const nextTotal = rankingWeightFields.reduce(
                          (sum, rankingField) =>
                            sum + sanitizeWeightValue(nextWeights[rankingField.key]),
                          0
                        );

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
        <div className="flex flex-col gap-y-3">
          <Typography className={styles.helper_text2}>
            Pick a preset to populate common defaults, then fine-tune with sliders.
          </Typography>
          <div className="flex flex-wrap gap-2">
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
              label: 'Bad Debt',
              fieldPath: 'multifamilyCriteria.income.badDebtPct',
              min: 0,
              max: 20,
              step: 0.5,
              quickValues: [1, 2, 4, 6]
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
              label="Other Income (Monthly)"
              size="small"
              type="number"
              {...register('multifamilyCriteria.rentRoll.otherIncomeMonthly', {
                valueAsNumber: true
              })}
            />
            <TextField
              label="Other Income (Annual)"
              size="small"
              type="number"
              {...register('multifamilyCriteria.income.otherIncomeAnnual', {
                valueAsNumber: true
              })}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 1) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Repairs & Maintenance (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.repairsMaintenanceAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Payroll (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.payrollAnnual', {
              valueAsNumber: true
            })}
          />
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
          {renderSliderField({
            label: 'Expense Contingency',
            fieldPath: 'multifamilySetup.renovationCapex.contingencyPct',
            min: 0,
            max: 25,
            step: 0.5,
            quickValues: [3, 5, 8, 12]
          })}
        </div>
      );
    }

    if (activeTab === 2) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Water/Sewer (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.utilities.waterSewerAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Trash (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.utilities.trashAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Electric (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.utilities.electricAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Gas (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.utilities.gasAnnual', {
              valueAsNumber: true
            })}
          />
          {renderSliderField({
            label: 'Utility Reimbursement',
            fieldPath: 'multifamilyCriteria.utilities.reimbursementPct',
            min: 0,
            max: 100,
            step: 1,
            quickValues: [0, 25, 50, 75]
          })}
        </div>
      );
    }

    if (activeTab === 3) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Property Taxes (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.propertyTaxesAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Insurance (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.insuranceAnnual', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 4) {
      return (
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
      );
    }

    if (activeTab === 5) {
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
          Defaults in this step are used only when listing and document values are
          missing.
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
