import React from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import FormField from '@/components/FormField';
import CurrencyInput from '@/components/CurrencyInput';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';
import { OfferFormData } from '@/schemas/OfferSchemas';

const Financing: React.FC<{
  selectedTemplateId: string | null;
  selectTemplate: (id: string | null) => void;
}> = () => {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useFormContext<OfferFormData>();

  const financingType = watch('financialDetails.financingType');
  const purchasePrice = watch('financialDetails.purchasePrice');

  const handleFinancingTypeChange = (value: string) => {
    setValue(
      'financialDetails.financingType',
      value as 'Cash' | 'Mortgage' | 'Other',
      {
        shouldValidate: true
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="wizard-title">Financing & Deposit</div>
      <p className="wizard-subtitle">
        Enter purchase price, financing type and deposit details
      </p>

      <div className="space-y-6">
        {/* Financing Section */}
        <div className="p-5 rounded-lg bg-gray-50 border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-brand-main" />
            Purchase Price & Financing
          </h3>

          <div className="space-y-4">
            <FormField
              id="financialDetails.purchasePrice"
              label="Purchase Price"
              required
              error={errors.financialDetails?.purchasePrice?.message as string}
            >
              <CurrencyInput
                id="financialDetails.purchasePrice"
                value={watch('financialDetails.purchasePrice') || 0}
                onChange={(value) =>
                  setValue('financialDetails.purchasePrice', value, {
                    shouldValidate: true
                  })
                }
                error={!!errors.financialDetails?.purchasePrice}
              />
            </FormField>

            <FormField
              id="financialDetails.financingType"
              label="Financing Type"
              required
              error={errors.financialDetails?.financingType?.message as string}
            >
              <RadioGroup
                onValueChange={handleFinancingTypeChange}
                value={financingType || ''}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mortgage" id="mortgage" />
                  <Label htmlFor="mortgage" className="cursor-pointer">
                    Mortgage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </FormField>

            {(financingType === 'Mortgage' || financingType === 'Other') && (
              <FormField
                id="financialDetails.loanAmount"
                label="Loan Amount"
                error={errors.financialDetails?.loanAmount?.message as string}
              >
                <CurrencyInput
                  id="financialDetails.loanAmount"
                  value={watch('financialDetails.loanAmount') || 0}
                  onChange={(value) =>
                    setValue('financialDetails.loanAmount', value, {
                      shouldValidate: true
                    })
                  }
                  error={!!errors.financialDetails?.loanAmount}
                />
              </FormField>
            )}
          </div>
        </div>

        {/* Deposit Section */}
        <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-brand-main" />
            Deposit Details
          </h3>

          <div className="space-y-4">
            <FormField
              id="deposit.depositAmount"
              label="Deposit Amount"
              required
              tooltip={
                purchasePrice > 0
                  ? `${(
                      (watch('deposit.depositAmount') / purchasePrice) *
                      100
                    ).toFixed(1)}% of purchase price`
                  : undefined
              }
              error={errors.deposit?.depositAmount?.message as string}
            >
              <CurrencyInput
                id="deposit.depositAmount"
                value={watch('deposit.depositAmount') || 0}
                onChange={(value) =>
                  setValue('deposit.depositAmount', value, {
                    shouldValidate: true
                  })
                }
                error={!!errors.deposit?.depositAmount}
              />
            </FormField>

            <FormField
              id="deposit.holderName"
              label="Deposit Holder Name"
              required
              error={errors.deposit?.holderName?.message as string}
            >
              <Input
                id="deposit.holderName"
                placeholder="Enter holder name (e.g., escrow company)"
                {...register('deposit.holderName')}
                className={errors.deposit?.holderName ? 'border-red-500' : ''}
              />
            </FormField>

            <FormField
              id="deposit.holderAddress"
              label="Deposit Holder Address"
              required
              error={errors.deposit?.holderAddress?.message as string}
            >
              <Input
                id="deposit.holderAddress"
                placeholder="Enter holder address"
                {...register('deposit.holderAddress')}
                className={
                  errors.deposit?.holderAddress ? 'border-red-500' : ''
                }
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="deposit.holderPhone"
                label="Holder Phone"
                error={errors.deposit?.holderPhone?.message as string}
              >
                <Input
                  id="deposit.holderPhone"
                  placeholder="Enter holder phone"
                  {...register('deposit.holderPhone')}
                  className={
                    errors.deposit?.holderPhone ? 'border-red-500' : ''
                  }
                />
              </FormField>

              <FormField
                id="deposit.holderEmail"
                label="Holder Email"
                error={errors.deposit?.holderEmail?.message as string}
              >
                <Input
                  id="deposit.holderEmail"
                  type="email"
                  placeholder="Enter holder email"
                  {...register('deposit.holderEmail')}
                  className={
                    errors.deposit?.holderEmail ? 'border-red-500' : ''
                  }
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Financing;
