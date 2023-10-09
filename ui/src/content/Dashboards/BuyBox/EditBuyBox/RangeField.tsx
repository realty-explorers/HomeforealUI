import SliderField from "@/components/Form/SliderField";
import SwitchField from "@/components/Form/SwitchField";
import { Slider, SliderProps, Switch, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";
import styles from "./EditBuyBoxDialog.module.scss";

type RangeFieldProps = {
  register: any;
  control: any;
  watch: any;
  fieldName: string;
  title: string;
  labelClass?: string;
  sliderClass?: string;
} & SliderProps;

export const RangeField = (
  {
    register,
    control,
    watch,
    fieldName,
    title,
    labelClass,
    sliderClass,
    ...props
  }: RangeFieldProps,
) => {
  return (
    <>
      <div
        className={clsx([
          "flex w-full item-center",
          labelClass,
        ])}
      >
        <SwitchField fieldName={`${fieldName}.0`} control={control} />
        <Typography className={styles.label}>{title}</Typography>
      </div>
      <div className={clsx(["flex", sliderClass])}>
        <SliderField
          {...props}
          fieldName={`${fieldName}.1`}
          control={control}
          disabled={!watch(`${fieldName}.0`)}
        />
      </div>
    </>
  );
};
