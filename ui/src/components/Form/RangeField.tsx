import { numberFormatter } from "@/utils/converters";
import {
  InputAdornment,
  Slider,
  SliderProps,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import NumericField from "./NumericField";

const StyledSlider = styled(Slider)({
  "& .MuiSlider-valueLabel": {
    borderRadius: "2rem",
    backgroundColor: "#223354",
    fontFamily: "var(--font-poppins)",
    fontWeight: 600,
  },
});

type RangeFieldProps = {
  min: number;
  max: number;
  setValue: any;
  getValues: any;
  fieldName: string;
  prefix?: string;
  postfix?: string;
  disabled?: boolean;
  formatLabelAsNumber?: boolean;
  className?: string;
} & SliderProps;

const RangeField = (
  {
    min,
    max,
    setValue,
    getValues,
    fieldName,
    disabled,
    prefix,
    postfix,
    formatLabelAsNumber,
    className,
    ...props
  }: RangeFieldProps,
) => {
  const [values, setValues] = React.useState(getValues(fieldName));
  const handleNumberInputChangeMin = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = Number(e.target.value);
    if (value < min) {
      value = min;
    }
    setValues(typeof values !== "object" ? value : [value, values[1]]);
    setValue(
      typeof values !== "object" ? `${fieldName}` : `${fieldName}.0`,
      value,
    );
  };

  const handleNumberInputChangeMax = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = Number(e.target.value);
    if (value > max) {
      value = max;
    }
    setValues(typeof values === "number" ? value : [values[0], value]);
    setValue(
      typeof values === "number" ? `${fieldName}` : `${fieldName}.1`,
      value,
    );
    // setValues([values[0], e.target.valueAsNumber]);
    // setValue(`${fieldName}.1`, e.target.valueAsNumber);
  };

  const handleSliderChange = (
    event: Event,
    value: number | number[],
    activeThumb: number,
  ) => {
    setValues(value);
    setValue(fieldName, value);
  };

  const formatLabel = (value: any) => {
    return `${prefix ? prefix : ""} ${value} ${postfix ? postfix : ""}`;
  };

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] w-full gap-x-4 items-center">
      <TextField
        label={typeof values === "object" ? "Min" : ""}
        size="small"
        value={typeof values !== "object" ? values : values?.[0]}
        onChange={handleNumberInputChangeMin}
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumericField as any,
          inputProps: {
            min: min,
            max: max,
            formatLabelAsNumber: formatLabelAsNumber,
          },
          startAdornment: prefix && (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ),
          endAdornment: postfix && (
            <InputAdornment position="end">{postfix}</InputAdornment>
          ),
        }}
        variant="outlined"
        disabled={disabled}
      />

      <StyledSlider
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        value={values}
        disabled={disabled}
        className={clsx([className])}
        min={min}
        max={max}
        valueLabelFormat={(value) => {
          return formatLabelAsNumber
            ? numberFormatter(formatLabel(value))
            : formatLabel(value);
        }}
        {...props}
      />

      {typeof values === "object" && (
        <TextField
          size="small"
          label="Max"
          value={typeof values === "number" ? values : values?.[1]}
          onChange={handleNumberInputChangeMax}
          name="numberformat"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumericField as any,
            inputProps: {
              min: min,
              max: max,
              formatLabelAsNumber: formatLabelAsNumber,
            },
            startAdornment: prefix && (
              <InputAdornment position="start">{prefix}</InputAdornment>
            ),
            endAdornment: postfix && (
              <InputAdornment position="end">{postfix}</InputAdornment>
            ),
          }}
          variant="outlined"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default RangeField;
