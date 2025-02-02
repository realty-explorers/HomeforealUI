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

type OfferingLegalDescriptionProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingLegalDescription = ({
  register,
  control,
  watch,
  errors
}: OfferingLegalDescriptionProps) => {
  const [writeDescriptionNow, setWriteDescriptionNow] = useState(false);
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Legal Description
      </Typography>
      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Would you like to add the property's legal description now?
      </Typography>

      <Switch
        className="m-0"
        checked={writeDescriptionNow}
        onChange={() => setWriteDescriptionNow(!writeDescriptionNow)}
      />
      {writeDescriptionNow && (
        <TextField
          label="Legal Description"
          variant="outlined"
          size="small"
          {...register('legalDescription.description')}
          helperText={errors?.legalDescription?.description?.message}
          error={!!errors?.legalDescription?.description}
        />
      )}
    </>
  );
};

export default OfferingLegalDescription;
