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

type OfferingConditionsProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingConditions = ({
  register,
  control,
  watch,
  errors
}: OfferingConditionsProps) => {
  const [isSubjectToSale, setIsSubjectToSale] = useState(false);
  const [isExludingFixtures, setIsExludingFixtures] = useState(false);
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Conditions
      </Typography>
      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Is this agreement subject to the sale of another property?
      </Typography>

      <Switch
        className="m-0"
        checked={isSubjectToSale}
        onChange={() => setIsSubjectToSale(!isSubjectToSale)}
      />
      {isSubjectToSale && (
        <TextField
          label="Property Address"
          variant="outlined"
          size="small"
          {...register('conditions.subjectProperty')}
          helperText={errors?.conditions?.subjectProperty?.message}
          error={!!errors?.conditions?.subjectProperty}
        />
      )}

      <Typography className={clsx([styles.subheader, 'col-start-1'])}>
        Will any fixtures be excluded from the sale?
      </Typography>
      <Switch
        className="m-0"
        checked={isExludingFixtures}
        onChange={() => setIsExludingFixtures(!isExludingFixtures)}
      />
      {isExludingFixtures && (
        <TextField
          label="Excluding Fixtures"
          variant="outlined"
          size="small"
          {...register('conditions.exludedFixtures')}
          helperText={errors?.conditions?.exludedFixtures?.message}
          error={!!errors?.conditions?.exludedFixtures}
        />
      )}
    </>
  );
};

export default OfferingConditions;
