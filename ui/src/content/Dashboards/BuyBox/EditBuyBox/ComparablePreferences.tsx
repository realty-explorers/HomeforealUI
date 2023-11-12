import { sliderClasses } from "@mui/base";
import { Checkbox, Slider, Switch, Tab, Tabs, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useState } from "react";
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
// import { RangeField } from "./RangeField";
import RangeField from "@/components/Form/RangeField";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { defaultSimilarityFields } from "@/schemas/defaults";
import SwitchField from "@/components/Form/SwitchField";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  );
};

const similarityTypes = ["green", "yellow", "orange", "red"];
const similarityFields = [
  { fieldName: "Same Neighborhood", type: "boolean" },
  { fieldName: "Same Property Type", type: "boolean" },
  { fieldName: "Same Pool Status", type: "boolean" },
  {
    fieldName: "Bedrooms",
    type: "range",
    min: defaultSimilarityFields.bedrooms.min,
    max: defaultSimilarityFields.bedrooms.max,
    step: defaultSimilarityFields.bedrooms.step,
  },
  {
    fieldName: "Bathrooms",
    type: "range",
    min: defaultSimilarityFields.bathrooms.min,
    max: defaultSimilarityFields.bathrooms.max,
    step: defaultSimilarityFields.bathrooms.step,
  },
  {
    fieldName: "Building sqft",
    type: "range",
    min: defaultSimilarityFields.area.min,
    max: defaultSimilarityFields.area.max,
    step: defaultSimilarityFields.area.step,
    postfix: "%",
  },
  {
    fieldName: "Year Built",
    type: "range",
    min: defaultSimilarityFields.yearBuilt.min,
    max: defaultSimilarityFields.yearBuilt.max,
    step: defaultSimilarityFields.yearBuilt.step,
  },
  {
    fieldName: "Lot sqft",
    type: "range",
    min: defaultSimilarityFields.lotSize.min,
    max: defaultSimilarityFields.lotSize.max,
    step: defaultSimilarityFields.lotSize.step,
    formatLabelAsNumber: true,
    postfix: "%",
  },
  {
    fieldName: "Garages",
    type: "range",
    min: defaultSimilarityFields.garages.min,
    max: defaultSimilarityFields.garages.max,
    step: defaultSimilarityFields.garages.step,
  },
  {
    fieldName: "Distance",
    type: "range",
    min: defaultSimilarityFields.distance.min,
    max: defaultSimilarityFields.distance.max,
    step: defaultSimilarityFields.distance.step,
    postfix: "mi",
  },
  {
    fieldName: "Sale Date",
    type: "range",
    min: defaultSimilarityFields.saleDate.min,
    max: defaultSimilarityFields.saleDate.max,
    step: defaultSimilarityFields.saleDate.step,
    postfix: "months",
  },
];

type ComparablePreferencesProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const ComparablePreferences = (
  { register, control, watch, setValue, getValues }: ComparablePreferencesProps,
) => {
  const [tab, setTab] = useState(0);
  // const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Comparable Preferences
      </Typography>
      <div className="col-span-2">
        <Tabs
          value={tab}
          onChange={handleChange}
          centered
        >
          <Tab label="Green" />
          <Tab label="Yellow" />
          <Tab label="Orange" />
          <Tab label="Red" />
        </Tabs>
      </div>
      {similarityTypes.map((similarityType, index) => {
        return (
          <React.Fragment key={index}>
            {similarityFields.map((similarityField, idx) => {
              return index === tab && (
                similarityField.type === "boolean"
                  ? (
                    <div
                      key={idx}
                      className={clsx([
                        "flex w-full item-center col-span-2",
                      ])}
                    >
                      <Controller
                        name={`similarity.${similarityType}.${similarityField.fieldName}`}
                        control={control}
                        render={({ field: { value, ...field } }) => (
                          <Switch
                            {...field}
                            checked={!!value}
                          />
                        )}
                      />
                      <Typography className={styles.label}>
                        {similarityField.fieldName}
                      </Typography>
                      {" "}
                    </div>
                  )
                  : (
                    <>
                      <div
                        className={clsx([
                          " w-full item-center",
                          index === tab ? "flex" : "hidden",
                        ])}
                      >
                        <SwitchField
                          fieldName={`similarity.${similarityType}.${similarityField.fieldName}.0`}
                          control={control}
                          // disabled={!watch(`${group.fieldName}`)}
                        />
                        <Typography className={styles.label}>
                          {similarityField.fieldName}
                        </Typography>
                      </div>
                      <RangeField
                        key={index}
                        min={similarityField.min}
                        max={similarityField.max}
                        step={similarityField.step}
                        // prefix={similarityField.prefix}
                        postfix={similarityField.postfix}
                        formatLabelAsNumber={similarityField
                          .formatLabelAsNumber}
                        fieldName={`similarity.${similarityType}.${similarityField.fieldName}.1`}
                        setValue={setValue}
                        getValues={getValues}
                        disabled={!watch(
                          `similarity.${similarityType}.${similarityField.fieldName}.0`,
                        )}
                        className={clsx([
                          index === tab ? "" : "hidden",
                        ])}
                      />
                    </>
                    // <RangeField
                    //   key={idx}
                    //   register={register}
                    //   control={control}
                    //   watch={watch}
                    //   fieldName={`similarity.${similarityType}.${similarityField.fieldName}`}
                    //   title={similarityField.fieldName}
                    //   labelClass={index === value ? "" : "hidden"}
                    //   sliderClass={index === value ? "" : "hidden"}
                    //   min={similarityField.min}
                    //   max={similarityField.max}
                    //   step={similarityField.step}
                    // />
                  )
              );
            })}
            {index === tab &&
              (
                <>
                  <div
                    className={clsx([
                      " w-full item-center ml-14",
                      index === tab ? "flex" : "hidden",
                    ])}
                  >
                    <Typography className={styles.label}>
                      Similarity Weight
                    </Typography>
                  </div>
                  <RangeField
                    key={index}
                    min={0}
                    max={1}
                    step={0.01}
                    fieldName={`similarity_weights.${similarityType}`}
                    setValue={setValue}
                    getValues={getValues}
                    className={clsx([
                      index === tab ? "" : "hidden",
                    ])}
                  />
                </>
              )}
          </React.Fragment>
        );
      })}
      {/* {similarityTypes.map((similartyType, index) => { */}
      {/*   return ( */}
      {/*     ( */}
      {/*       <React.Fragment key={index}> */}
      {/*         <div */}
      {/*           className={clsx([ */}
      {/*             "flex w-full item-center col-span-2", */}
      {/*             index === value ? "" : "hidden", */}
      {/*           ])} */}
      {/*         > */}
      {/*           <Switch {...register(`${similartyType}.samePropertyType`)} /> */}
      {/*           <Typography className={styles.label}> */}
      {/*             Same Property Type */}
      {/*           </Typography> */}
      {/*         </div> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.bedrooms`} */}
      {/*           title="Bedrooms" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.bathrooms`} */}
      {/*           title="Bathrooms" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.yearBuilt`} */}
      {/*           title="Year Built" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.buildingSqft`} */}
      {/*           title="Building Sqft" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.lotSize`} */}
      {/*           title="Lot Size" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <div */}
      {/*           className={clsx([ */}
      {/*             "flex w-full item-center col-span-2", */}
      {/*             index === value ? "" : "hidden", */}
      {/*           ])} */}
      {/*         > */}
      {/*           <Switch {...register(`${similartyType}.samePool`)} /> */}
      {/*           <Typography className={styles.label}>Same Pool</Typography> */}
      {/*         </div> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.garages`} */}
      {/*           title="Garages" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.distance`} */}
      {/*           title="Distance" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.saleDate`} */}
      {/*           title="Sale Date" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.weight`} */}
      {/*           title="Weight" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*       </React.Fragment> */}
      {/*     ) */}
      {/*   ); */}
      {/* })} */}
    </>
  );
};

export default ComparablePreferences;
