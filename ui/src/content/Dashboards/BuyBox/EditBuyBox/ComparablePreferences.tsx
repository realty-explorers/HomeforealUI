import { sliderClasses } from "@mui/base";
import {
  Button,
  Checkbox,
  Slider,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
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
import ArticleIcon from "@mui/icons-material/Article";
import { styled } from "@mui/system";

const StyledTab = styled(Tab)(({ theme }) => ({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
  },
}));

const similarityTypes = ["green", "yellow", "orange", "red"];
const similarityFields = [
  // { fieldName: "Same Neighborhood", type: "boolean" },
  // { fieldName: "Same Property Type", type: "boolean" },
  // { fieldName: "Same Pool Status", type: "boolean" },
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

//bg-red-500
//bg-orange-500
//bg-yellow-500
//bg-green-500

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

  const handleUseTemplate = () => {
  };

  return (
    <>
      <div className="col-span-2 relative">
        {similarityTypes.map((similarityType, index) => (
          index === tab && (
            <div
              key={index}
              className={clsx([
                " flex absolute top-0 left-0",
              ])}
            >
              <Controller
                name={`similarity.${similarityType}.active`}
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox
                    {...field}
                    checked={!!value}
                  />
                )}
              />
              <Typography className={styles.label}>
                Active
              </Typography>
              {" "}
            </div>
          )
        ))}

        <Tabs
          value={tab}
          onChange={handleChange}
          centered
          TabIndicatorProps={{
            sx: {
              // borderRadius: "10rem",
              border: `0.2rem solid ${
                tab === 0
                  ? "green"
                  : tab === 1
                  ? "yellow"
                  : tab === 2
                  ? "orange"
                  : "red"
              }`,
            },
          }}
        >
          <StyledTab
            label="Green"
            className={clsx([tab === 0 && "bg-green-500 text-white"])}
          />
          <StyledTab
            label="Yellow"
            className={clsx([tab === 1 && "bg-yellow-500"])}
          />
          <StyledTab
            label="Orange"
            className={clsx([tab === 2 && "bg-orange-500"])}
          />
          <StyledTab
            label="Red"
            className={clsx([tab === 3 && "bg-red-500"])}
          />
        </Tabs>

        {/* <Button */}
        {/*   startIcon={<ArticleIcon />} */}
        {/*   className="bg-secondary text-white hover:ring-4 hover:bg-secondary px-4" */}
        {/*   onClick={handleUseTemplate} */}
        {/* > */}
        {/*   Use Template */}
        {/* </Button> */}
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
                            disabled={!watch(
                              `similarity.${similarityType}.active`,
                            )}
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
                          disabled={!watch(
                            `similarity.${similarityType}.active`,
                          )}
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
                        ) || !watch(`similarity.${similarityType}.active`)}
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
                    disabled={!watch(
                      `similarity.${similarityType}.active`,
                    )}
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
