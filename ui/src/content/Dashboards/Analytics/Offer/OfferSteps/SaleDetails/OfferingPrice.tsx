import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import { TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../OfferDialog.module.scss';

type OfferingPriceProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingPrice = ({
  register,
  control,
  watch,
  errors
}: OfferingPriceProps) => {
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Offering Price
      </Typography>
      <Typography className={clsx([styles.subheader])}>
        How much are you paying for the property?
      </Typography>

      <TextField
        label="Property Price Offer"
        variant="outlined"
        size="small"
        type="number"
        {...register('financialDetails.purchasePrice')}
        className=""
        helperText={errors?.financialDetails?.purchasePrice?.message}
        error={!!errors?.financialDetails?.purchasePrice}
      />

      <Typography className={clsx([styles.subheader])}>
        Do you require financing?
      </Typography>
      <SwitchField
        control={control}
        fieldName="financialDetails.requireFinancing"
        className="m-0"
      />
      {watch('financialDetails.requireFinancing') && (
        <>
          <Typography className={clsx([styles.subheader])}>
            Financing Type:
          </Typography>
          <AutocompleteField
            label="Financing Type"
            options={['BANK', 'SELLER']}
            multiple={false}
            control={control}
            fieldName="financialDetails.financingType"
            className=""
          />
          <Typography className={clsx([styles.subheader])}>
            How much is the loan?
          </Typography>

          <TextField
            label="Loan Amount"
            variant="outlined"
            size="small"
            type="number"
            {...register('financialDetails.loanAmount')}
            className=""
            helperText={errors?.financialDetails?.loanAmount?.message}
            error={!!errors?.financialDetails?.loanAmount}
          />
          {watch('financialDetails.financingType') === 'SELLER' && (
            <>
              <Typography className={clsx([styles.subheader])}>
                Interest Rate (If applicable)
              </Typography>

              <TextField
                label="Property Price Offer"
                variant="outlined"
                size="small"
                type="number"
                {...register('financialDetails.loanAmount')}
                className=""
                helperText={errors?.financialDetails?.interestRate?.message}
                error={!!errors?.financialDetails?.interestRate}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default OfferingPrice;
