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

type OfferFinancingProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  setValue: UseFormSetValue<OfferSchemaType>;
  getValues: UseFormGetValues<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferFinancing = ({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors
}: OfferFinancingProps) => {
  return (
    <div className={clsx(['flex px-4 pt-8 grow gap-x-4 over'])}>
      <div className="flex flex-col md:grid grid-cols-[auto_1fr] auto-rows-min md:items-center  gap-x-2  w-full gap-y-2">
        <OfferingPrice
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
        <OfferingDesposit
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
        <OfferingConditions
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
        <OfferingLandSurvey
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default OfferFinancing;
