import { Slider, SliderProps, Switch, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";

type RangeFieldProps = {
  control: any;
  fieldName: string;
  disabled?: boolean;
  className?: string;
} & SliderProps;

const SliderField = (
  {
    control,
    fieldName,
    disabled,
    className,
    ...props
  }: RangeFieldProps,
) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Slider
          {...field}
          {...props}
          valueLabelDisplay="auto"
          disabled={disabled}
          className={clsx([className])}
        />
      )}
    />
  );
};

export default SliderField;
