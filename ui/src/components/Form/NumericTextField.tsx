import {
  Slider,
  SliderProps,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import clsx from "clsx";
import React from "react";
import { Controller, useWatch } from "react-hook-form";

type NumericTextFieldProps = {
  control: any;
  watch: any;
  setValue: any;
  fieldName: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

const NumericTextField = (
  {
    control,
    watch,
    setValue,
    fieldName,
    disabled,
    className,
    ...props
  }: NumericTextFieldProps,
) => {
  const values = useWatch({ control, name: fieldName });
  const handleChange = (event: any) => {
    setValue(fieldName, event.target.value);
  };
  return (
    <TextField
      type="number"
      value={values}
      onChange={handleChange}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      disabled={disabled}
      className={clsx([className])}
    />
  );
};

export default NumericTextField;
