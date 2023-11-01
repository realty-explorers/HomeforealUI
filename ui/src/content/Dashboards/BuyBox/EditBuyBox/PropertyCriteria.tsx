import SwitchField from "@/components/Form/SwitchField";
import { defaults } from "@/schemas/defaults";
import { Slider, Switch, Typography } from "@mui/material";
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "./EditBuyBoxDialog.module.scss";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import RangeField from "@/components/Form/RangeField";
import clsx from "clsx";

type PropertyCriteriaProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};

const fields = [
  {
    title: "Property Types",
    fieldName: "property.Property Type",
    type: "boolean",
  },
  {
    title: "Bedrooms",
    fieldName: "property.Bedrooms",
    type: "range",
    min: defaults.bedrooms.min,
    max: defaults.bedrooms.max,
    step: defaults.bedrooms.step,
  },
  {
    title: "Bathrooms",
    fieldName: "property.Bathrooms",
    type: "range",
    min: defaults.bathrooms.min,
    max: defaults.bathrooms.max,
    step: defaults.bathrooms.step,
  },
  {
    title: "Building Sqft",
    fieldName: "property.Building sqft",
    type: "range",
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
  },
  {
    title: "Lot Size",
    fieldName: "property.Lot sqft",
    type: "range",
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
  },
  {
    title: "Year Built",
    fieldName: "property.Year Built",
    type: "range",
    min: defaults.yearBuilt.min,
    max: defaults.yearBuilt.max,
    step: defaults.yearBuilt.step,
  },
  {
    title: "Pool",
    fieldName: "property.Pool",
    type: "boolean",
  },
  {
    title: "Garages",
    fieldName: "property.Garages",
    type: "range",
    min: defaults.garages.min,
    max: defaults.garages.max,
    step: defaults.garages.step,
  },
  {
    title: "Listing Price",
    fieldName: "property.Listing Price",
    type: "range",
    min: defaults.listingPrice.min,
    max: defaults.listingPrice.max,
    step: defaults.listingPrice.step,
  },
];
const PropertyCriteria = (
  { register, control, watch, setValue, getValues }: PropertyCriteriaProps,
) => {
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Property Criteria
      </Typography>
      {fields.map((field, index) => {
        if (field.type === "range") {
          return (
            <>
              <div
                className={clsx([
                  "flex w-full item-center",
                ])}
              >
                <SwitchField
                  fieldName={`${field.fieldName}.0`}
                  control={control}
                  // disabled={!watch(`${group.fieldName}`)}
                />
                <Typography className={styles.label}>
                  {field.title}
                </Typography>
              </div>
              <RangeField
                key={index}
                watch={watch}
                min={field.min}
                max={field.max}
                step={field.step}
                fieldName={`${field.fieldName}.1`}
                setValue={setValue}
                getValues={getValues}
                disabled={!watch(`${field.fieldName}.0`)}
              />
            </>
            // <RangeField
            //   key={index}
            //   register={register}
            //   control={control}
            //   watch={watch}
            //   fieldName={field.fieldName}
            //   title={field.title}
            //   min={field.min}
            //   max={field.max}
            //   step={field.step}
            // />
          );
        } else if (field.type === "boolean") {
          return (
            <div key={index} className="flex w-full item-center col-span-2">
              <SwitchField fieldName={field.fieldName} control={control} />
              <Typography className={styles.label}>{field.title}</Typography>
            </div>
          );
        }
      })}
    </>
  );
};

export default PropertyCriteria;
