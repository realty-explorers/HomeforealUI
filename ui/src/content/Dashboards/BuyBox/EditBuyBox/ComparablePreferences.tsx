import { sliderClasses } from "@mui/base";
import { Checkbox, Slider, Switch, Tab, Tabs, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
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

type ComparablePreferencesProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
};
const ComparablePreferences = (
  { register, control, watch }: ComparablePreferencesProps,
) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Comparable Preferences
      </Typography>
      <div className="col-span-2">
        <Tabs
          value={value}
          onChange={handleChange}
          centered
        >
          <Tab label="Green" />
          <Tab label="Yellow" />
          <Tab label="Orange" />
          <Tab label="Red" />
        </Tabs>
      </div>
      {similarityTypes.map((similartyType, index) => {
        return (
          (
            <React.Fragment key={index}>
              <div
                className={clsx([
                  "flex w-full item-center col-span-2",
                  index === value ? "" : "hidden",
                ])}
              >
                <Switch {...register(`${similartyType}.samePropertyType`)} />
                <Typography className={styles.label}>
                  Same Property Type
                </Typography>
              </div>
              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.bedrooms`}
                title="Bedrooms"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />
              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.bathrooms`}
                title="Bathrooms"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.yearBuilt`}
                title="Year Built"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.buildingSqft`}
                title="Building Sqft"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.lotSize`}
                title="Lot Size"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <div
                className={clsx([
                  "flex w-full item-center col-span-2",
                  index === value ? "" : "hidden",
                ])}
              >
                <Switch {...register(`${similartyType}.samePool`)} />
                <Typography className={styles.label}>Same Pool</Typography>
              </div>

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.garages`}
                title="Garages"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.distance`}
                title="Distance"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />

              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.saleDate`}
                title="Sale Date"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />
              <RangeField
                register={register}
                control={control}
                watch={watch}
                fieldName={`${similartyType}.weight`}
                title="Weight"
                labelClass={index === value ? "" : "hidden"}
                sliderClass={index === value ? "" : "hidden"}
              />
            </React.Fragment>
          )
        );
      })}
    </>
  );
};

export default ComparablePreferences;
