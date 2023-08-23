import React, { useEffect, useState } from 'react';
import { Grid, styled } from '@mui/material';
import SliderRangeInput from '../FormFields/SliderRangeInput';
import SliderInput from '../FormFields/SliderInput';
import {
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import SliderField from './SliderField';
import {
  selectFilter,
  setArvMargin,
  setCompsMargin,
  setMaxBaths,
  setMinBeds,
  setMaxBeds,
  setMaxListingPrice,
  setMinBaths,
  setMinListingPrice
} from '@/store/slices/filterSlice';
import { useDispatch, useSelector } from 'react-redux';

const GridDiv = styled('div')(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '2rem',
  '> svg': {
    marginBottom: '0.5em'
  },
  margin: '0 0.2em'
}));

const LabelContainer = styled(Grid)(({ theme }) => ({
  display: 'flex'
}));

type MainControlsProps = {};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps
) => {
  const dispatch = useDispatch();

  const {
    arvMargin,
    compsMargin,
    maxBaths,
    minBaths,
    maxBeds,
    minBeds,
    maxListingPrice,
    minListingPrice
  } = useSelector(selectFilter);

  return (
    <>
      <SliderField fieldName="Listing Price">
        <SliderRangeInput
          inputProps={{
            title: 'Listing Price',
            name: 'listingPrice',
            min: 0,
            max: 60,
            step: 1,
            format: priceFormatter
          }}
          minValue={minListingPrice}
          maxValue={maxListingPrice}
          updateMinValue={(value) => dispatch(setMinListingPrice(value))}
          updateMaxValue={(value) => dispatch(setMaxListingPrice(value))}
          scale={{ scale: priceScale, reverseScale: priceReverseScale }}
        />
      </SliderField>

      <SliderField fieldName="Comps Margin">
        <SliderInput
          inputProps={{
            title: 'Comps Margin',
            name: 'underComps',
            min: 0,
            max: 100,
            step: 1
          }}
          value={compsMargin}
          update={(value) => dispatch(setCompsMargin(value))}
        />
      </SliderField>
      <SliderField fieldName="ARV Margin">
        <SliderInput
          inputProps={{
            title: 'ARV Margin',
            name: 'arvMargin',
            min: 0,
            max: 100,
            step: 1
          }}
          value={arvMargin}
          update={(value) => dispatch(setArvMargin(value))}
        />
      </SliderField>

      <SliderField fieldName="Baths">
        <SliderRangeInput
          inputProps={{
            title: 'Baths',
            name: 'baths',
            min: 1,
            max: 9,
            step: 1
          }}
          minValue={minBaths}
          maxValue={maxBaths}
          updateMinValue={(value) => dispatch(setMinBaths(value))}
          updateMaxValue={(value) => dispatch(setMaxBaths(value))}
        />
      </SliderField>
      <SliderField fieldName="Beds">
        <SliderRangeInput
          inputProps={{
            title: 'Beds',
            name: 'beds',
            min: 1,
            max: 9,
            step: 1
          }}
          minValue={minBeds}
          maxValue={maxBeds}
          updateMinValue={(value) => dispatch(setMinBeds(value))}
          updateMaxValue={(value) => dispatch(setMaxBeds(value))}
        />
      </SliderField>
      {/* <PropertyTypeFilter
        propertyTypes={props.searchData.propertyTypes}
        update={props.update}
      /> */}
      {/* <PropertyTypes /> */}
    </>
  );
};

export default MainControls;
