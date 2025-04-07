import React from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '@/components/FormField';
import CurrencyInput from '@/components/CurrencyInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign, FileCheck } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import PercentageInput from '@/components/PercentageInput';
import { useWizardNavigation } from '@/contexts/WizardNavigationContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settlement: React.FC = () => {
  const { nextStep, prevStep } = useWizardNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue
  } = useFormContext<OfferFormData>();

  const allowTermination = watch('terminationOption.allowTermination');
  const optionToTerminate = watch('closingDetails.optionToTerminate');

  // Calculate total purchase price and deposit from formData
  const purchasePrice = watch('financialDetails.purchasePrice') || 0;
  const depositAmount = watch('deposit.depositAmount') || 0;

  // Calculate remaining amount

  // Prepare chart data

  const handleNext = async () => {
    // const isValid = await trigger(
    //   [
    //     'legalDescription.description',
    //     'propertyConditions.disclosureTopics.additionalDisclosures',
    //     'propertyConditions.sellerRepairs',
    //     'landSurvey.surveyorChoice'
    //   ],
    //   { shouldFocus: true }
    // );
    // if (isValid) {
    nextStep();
    // }
  };

  const onSubmit = () => handleNext();

  const handleClosingByDateChange = (value: string) => {
    const closingByDate = value === 'Date';
    setValue('closingDetails.closeByDate', closingByDate, {
      shouldValidate: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="wizard-title">Settlement & Closing</div>
      <p className="wizard-subtitle">
        Define settlement expenses and closing details
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Settlement Expenses Section */}
        <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-brand-main" />
            Settlement Expenses
          </h3>

          <div className="lg:flex gap-6">
            <div className="w-full space-y-4">
              <Controller
                name="settlementExpenses.sellerPaysFixedAmount"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col  justify-between rounded-lg border p-4 shadow-sm gap-y-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="sellerPaysSettlementExpenses">
                        Closing expenses paid by seller
                      </Label>
                    </div>
                    <div className="flex gap-x-4">
                      <p className="text-sm text-muted-foreground">Fixed</p>
                      <Switch
                        id="sellerPaysSettlementExpenses"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />

                      <p className="text-sm text-muted-foreground">
                        Percentage
                      </p>
                    </div>
                  </div>
                )}
              />

              {watch('settlementExpenses.sellerPaysFixedAmount') && (
                <Controller
                  name="settlementExpenses.sellerCostsPercentage"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="settlementAmount"
                      label="Maximum settlement amount paid by seller (%)"
                      error={
                        errors.settlementExpenses?.sellerCostsPercentage
                          ?.message
                      }
                    >
                      <PercentageInput
                        id="settlementAmount"
                        value={field.value || 0}
                        onChange={field.onChange}
                        error={
                          !!errors.settlementExpenses?.sellerCostsPercentage
                        }
                      />
                    </FormField>
                  )}
                />
              )}

              {!watch('settlementExpenses.sellerPaysFixedAmount') && (
                <Controller
                  name="settlementExpenses.sellerCostsFixed"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="settlementAmount"
                      label="Maximum settlement amount paid by seller ($)"
                      error={
                        errors.settlementExpenses?.sellerCostsFixed?.message
                      }
                    >
                      <CurrencyInput
                        id="settlementAmount"
                        value={field.value || 0}
                        onChange={field.onChange}
                        error={!!errors.settlementExpenses?.sellerCostsFixed}
                      />
                    </FormField>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Closing Details Section */}
        <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileCheck className="h-5 w-5 mr-2 text-brand-main" />
            Closing Details
          </h3>

          <FormField
            id="settlementAmount"
            label="Choose closing type"
            required
            error={errors.closingDetails?.closeByDate?.message}
          >
            <RadioGroup
              onValueChange={handleClosingByDateChange}
              value={watch('closingDetails.closeByDate') ? 'Date' : 'Days'}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Date" id="date" />
                <Label htmlFor="date" className="cursor-pointer">
                  Date
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Days" id="days" />
                <Label htmlFor="days" className="cursor-pointer">
                  Days
                </Label>
              </div>
            </RadioGroup>
          </FormField>

          <div className="space-y-4">
            {watch('closingDetails.closeByDate') ? (
              <Controller
                name="closingDetails.closingDate"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="closingDate"
                    label="Closing Date"
                    error={errors.closingDetails?.closingDate?.message}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={`w-full justify-start text-left font-normal ${
                            !field.value ? 'text-muted-foreground' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), 'PPP')
                            : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : '')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormField>
                )}
              />
            ) : (
              <Controller
                name="closingDetails.closingDeadline"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="closingDate"
                    label="Closing Date"
                    error={errors.closingDetails?.closingDeadline?.message}
                  >
                    <Input
                      id="terminationPeriodDays"
                      type="number"
                      placeholder="Enter number of days from contract execution"
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      className={
                        errors?.closingDetails?.closingDeadline
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  </FormField>
                )}
              />
            )}

            <Controller
              name="closingDetails.optionToTerminate"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="optionToTerminate">
                      Option to Terminate
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Include termination option in the offer?
                    </p>
                  </div>
                  <Switch
                    id="optionToTerminate"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />

            {optionToTerminate && (
              <div className="bg-brand-main/5 p-4 rounded-lg border border-brand-main/20 mt-4">
                <h4 className="text-md font-medium mb-3">
                  Termination Options
                </h4>

                <Controller
                  name="terminationOption.allowTermination"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-white">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowTermination">
                          Allow Termination
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow buyer to terminate within a specified period
                        </p>
                      </div>
                      <Switch
                        id="allowTermination"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {allowTermination && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Controller
                      name="terminationOption.terminationFee"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          id="terminationFee"
                          label="Termination Fee"
                          error={
                            errors.terminationOption?.terminationFee?.message
                          }
                        >
                          <CurrencyInput
                            id="terminationFee"
                            value={field.value || 0}
                            onChange={field.onChange}
                            error={!!errors.terminationOption?.terminationFee}
                          />
                        </FormField>
                      )}
                    />

                    <Controller
                      name="terminationOption.terminationPeriodDays"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          id="terminationPeriodDays"
                          label="Termination Period (Days)"
                          error={
                            errors.terminationOption?.terminationPeriodDays
                              ?.message
                          }
                        >
                          <Input
                            id="terminationPeriodDays"
                            type="number"
                            placeholder="Enter days"
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            className={
                              errors.terminationOption?.terminationPeriodDays
                                ? 'border-red-500'
                                : ''
                            }
                          />
                        </FormField>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            <Controller
              name="closingDetails.additionalClause"
              control={control}
              render={({ field }) => (
                <FormField
                  id="additionalClause"
                  label="Additional Closing Clauses"
                  error={errors.closingDetails?.additionalClause?.message}
                >
                  <Textarea
                    id="additionalClause"
                    placeholder="Enter any additional closing clauses"
                    {...field}
                    className={`min-h-[100px] ${
                      errors.closingDetails?.additionalClause
                        ? 'border-red-500'
                        : ''
                    }`}
                  />
                </FormField>
              )}
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Settlement;
