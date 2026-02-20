import { Button, Tab, Tabs, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
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

const MultifamilyTabsSkeleton = ({
  title,
  description,
  tabs,
  mode
}: MultifamilyTabsSkeletonProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const selectedTab = tabs[activeTab] || 'Multifamily Tab';
  const { control, register } = useFormContext<any>();
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

  const renderCriteriaTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="flex flex-col gap-y-3">
          <Typography className={clsx([styles.subheader, 'mb-1'])}>
            Unit Mix
          </Typography>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_8rem_10rem_10rem_auto]"
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

    if (activeTab === 1) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Physical Occupancy (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.rentRoll.physicalOccupancyPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Economic Occupancy (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.rentRoll.economicOccupancyPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Concessions (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.rentRoll.concessionsPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Other Income (Monthly)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.rentRoll.otherIncomeMonthly', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 2) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Gross Scheduled Rent (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.income.grossScheduledRentAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Vacancy Loss (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.income.vacancyLossPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Bad Debt (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.income.badDebtPct', {
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
          <TextField
            label="Repairs & Maintenance (Annual)"
            size="small"
            type="number"
            {...register(
              'multifamilyCriteria.expenses.repairsMaintenanceAnnual',
              {
                valueAsNumber: true
              }
            )}
          />
          <TextField
            label="Payroll (Annual)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.payrollAnnual', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Management Fee (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.expenses.managementFeePct', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 4) {
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
          <TextField
            label="Utility Reimbursement (%)"
            size="small"
            type="number"
            {...register('multifamilyCriteria.utilities.reimbursementPct', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    return (
      <Typography className={styles.helper_text2}>
        Tab content will be implemented in the next step.
      </Typography>
    );
  };

  const renderSetupTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Purchase Price"
            size="small"
            type="number"
            {...register('multifamilySetup.capitalStack.purchasePrice', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Closing Costs (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.capitalStack.closingCostsPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Equity (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.capitalStack.equityPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Preferred Return (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.capitalStack.preferredReturnPct', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 1) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Interest Rate (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.loanAssumptions.interestRatePct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Loan-to-Value (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.loanAssumptions.ltvPct', {
              valueAsNumber: true
            })}
          />
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
          <TextField
            label="Minimum DSCR"
            size="small"
            type="number"
            {...register('multifamilySetup.loanAssumptions.minimumDscr', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 2) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Interior Renovation Budget"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.interiorBudget', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Exterior Renovation Budget"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.exteriorBudget', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Common Area Budget"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.commonAreaBudget', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Contingency (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.contingencyPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="CapEx Reserve / Unit / Year"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.capexReservePerUnit', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Renovation Timeline (Months)"
            size="small"
            type="number"
            {...register('multifamilySetup.renovationCapex.timelineMonths', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 3) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Hold Period (Years)"
            size="small"
            type="number"
            {...register('multifamilySetup.exitScenario.holdPeriodYears', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Exit Cap Rate (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.exitScenario.exitCapRatePct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Annual Rent Growth (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.exitScenario.annualRentGrowthPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Annual Expense Growth (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.exitScenario.annualExpenseGrowthPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Selling Costs (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.exitScenario.sellingCostsPct', {
              valueAsNumber: true
            })}
          />
        </div>
      );
    }

    if (activeTab === 4) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextField
            label="Stress Test Vacancy (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.riskAndNotes.stressVacancyPct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Stress Test Exit Cap (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.riskAndNotes.stressExitCapRatePct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Stress Test Interest Rate (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.riskAndNotes.stressInterestRatePct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Downside NOI Change (%)"
            size="small"
            type="number"
            {...register('multifamilySetup.riskAndNotes.downsideNoiChangePct', {
              valueAsNumber: true
            })}
          />
          <TextField
            label="Notes"
            size="small"
            multiline
            minRows={4}
            className="md:col-span-2"
            {...register('multifamilySetup.riskAndNotes.notes')}
          />
        </div>
      );
    }

    return (
      <Typography className={styles.helper_text2}>
        Setup tab content will be implemented in the next step.
      </Typography>
    );
  };

  return (
    <div className="grow w-full px-4 pt-8 flex flex-col">
      <Typography className={clsx([styles.header, 'mb-2'])}>{title}</Typography>
      <Typography className={clsx([styles.helper_text2, 'mb-6'])}>
        {description}
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        {tabs.map((tabLabel, index) => (
          <Tab key={tabLabel} label={`${index + 1}. ${tabLabel}`} />
        ))}
      </Tabs>

      <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white/70 p-6">
        <Typography className={clsx([styles.subheader, 'mb-2'])}>
          {selectedTab}
        </Typography>
        {mode === 'criteria' ? renderCriteriaTabContent() : renderSetupTabContent()}
      </div>
    </div>
  );
};

export default MultifamilyTabsSkeleton;
