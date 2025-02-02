import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import { Switch, TextField, Tooltip, Typography } from '@mui/material';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
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
const OfferingClosingPossession = ({
  register,
  control,
  watch,
  errors
}: OfferingBuyerDetailsProps) => {
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Closing and Possession
      </Typography>

      <Typography className={clsx([styles.subheader])}>
        When does the sale become final?
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        type="date"
        {...register('closingDetails.closingDate')}
        className="col-start-1 lg:col-start-2"
        helperText={errors?.closingDetails?.closingDate?.message}
        error={!!errors?.closingDetails?.closingDate}
      />

      <Typography className={clsx([styles.subheader])}>
        Will you take possession on the closing date?
        <Tooltip title="Typically, the buyer takes possession on the closing date.">
          <HelpOutlineOutlinedIcon className="text-gray-400" />
        </Tooltip>
      </Typography>

      <SwitchField
        control={control}
        fieldName="closingDetails.possesionOnClosing"
        className=""
      />

      <Typography className={clsx([styles.subheader])}>
        Will you have the option to terminate the contract after signing?
      </Typography>

      <SwitchField
        control={control}
        fieldName="closingDetails.optionToTerminate"
        className=""
      />

      <Typography className={clsx([styles.subheader])}>
        Would you like to add other terms or information?
      </Typography>

      <TextField
        label="Additional Terms"
        variant="outlined"
        multiline
        rows={4}
        {...register('closingDetails.additionalClause')}
        className="col-start-1"
        helperText={errors?.closingDetails?.additionalClause?.message}
        error={!!errors?.closingDetails?.additionalClause}
      />
    </>
  );
};

export default OfferingClosingPossession;
