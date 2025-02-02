import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { financingTypeLabels, OfferSchemaType } from '@/schemas/OfferSchemas';
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
        className="col-start-1 lg:col-start-2"
        helperText={errors?.financialDetails?.purchasePrice?.message}
        error={!!errors?.financialDetails?.purchasePrice}
      />

      <>
        <Typography
          className={clsx([styles.subheader, 'col-span-2 lg:col-span-1'])}
        >
          Financing Type:
        </Typography>
        <AutocompleteField
          label="Financing Type"
          options={financingTypeLabels}
          multiple={false}
          control={control}
          fieldName="financialDetails.financingType"
          containerClassName="col-start-1 lg:col-start-2"
        />

        {watch('financialDetails.financingType') !== 'CASH' && (
          <>
            <Typography className={clsx([styles.subheader])}>
              How much is the loan?
            </Typography>
            <TextField
              label="Loan Amount"
              variant="outlined"
              size="small"
              type="number"
              {...register('financialDetails.loanAmount')}
              className="col-start-1 lg:col-start-2"
              helperText={errors?.financialDetails?.loanAmount?.message}
              error={!!errors?.financialDetails?.loanAmount}
            />
          </>
        )}
      </>
    </>
  );
};

export default OfferingPrice;
