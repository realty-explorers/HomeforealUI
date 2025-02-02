import { TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../OfferDialog.module.scss';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  financingTypeLabels,
  financingTypes,
  OfferSchemaType
} from '@/schemas/OfferSchemas';
import SwitchField from '@/components/Form/SwitchField';
import AutocompleteField from '@/components/Form/AutocompleteField';
import OfferingPrice from './SaleDetails/OfferingPrice';
import OfferingDesposit from './SaleDetails/OfferingDeposit';
import OfferingConditions from './SaleDetails/OfferingConditions';
import OfferingLandSurvey from './SaleDetails/OfferingLandSurvery';
import OfferingLegalDescription from './PropertyDetails/LegalDescription';
import OfferingPropertyDescription from './PropertyDetails/OfferingPropertyDescription';
import OfferingPropertyCondition from './PropertyDetails/OfferingPropertyCondition';

type OfferPropertyDetailsProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  setValue: UseFormSetValue<OfferSchemaType>;
  getValues: UseFormGetValues<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferPropertyDetails = ({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors
}: OfferPropertyDetailsProps) => {
  return (
    <div className={clsx(['flex justify-left px-4 pt-8 grow gap-x-4 over'])}>
      <div className="grid grid-cols-[auto_1fr] auto-rows-min items-center  gap-x-2  w-full gap-y-2">
        <OfferingLegalDescription
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
        <OfferingPropertyDescription
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
        <OfferingPropertyCondition
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default OfferPropertyDetails;
