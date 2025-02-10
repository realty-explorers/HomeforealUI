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

const buyerDetails: {
  label: string;
  fieldName: Path<OfferSchemaType>;
}[] = [
  {
    label: 'Buyer/Company Name',
    fieldName: 'buyerDetails.name'
  },

  {
    label: 'Buyer Address',
    fieldName: 'buyerDetails.address'
  },
  {
    label: 'Buyer Email',
    fieldName: 'buyerDetails.email'
  }
];

type OfferingBuyerDetailsProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingBuyerDetails = ({
  register,
  control,
  watch,
  errors
}: OfferingBuyerDetailsProps) => {
  const [writeDescriptionNow, setWriteDescriptionNow] = useState(false);
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Buyer Details
      </Typography>
      {buyerDetails.map(({ label, fieldName }, index) => (
        <TextField
          key={index}
          label={label}
          variant="outlined"
          size="small"
          {...register(fieldName)}
          className="col-start-1"
          helperText={errors?.buyerDetails?.[fieldName]?.message}
          error={!!errors?.buyerDetails?.[fieldName]}
        />
      ))}
    </>
  );
};

export default OfferingBuyerDetails;
