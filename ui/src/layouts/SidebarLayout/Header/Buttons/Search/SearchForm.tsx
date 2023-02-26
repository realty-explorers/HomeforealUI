import React, { useContext, useState } from 'react';
import {
  alpha,
  Autocomplete,
  Grid,
  styled,
  TextField,
  Typography
} from '@mui/material';
import RangeInput from './RangeInput';
import SliderInput from './SliderInput';
import DropdownInput from './DropdownInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationSuggestion from '@/models/location_suggestions';
import { SearchContext } from '@/contexts/SearchContext';

type SearchFormProps = {};
const SearchForm: React.FC<SearchFormProps> = (props: SearchFormProps) => {
  const { searchData, setSearchData } = useContext(SearchContext);

  return (
    <Grid container rowSpacing={2}>
      <Grid xs={12} item>
        <RangeInput inputProps={{ title: 'Purchase Price', name: 'price' }} />
      </Grid>
      <Grid xs={12} item>
        <RangeInput inputProps={{ title: 'ARV', name: 'arv' }} />
      </Grid>
      <Grid xs={12} item>
        <SliderInput
          inputProps={{ title: 'Under Comps', name: 'underComps' }}
        />
      </Grid>
      <Grid xs={12} item>
        <SliderInput
          inputProps={{
            title: 'Comps Radius',
            name: 'distance',
            min: 0,
            max: 10
          }}
        />
      </Grid>
      <Grid xs={12} item>
        <DropdownInput
          inputProps={{ title: 'Sold in last', name: 'lastSold' }}
        />
      </Grid>
    </Grid>
  );
};

export default SearchForm;
