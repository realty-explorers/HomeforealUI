import React, { useContext, useState } from 'react';
import {
  alpha,
  Autocomplete,
  Grid,
  Slider,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { InputProps } from '@/components/Form/formTypes';

type SliderInputProps = {
  inputProps: InputProps;
  setValue: (value: number) => void;
  value: number;
};
const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const handleChange = (event: Event, newValue: number) => {
    props.setValue(newValue);
  };

  return (
    <Grid container spacing={2} className="search-numeric-input">
      <Grid item xs={3}>
        <Typography id="input-slider" gutterBottom>
          {props.inputProps.title}:
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Slider
          {...props.inputProps}
          // value={searchData[props.inputProps.name]}
          value={props.value}
          onChange={handleChange}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Grid>
    </Grid>
  );
};

export default SliderInput;
