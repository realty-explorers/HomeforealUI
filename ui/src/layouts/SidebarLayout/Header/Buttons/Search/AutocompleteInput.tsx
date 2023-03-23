import React, { useState, useMemo, useContext } from 'react';
import {
  Box,
  debounce,
  Grid,
  InputAdornment,
  styled,
  TextField,
  Typography
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import LocationSuggestion from '@/models/location_suggestions';
import { getLocationSuggestions } from 'src/api/location_api';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

type AutocompleteInputProps = {
  // setValue: UseFormSetValue<any>;
  setLocation: (location: LocationSuggestion) => void;
  location: LocationSuggestion;
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = (
  props: AutocompleteInputProps
) => {
  const [options, setOptions] = React.useState<LocationSuggestion[]>([]);

  const fetch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        const response = await getLocationSuggestions(searchTerm);
        if (response.status === 200) setOptions(response.data);
      }, 400),
    []
  );

  return (
    <Autocomplete
      freeSolo
      value={props.location}
      filterOptions={(x) => x}
      onChange={(event: any, newValue: LocationSuggestion | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setLocation(newValue);
      }}
      options={options}
      getOptionLabel={(option?: LocationSuggestion) => option.display ?? ''}
      onInputChange={(event, newInputValue) => {
        if (newInputValue) fetch(newInputValue);
      }}
      renderInput={(params) => (
        <SearchInputWrapper
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchTwoToneIcon />
              </InputAdornment>
            )
          }}
          label="Location"
          autoFocus
          fullWidth
          value={props.location?.display}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid
                item
                sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {option?.display}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default AutocompleteInput;
