import React, { useState } from 'react';
import { styled, Tooltip } from '@mui/material';
import ExpandIcon from '@mui/icons-material/Expand';
import HotelIcon from '@mui/icons-material/Hotel';
import WcIcon from '@mui/icons-material/Wc';
import SliderRangeInput from '../SliderRangeInput';
import {
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import SliderField from './SliderField';

type AdvancedControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const AdvancedControls: React.FC<AdvancedControlsProps> = (
  props: AdvancedControlsProps
) => {
  return (
    <>
      <SliderField fieldName="Baths">
        <SliderRangeInput
          inputProps={{
            title: 'Baths',
            name: 'baths',
            min: 1,
            max: 9,
            step: 1
          }}
          minValueName={'minBaths'}
          maxValueName={'maxBaths'}
          minValue={props.searchData.minBaths}
          maxValue={props.searchData.maxBaths}
          update={props.update}
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
          minValueName={'minBeds'}
          maxValueName={'maxBeds'}
          minValue={props.searchData.minBeds}
          maxValue={props.searchData.maxBeds}
          update={props.update}
        />
      </SliderField>
      <SliderField fieldName="Sqft">
        <SliderRangeInput
          inputProps={{
            title: 'Sqft',
            name: 'forSaleArea',
            min: 500,
            max: 10000,
            step: 50
          }}
          minValueName={'minForSaleArea'}
          maxValueName={'maxForSaleArea'}
          minValue={props.searchData.minForSaleArea}
          maxValue={props.searchData.maxForSaleArea}
          update={props.update}
        />
      </SliderField>
      <SliderField fieldName="Comps Sqft">
        <SliderRangeInput
          inputProps={{
            title: 'Sqft',
            name: 'soldArea',
            min: 500,
            max: 10000,
            step: 50
          }}
          minValueName={'minSoldArea'}
          maxValueName={'maxSoldArea'}
          minValue={props.searchData.minSoldArea}
          maxValue={props.searchData.maxSoldArea}
          update={props.update}
        />
      </SliderField>
    </>
  );
};

export default AdvancedControls;
