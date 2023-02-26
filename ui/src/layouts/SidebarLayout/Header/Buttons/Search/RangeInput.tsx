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
import { SearchContext } from '@/contexts/SearchContext';

type RangeInputProps = {
  inputProps: InputProps;
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
  const { searchData, setSearchData } = useContext(SearchContext);

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
              value={searchData[props.inputProps.name]['min']}
              onChange={(event: any, newValue: string | null) => {
                const newData = { ...searchData };
                newData[props.inputProps.name]['min'] = newValue;
                setSearchData(newData);
              }}
              inputValue={minInputValue}
              onInputChange={(event, newInputValue) => {
                setMinInputValue(newInputValue);
                const newData = { ...searchData };
                newData[props.inputProps.name]['min'] = newInputValue;
                setSearchData(newData);
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
              value={searchData[props.inputProps.name]['max']}
              onChange={(event: any, newValue: string | null) => {
                const newData = { ...searchData };
                newData[props.inputProps.name]['max'] = newValue;
                setSearchData(newData);
              }}
              inputValue={maxInputValue}
              onInputChange={(event, newInputValue) => {
                setMaxInputValue(newInputValue);
                const newData = { ...searchData };
                newData[props.inputProps.name]['max'] = newInputValue;
                setSearchData(newData);
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
