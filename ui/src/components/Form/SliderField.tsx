import { Slider, SliderProps, Switch, Typography } from "@mui/material";
import { styled } from "@mui/system";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";

const StyledSlider = styled(Slider)({
  "& .MuiSlider-valueLabel": {
    borderRadius: "2rem",
    backgroundColor: "#223354",
    fontFamily: "var(--font-poppins)",
    fontWeight: 600,
  },
});

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
        <StyledSlider
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
