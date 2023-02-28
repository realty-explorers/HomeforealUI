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

type SliderInputProps = {
  inputProps: InputProps;
  value: number;
  setValue: (value: number) => void;
  update: (value: any) => void;
};
const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const searchData = useSelector(selectSearchData);
  const update = useCallback(debounce(props.update, 400), []);

  const handleChange = (event: Event, newValue: number) => {
    props.setValue(newValue);
    update({ ...searchData, [props.inputProps.name]: newValue });
  };

  return (
    <Slider
      {...props.inputProps}
      value={props.value}
      onChange={handleChange}
      orientation="vertical"
      aria-label="Default"
      valueLabelDisplay="auto"
    />
  );
};

export default SliderInput;
