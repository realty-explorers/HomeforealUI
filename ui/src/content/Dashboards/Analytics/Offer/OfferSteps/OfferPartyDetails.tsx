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
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import OfferingBuyerDetails from './PartiesDetails/OfferBuyerDetails';
import OfferingSettlementExpenses from './FinalSteps/OfferSettlementExpenses';

type OfferPartyDetailsProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  setValue: UseFormSetValue<OfferSchemaType>;
  getValues: UseFormGetValues<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferPartyDetails = ({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors
}: OfferPartyDetailsProps) => {
  return (
    <div className={clsx(['flex justify-left px-4 pt-8 grow gap-x-4 over'])}>
      <div className="grid grid-cols-[auto_1fr] auto-rows-min items-center  gap-x-2  w-full gap-y-2">
        <OfferingBuyerDetails
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default OfferPartyDetails;
