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
      <div className="flex flex-col md:grid grid-cols-[auto_1fr] auto-rows-min md:items-center  gap-x-2  w-full gap-y-2">
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
