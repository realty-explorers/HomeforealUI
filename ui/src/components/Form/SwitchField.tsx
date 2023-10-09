import { Slider, Switch, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";

type RangeFieldProps = {
  control: any;
  fieldName: string;
  disabled?: boolean;
  className?: string;
};

const SwitchField = (
  { control, fieldName, disabled, className }: RangeFieldProps,
) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { value, ...field } }) => (
        <Switch
          {...field}
          checked={!!value}
          disabled={disabled}
          className={className}
        />
      )}
    />
  );
};

export default SwitchField;
