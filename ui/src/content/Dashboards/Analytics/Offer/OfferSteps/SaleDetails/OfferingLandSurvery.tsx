import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType, surveyorChoiceLabels } from '@/schemas/OfferSchemas';
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

type OfferingLandSurveyProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingLandSurvey = ({
  register,
  control,
  watch,
  errors
}: OfferingLandSurveyProps) => {
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Land Survey
      </Typography>
      <Typography className={clsx([styles.subheader, 'col-span-1'])}>
        Will a new land survey be provided?
      </Typography>

      <SwitchField
        control={control}
        fieldName="landSurvey.requireNewSurvey"
        className="m-0"
      />

      <Typography
        className={clsx([styles.subheader, 'col-span-2 lg:col-span-1'])}
      >
        {watch('landSurvey.requireNewSurvey')
          ? 'Who pays if existing survey is unacceptable to lender?'
          : 'Who will pay for the land survey?'}
      </Typography>

      <AutocompleteField
        label="Paying Party"
        options={surveyorChoiceLabels}
        multiple={false}
        control={control}
        fieldName="landSurvey.surveyorChoice"
        className="col-start-1"
      />
    </>
  );
};

export default OfferingLandSurvey;
