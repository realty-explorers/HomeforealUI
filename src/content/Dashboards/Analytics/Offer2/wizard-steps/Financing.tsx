import React from 'react';
import { motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';
import FormField from '@/components/FormField';
import CurrencyInput from '@/components/CurrencyInput';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import PercentageInput from '@/components/PercentageInput';

const Financing: React.FC<{
  selectedTemplateId: string | null;
  selectTemplate: (id: string | null) => void;
}> = () => {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    getValues,
    control
  } = useFormContext<OfferFormData>();

  const financingType = watch('financialDetails.financingType');
  const purchasePrice = watch('financialDetails.purchasePrice');

  const handleFinancingTypeChange = (value: string) => {
    if (value !== 'Other') {
      setValue('financialDetails.financingTypeOther', undefined);
    }
    setValue(
      'financialDetails.financingType',
      value as 'Cash' | 'Loan' | 'Other',
      {
        shouldValidate: true
      }
    );
  };

  const depositAmount = watch('deposit.depositAmount');

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
                  <RadioGroupItem value="Loan" id="loan" />
                  <Label htmlFor="loan" className="cursor-pointer">
                    Loan
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

            {financingType === 'Other' && (
              <FormField
                id="financialDetails.otherDescription"
                label="Describe your financing method"
                error={
                  errors.financialDetails?.financingTypeOther?.message as string
                }
              >
                <Input
                  id="financialDetails.otherDescription"
                  placeholder="Enter description"
                  {...register('financialDetails.financingTypeOther')}
                  className={
                    errors.financialDetails?.financingTypeOther
                      ? 'border-red-500'
                      : ''
                  }
                />
              </FormField>
            )}
            {financingType === 'Loan' && (
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
            <div className="flex items-end w-full justify-between gap-x-4">
              <FormField
                id="deposit.depositAmount"
                className="w-full"
                label="Deposit Amount"
                error={errors.deposit?.depositAmount?.message as string}
              >
                <CurrencyInput
                  id="deposit.depositAmount"
                  value={depositAmount || 0}
                  onChange={(value) =>
                    setValue('deposit.depositAmount', value, {
                      shouldValidate: true
                    })
                  }
                  error={!!errors.deposit?.depositAmount}
                />
              </FormField>

              <FormField
                id="deposit.depositAmount"
                className="w-full"
                label="Deposit Percentage"
                error={errors.deposit?.depositAmount?.message as string}
              >
                <PercentageInput
                  id="deposit.depositAmount"
                  key={`percent-${depositAmount}-${purchasePrice}`}
                  value={
                    purchasePrice > 0
                      ? (depositAmount / purchasePrice) * 100
                      : 0
                  }
                  onChange={(value) =>
                    setValue(
                      'deposit.depositAmount',
                      (value / 100) * purchasePrice,

                      {
                        shouldValidate: true
                      }
                    )
                  }
                  error={!!errors.deposit?.depositAmount}
                />
              </FormField>
            </div>

            <FormField
              id="deposit.holderName"
              label="Deposit Holder Name"
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
