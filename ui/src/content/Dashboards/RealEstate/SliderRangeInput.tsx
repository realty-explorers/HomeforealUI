import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  alpha,
  Autocomplete,
  debounce,
  Grid,
  Slider,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { InputProps } from '@/components/Form/formTypes';

type SliderRangeInputProps = {
  inputProps: InputProps;
  minValueName: string;
  maxValueName: string;
  minValue: number;
  maxValue: number;
  update: (name: string, value: any) => void;
  scale?: {
    scale: (number: number) => number;
    reverseScale: (number: number) => number;
  };
};
const SliderRangeInput: React.FC<SliderRangeInputProps> = (
  props: SliderRangeInputProps
) => {
  const handleChange = (event: Event, newValue: [number, number]) => {
    props.update(
      props.minValueName,
      props.scale ? props.scale.scale(newValue[0]) : newValue[0]
    );
    props.update(
      props.maxValueName,
      props.scale ? props.scale.scale(newValue[1]) : newValue[1]
    );
  };

  return (
    <Slider
      {...props.inputProps}
      value={[
        props.scale ? props.scale.reverseScale(props.minValue) : props.minValue,
        props.scale ? props.scale.reverseScale(props.maxValue) : props.maxValue
      ]}
      scale={props.scale?.scale}
      getAriaValueText={props.inputProps.format}
      valueLabelFormat={props.inputProps.format}
      onChange={handleChange}
      orientation="vertical"
      valueLabelDisplay="auto"
      aria-labelledby="non-linear-slider"
    />
  );
};

export default SliderRangeInput;
