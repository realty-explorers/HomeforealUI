import { Slider, Switch, Typography } from "@mui/material";
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
} from "react-hook-form";
import styles from "./EditBuyBoxDialog.module.scss";
import { RangeField } from "./RangeField";
import { buyboxSchemaType } from "./Schemas";

type PropertyCriteriaProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
};
const PropertyCriteria = (
  { register, control, watch }: PropertyCriteriaProps,
) => {
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Property Criteria
      </Typography>
      <div className="flex w-full item-center ">
        <Switch {...register("propertyType.active")} />
        <Typography className={styles.label}>Property Types</Typography>
      </div>
      <div></div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`bedrooms`}
        title="Bedrooms"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`bathrooms`}
        title="Bathrooms"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`yearBuilt`}
        title="Bedrooms"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`buildingSqft`}
        title="Building Sqft"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`lotSqft`}
        title="Lot Size"
      />

      <div className="flex w-full item-center col-span-2">
        <Switch {...register("pool")} />
        <Typography className={styles.label}>Pool</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`garages`}
        title="Garages"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`listingPrice`}
        title="Listing Price"
      />
    </>
  );
};

export default PropertyCriteria;
