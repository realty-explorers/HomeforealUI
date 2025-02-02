import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import { Switch, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../OfferDialog.module.scss';

type OfferingPropertyDescriptionProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingPropertyDescription = ({
  register,
  control,
  watch,
  errors
}: OfferingPropertyDescriptionProps) => {
  const [writeDescriptionNow, setWriteDescriptionNow] = useState(false);
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Terms and Conditions
      </Typography>

      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Do you want to conduct an inspection?
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyTerms.conductInspection"
        className="m-0"
      />
      {watch('propertyTerms.conductInspection') && (
        <>
          <Typography className={clsx([styles.subheader, 'col-span-1'])}>
            Is this contract contingent upon inspection?
          </Typography>

          <SwitchField
            control={control}
            fieldName="propertyTerms.isInspectionContingent"
            className="m-0"
          />

          <Typography className={clsx([styles.subheader, 'col-span-1'])}>
            How many inspection days
          </Typography>

          <TextField
            label="Inspection Duration (days)"
            variant="outlined"
            size="small"
            type="number"
            {...register('propertyTerms.inspectionDurationDays')}
            className="col-start-1 lg:col-start-2"
            helperText={errors?.propertyTerms?.inspectionDurationDays?.message}
            error={!!errors?.propertyTerms?.inspectionDurationDays}
          />
        </>
      )}
      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Is the property subject to a lease?
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyTerms.lease"
        className="m-0"
      />
    </>
  );
};

export default OfferingPropertyDescription;
