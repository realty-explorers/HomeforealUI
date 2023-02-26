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
import React, { useState, useMemo, useContext } from 'react';
import LocationSuggestion from '@/models/location_suggestions';
import { getLocationSuggestions } from 'src/api/location_api';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SearchContext } from '@/contexts/SearchContext';

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
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = (
  props: AutocompleteInputProps
) => {
  const [suggestionValue, setSuggestionValue] =
    React.useState<LocationSuggestion | null>(null);
  const [options, setOptions] = React.useState<LocationSuggestion[]>([]);
  const { searchData, setSearchData } = useContext(SearchContext);

  const fetch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        const results = await getLocationSuggestions(searchTerm);
        setOptions(results.data);
      }, 400),
    []
  );

  return (
    <Autocomplete
      freeSolo
      value={suggestionValue}
      filterOptions={(x) => x}
      onChange={(event: any, newValue: LocationSuggestion | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setSuggestionValue(newValue);
        const newData = { ...searchData };
        newData['location'] = newValue;
        setSearchData(newData);
        // props.setValue('location', newValue);
      }}
      options={options}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.display
      }
      onInputChange={(event, newInputValue) => {
        fetch(newInputValue);
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
          value={suggestionValue?.display}
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
                  {option.display}
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
