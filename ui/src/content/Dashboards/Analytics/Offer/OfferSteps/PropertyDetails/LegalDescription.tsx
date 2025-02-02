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
  return <></>;
};

export default OfferingLegalDescription;
