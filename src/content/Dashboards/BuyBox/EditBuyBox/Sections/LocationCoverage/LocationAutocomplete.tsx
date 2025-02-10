'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  debounce,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  TextField,
  Typography
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import LocationSuggestion from '@/models/location_suggestions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetLocationSuggestionQuery,
  useLazyGetLocationSuggestionQuery
} from '@/store/services/locationApiService';
import { borderRadius, styled } from '@mui/system';
import Fuse from 'fuse.js';
import { useDispatch } from 'react-redux';
import { setSelectedPropertyPreview } from '@/store/slices/propertiesSlice';
import clsx from 'clsx';

interface TargetLocation {
  display: string;
  type: string;
  state: string;
  city: string;
  neighborhood: string;
  zipCode: string;
}

const SuggestionsContainer = (props) => {
  return <div {...props} className="shadow rounded-xl mt-4"></div>;
};

function StyledInput({ searching, params, value }) {
  return (
    <form
      id="search-bar"
      className={clsx([
        'ring-1 ring-[rgba(155,81,224,0.5)] hover:ring-0 flex items-center bg-white rounded-3xl px-4 py-0  font-poppins border-2 border-transparent focus-within:border-[rgba(155,81,224,0.5)] focus-within:ring-0 hover:border-[rgba(155,81,224,0.5)] transition-all',
        !value && 'ring-4'
      ])}
    >
      <InputBase
        {...params.InputProps}
        {...params}
        value={value}
        endAdornment={
          <div className="absolute -right-4">
            <InputAdornment position="start">
              <IconButton disabled={searching}>
                {searching && <CircularProgress size={24} />}
              </IconButton>
            </InputAdornment>
          </div>
        }
        placeholder="Search Locations"
        style={{ padding: '0.5rem 0rem' }}
        className="font-poppins text-lg"
      />
    </form>
  );
}

type LocationAutocompleteProps = {
  setLocations: (locations: LocationSuggestion[]) => void;
  locations: LocationSuggestion[];
};
const LocationAutocomplete: React.FC<LocationAutocompleteProps> = (
  props: LocationAutocompleteProps
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);
  // const { data } = useGetLocationSuggestionQuery(debouncedSearchTerm);
  const [getLocationSuggestions, state] = useLazyGetLocationSuggestionQuery();
  const [options, setOptions] = React.useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const fetch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        try {
          const response = await getLocationSuggestions(
            searchTerm,
            true
          ).unwrap();
          const allowedTypes = ['city', 'state', 'neighborhood', 'postal_code'];
          const allowedStates = ['FL', 'AL', 'IL', 'TX', 'OH', 'NJ'];
          const relevantResultOptions = response.filter(
            (option) =>
              allowedTypes.includes(option.type) &&
              allowedStates.includes(option.state)
          );
          setOptions([]);
          setOptions(relevantResultOptions);
        } catch (error) {
          if (
            error.response &&
            error.response.status &&
            (error.response.status === 400 || error.response.status === 401)
          ) {
            alert('Unauthorized');
            // signOut();
          } else alert(error);
        }
      }, 400),
    []
  );

  const handleInputChange = (event, newInput) => {
    if (newInput) {
      fetch(newInput);
    }
  };

  const [locations, setLocations] = useState<LocationSuggestion[] | []>([]);

  return (
    <Autocomplete
      selectOnFocus
      handleHomeEndKeys
      clearOnBlur
      multiple
      isOptionEqualToValue={(option, value) => option.display === value.display}
      value={props.locations || []}
      // filterOptions={(x) => x}
      onChange={(event: any, newValue: LocationSuggestion[] | []) => {
        props.setLocations(newValue);
      }}
      options={options}
      getOptionLabel={(option?: LocationSuggestion) => option.display ?? ''}
      onInputChange={handleInputChange}
      PaperComponent={(props) => <SuggestionsContainer {...props} />}
      renderInput={(params) => (
        <StyledInput
          params={params}
          searching={searching || state.isFetching}
          value={locations?.map((location) => location.display) || []}
        />
        // <TextField
        //   {...params}
        //   label="Locations"
        //   placeholder="Locations"
        // />
      )}
      renderTags={(value: readonly LocationSuggestion[], getTagProps) =>
        value.map((option: LocationSuggestion, index: number) => (
          <Chip
            key={index}
            // variant="outlined"
            label={option.display}
            style={{ marginRight: '0.5rem' }}
            {...getTagProps({ index })}
          />
        ))
      }
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
                <Typography className="">{option?.display}</Typography>

                <span className="text-gray-400 capitalize">{option?.type}</span>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default LocationAutocomplete;
