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
import { UseFormRegister } from 'react-hook-form';
import { InputProps } from '@/components/Form/formTypes';
import { SearchContext } from '@/contexts/SearchContext';

type SliderInputProps = {
  inputProps: InputProps;
};
const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const { searchData, setSearchData } = useContext(SearchContext);

  const handleChange = (event: Event, newValue: number) => {
    const newData = { ...searchData };
    newData[props.inputProps.name] = newValue;
    setSearchData(newData);
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
          value={searchData[props.inputProps.name]}
          onChange={handleChange}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Grid>
    </Grid>
  );
};

export default SliderInput;
