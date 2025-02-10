import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import { Switch, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import {
  Control,
  FieldErrors,
  Path,
  UseFormRegister,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../OfferDialog.module.scss';

type OfferingBuyerDetailsProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingSettlementExpenses = ({
  register,
  control,
  watch,
  errors
}: OfferingBuyerDetailsProps) => {
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Settlement Expenses
      </Typography>

      <Typography className={clsx([styles.subheader])}>
        Will the seller pay any of your expenses?
      </Typography>
      <SwitchField
        control={control}
        fieldName="settlementExpenses.sellerPaysSettlementExpenses"
        className="m-0"
      />
      {watch('settlementExpenses.sellerPaysSettlementExpenses') && (
        <TextField
          label="Seller Paid Expenses"
          variant="outlined"
          size="small"
          type="number"
          {...register('settlementExpenses.settlementAmount')}
          helperText={errors?.settlementExpenses?.settlementAmount?.message}
          error={!!errors?.settlementExpenses?.settlementAmount}
        />
      )}
    </>
  );
};

export default OfferingSettlementExpenses;
