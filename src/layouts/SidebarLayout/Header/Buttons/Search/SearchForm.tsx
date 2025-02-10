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
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchData,
  setSearchDistance,
  setSearchForSaleAge,
  setSearchMaxArv,
  setSearchMaxPrice,
  setSearchMinArv,
  setSearchMinPrice,
  setSearchSoldAge,
  setSearchUnderComps
} from '@/store/searchSlice';

type SearchFormProps = {};
const SearchForm: React.FC<SearchFormProps> = (props: SearchFormProps) => {
  const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();

  const setMinPrice = (value: string) => {
    dispatch(setSearchMinPrice(value));
  };

  const setMaxPrice = (value: string) => {
    dispatch(setSearchMaxPrice(value));
  };
  const setMinArv = (value: string) => {
    dispatch(setSearchMinArv(value));
  };
  const setMaxArv = (value: string) => {
    dispatch(setSearchMaxArv(value));
  };
  const setUnderComps = (value: number) => {
    dispatch(setSearchUnderComps(value));
  };
  const setDistance = (value: number) => {
    dispatch(setSearchDistance(value));
  };

  const setForSaleAge = (value: string) => {
    dispatch(setSearchForSaleAge(value));
  };

  const setSoldAge = (value: string) => {
    dispatch(setSearchSoldAge(value));
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid xs={12} item>
        <RangeInput
          inputProps={{ title: 'Purchase Price', name: 'price' }}
          setMinValue={setMinPrice}
          setMaxValue={setMaxPrice}
          minValue={searchData.minPrice}
          maxValue={searchData.maxPrice}
        />
      </Grid>
      <Grid xs={12} item>
        <RangeInput
          inputProps={{ title: 'ARV', name: 'arv' }}
          setMinValue={setMinArv}
          setMaxValue={setMaxArv}
          minValue={searchData.minArv}
          maxValue={searchData.maxArv}
        />
      </Grid>
      <Grid xs={12} item>
        <SliderInput
          inputProps={{ title: 'Under Comps', name: 'underComps' }}
          setValue={setUnderComps}
          value={searchData.underComps}
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
          setValue={setDistance}
          value={searchData.distance}
        />
      </Grid>
      <Grid xs={12} item>
        <DropdownInput
          inputProps={{ title: 'For Sale Houses Age', name: 'forSaleAge' }}
          setValue={setForSaleAge}
          value={searchData.forSaleAge}
        />
      </Grid>
      <Grid xs={12} item>
        <DropdownInput
          inputProps={{ title: 'Sold Houses Age', name: 'soldAge' }}
          setValue={setSoldAge}
          value={searchData.soldAge}
        />
      </Grid>
    </Grid>
  );
};

export default SearchForm;
