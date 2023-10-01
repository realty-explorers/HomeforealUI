import { Slider, Switch, Typography } from "@mui/material";
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
};

export const RangeField = (
  { register, control, watch, fieldName, title, labelClass, sliderClass }:
    RangeFieldProps,
) => {
  return (
    <>
      <div
        className={clsx([
          "flex w-full item-center",
          labelClass,
        ])}
      >
        <Controller
          name={`${fieldName}.0`}
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch
              {...field}
              checked={!!value}
            />
          )}
        />
        <Typography className={styles.label}>{title}</Typography>
      </div>
      <div className={clsx(["flex", sliderClass])}>
        <Controller
          name={`${fieldName}.1`}
          control={control}
          render={({ field }) => (
            <Slider
              {...field}
              disabled={!watch(`${fieldName}.0`)}
              className="w-1/2"
            />
          )}
        />
      </div>
    </>
  );
};
