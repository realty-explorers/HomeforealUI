'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
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
import styles from './AutoComplete.module.scss';
import locations from './locations.json';
import Fuse from 'fuse.js';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setSelectedPropertyPreview } from '@/store/slices/propertiesSlice';
import clsx from 'clsx';
import { redirect } from 'next/navigation';

const SuggestionsContainer = (props) => {
  return <div {...props} className={styles.suggestionsContainer}></div>;
};

function StyledInput({ searching, params, value }) {
  const dispatch = useDispatch();
  return (
    <form
      id="search-bar"
      className={clsx([
        'flex items-center bg-white rounded-3xl px-4 py-0  font-poppins shadow-xl border-2 border-transparent focus-within:border-[rgba(155,81,224,0.5)] hover:border-[rgba(155,81,224,0.5)] transition-all',
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
              <IconButton
                disabled={searching}
                onClick={() => {
                  dispatch(setSelectedPropertyPreview(null));
                }}
              >
                {searching ? (
                  <CircularProgress className="text-secondary" size={24} />
                ) : (
                  <SearchTwoToneIcon htmlColor="#70757a" />
                )}
              </IconButton>
            </InputAdornment>
          </div>
        }
        // }}
        placeholder="Search Locations"
        style={{ padding: '0.2rem 0rem' }}
        className="font-poppins text-lg"
      />
    </form>
  );
}

type AutocompleteInputProps = {
  // setValue: UseFormSetValue<any>;
  setLocation: (location: LocationSuggestion) => void;
  location: LocationSuggestion;
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = (
  props: AutocompleteInputProps
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
          console.log(response);
          const allowedTypes = ['city', 'state', 'neighborhood', 'postal_code'];
          const allowedStates = ['FL', 'AL', 'IL', 'TX', 'OH', 'NJ', 'IN'];
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
            // redirect('/api/auth/logout');
            signOut();
          } else console.log(error);
        }
      }, 400),
    []
  );

  const handleInputChange = (event, newInput) => {
    if (newInput) {
      fetch(newInput);
    }
  };

  return (
    <Autocomplete
      value={props.location || null}
      blurOnSelect
      clearOnBlur
      clearOnEscape
      filterOptions={(x) => x}
      onChange={(event: any, newValue: LocationSuggestion | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setLocation(newValue);
      }}
      options={options ?? []}
      getOptionLabel={(option?: LocationSuggestion) => option.display ?? ''}
      onInputChange={handleInputChange}
      PaperComponent={(props) => <SuggestionsContainer {...props} />}
      renderInput={(params) => (
        <StyledInput
          params={params}
          searching={searching || state.isFetching}
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
                <Typography className={styles.suggestion}>
                  {option?.display}
                </Typography>
                <span className="text-gray-400 capitalize">{option?.type}</span>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default AutocompleteInput;
