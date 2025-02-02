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
        Property Description
      </Typography>
      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Is the property subject to a lease?
      </Typography>

      <SwitchField
        control={control}
        fieldName="propertyDesciption.lease"
        className="m-0"
      />
    </>
  );
};

export default OfferingPropertyDescription;
