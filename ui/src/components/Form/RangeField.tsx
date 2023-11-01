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
  setValue: any;
  getValues: any;
  fieldName: string;
  watch: any;
  disabled?: boolean;
  className?: string;
} & SliderProps;

const RangeField = (
  {
    setValue,
    getValues,
    fieldName,
    watch,
    disabled,
    className,
    ...props
  }: RangeFieldProps,
) => {
  const [values, setValues] = React.useState(getValues(fieldName));
  const handleNumberInputChangeMin = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues([e.target.valueAsNumber, values[1]]);
    setValue(`${fieldName}.0`, e.target.valueAsNumber);
  };

  const handleNumberInputChangeMax = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues([values[0], e.target.valueAsNumber]);
    setValue(`${fieldName}.1`, e.target.valueAsNumber);
  };

  const handleSliderChange = (
    event: Event,
    value: number[],
    activeThumb: number,
  ) => {
    setValues(value);
    setValue(fieldName, value);
  };
  return (
    <div className="flex w-full justify-center items-center gap-x-4">
      <TextField
        type="number"
        size="small"
        value={values?.[0] || 0}
        onChange={handleNumberInputChangeMin}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        disabled={disabled}
        className={clsx([className])}
      />
      <StyledSlider
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        value={values}
        disabled={disabled}
        className={clsx([className])}
        {...props}
      />

      <TextField
        type="number"
        size="small"
        value={values?.[1] || 0}
        onChange={handleNumberInputChangeMax}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        disabled={disabled}
        className={clsx([className])}
      />
    </div>
  );
};

export default RangeField;
