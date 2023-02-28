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

type DropdownInputProps = {
  inputProps: InputProps;
  setValue: (value: string) => void;
  value: string;
};
const DropdownInput: React.FC<DropdownInputProps> = (
  props: DropdownInputProps
) => {
  const options = ['1d', '7d', '14d', '30d', '90d', '6m', '12m', '24m', '36m'];
  const [inputValue, setInputValue] = React.useState('');

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
              value={props.value}
              onChange={(event: any, newValue: string | null) => {
                props.setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={options}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label={props.inputProps.title} />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DropdownInput;
