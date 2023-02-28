import React, { useContext, useState } from 'react';
import {
  alpha,
  Autocomplete,
  Grid,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { InputProps } from '@/components/Form/formTypes';

type RangeInputProps = {
  inputProps: InputProps;
  setMinValue: (minValue: string) => void;
  setMaxValue: (maxValue: string) => void;
  minValue: string;
  maxValue: string;
};
const RangeInput: React.FC<RangeInputProps> = (props: RangeInputProps) => {
  const options = [
    '0',
    '100000',
    '200000',
    '300000',
    '4000000',
    '500000',
    '600000',
    '700000',
    '800000',
    '900000'
  ];
  const [minInputValue, setMinInputValue] = React.useState('');
  const [maxInputValue, setMaxInputValue] = React.useState('');

  return (
    <Grid container spacing={2} className="search-numeric-input">
      <Grid item xs={3} container alignItems="center">
        <Typography id="input-slider" gutterBottom>
          {props.inputProps.title}:
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Grid container justifyContent="center">
          <Grid>
            <Autocomplete
              freeSolo
              value={props.minValue}
              onChange={(event: any, newValue: string | null) => {
                props.setMinValue(newValue);
              }}
              inputValue={minInputValue}
              onInputChange={(event, newInputValue) => {
                setMinInputValue(newInputValue);
                props.setMinValue(newInputValue);
              }}
              options={options}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Min" />}
            />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginLeft: 1, marginRight: 1 }}>-</Typography>
          </Grid>
          <Grid>
            <Autocomplete
              freeSolo
              value={props.maxValue}
              onChange={(event: any, newValue: string | null) => {
                props.setMaxValue(newValue);
              }}
              inputValue={maxInputValue}
              onInputChange={(event, newInputValue) => {
                setMaxInputValue(newInputValue);
                props.setMaxValue(newInputValue);
              }}
              options={options}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Max" />}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RangeInput;
