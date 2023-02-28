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
import { useSelector } from 'react-redux';
import { selectSearchData } from '@/store/searchSlice';

type SliderRangeInputProps = {
  inputProps: InputProps;
  minValueName: string;
  maxValueName: string;
  value: [number, number];
  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
  update: (value: any) => void;
};
const SliderRangeInput: React.FC<SliderRangeInputProps> = (
  props: SliderRangeInputProps
) => {
  const searchData = useSelector(selectSearchData);
  const update = useCallback(debounce(props.update, 400), [
    props.value[0],
    props.value[1]
  ]);

  const handleChange = (event: Event, newValue: [number, number]) => {
    props.setMinValue(newValue[0]);
    props.setMaxValue(newValue[1]);
    update({
      ...searchData,
      [props.minValueName]: newValue[0],
      [props.maxValueName]: newValue[1]
    });
  };

  return (
    <Slider
      {...props.inputProps}
      value={props.value}
      onChange={handleChange}
      orientation="vertical"
      valueLabelDisplay="auto"
    />
  );
};

export default SliderRangeInput;
