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
        <Switch {...register("property.Property Type.0")} />
        <Typography className={styles.label}>Property Types</Typography>
      </div>
      <div></div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Bedrooms`}
        title="Bedrooms"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Bathrooms`}
        title="Bathrooms"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Building sqft`}
        title="Building Sqft"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Lot sqft`}
        title="Lot Size"
      />
      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Year Built`}
        title="Bedrooms"
      />

      <div className="flex w-full item-center col-span-2">
        <Switch {...register("property.Pool.0")} />
        <Typography className={styles.label}>Pool</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Garages`}
        title="Garages"
      />

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`property.Listing Price`}
        title="Listing Price"
      />
    </>
  );
};

export default PropertyCriteria;
