import { Slider, Switch, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";

type RangeFieldProps = {
  control: any;
  fieldName: string;
  className?: string;
};

const SwitchField = (
  { control, fieldName, className }: RangeFieldProps,
) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { value, ...field } }) => (
        <Switch
          {...field}
          checked={!!value}
          className={className}
        />
      )}
    />
  );
};

export default SwitchField;
