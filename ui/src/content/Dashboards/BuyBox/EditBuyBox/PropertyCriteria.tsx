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
import AutocompleteField from "@/components/Form/AutocompleteField";

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
    fieldName: "property.Property Types",
    type: "select",
    options: [
      "Single Family",
      // { label: "Multi Family", value: "Multi Family" },
      // { label: "Condo", value: "Condo" },
      // { label: "Townhouse", value: "Townhouse" },
    ],
    multiple: true,
  },

  {
    title: "Pool",
    fieldName: "property.Pool",
    type: "select",
    options: [
      "With",
      "Without",
    ],
    multiple: false,
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
    formatLabelAsNumber: true,
  },
  {
    title: "Lot Size",
    fieldName: "property.Lot sqft",
    type: "range",
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
    formatLabelAsNumber: true,
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
    prefix: "$",
    formatLabelAsNumber: true,
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
                min={field.min}
                max={field.max}
                step={field.step}
                prefix={field.prefix}
                postfix={field.postfix}
                formatLabelAsNumber={field.formatLabelAsNumber}
                fieldName={`${field.fieldName}.1`}
                setValue={setValue}
                getValues={getValues}
                disabled={!watch(`${field.fieldName}.0`)}
              />
            </>
          );
        } else if (field.type === "select") {
          return (
            <div
              key={index}
              className="flex w-full items-center justify-center col-span-2 mb-2"
            >
              <SwitchField
                fieldName={`${field.fieldName}.0`}
                control={control}
              />
              <AutocompleteField
                label={field.title}
                options={field.options}
                multiple={field.multiple}
                setValue={setValue}
                getValues={getValues}
                fieldName={`${field.fieldName}.1`}
                disabled={!watch(`${field.fieldName}.0`)}
              />
            </div>
          );
        }
      })}
    </>
  );
};

export default PropertyCriteria;
