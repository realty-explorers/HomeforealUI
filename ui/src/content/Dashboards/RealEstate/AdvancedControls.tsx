import React, { useState } from 'react';
import { styled, Tooltip } from '@mui/material';
import ExpandIcon from '@mui/icons-material/Expand';
import HotelIcon from '@mui/icons-material/Hotel';
import WcIcon from '@mui/icons-material/Wc';
import SliderRangeInput from './SliderRangeInput';
import {
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';

const GridDiv = styled('div')(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  '> svg': {
    marginBottom: '0.5em'
  },
  margin: '0 0.2em'
}));

type AdvancedControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const AdvancedControls: React.FC<AdvancedControlsProps> = (
  props: AdvancedControlsProps
) => {
  return (
    <>
      <GridDiv>
        <Tooltip title="Baths" placement="bottom">
          <WcIcon color="error" />
        </Tooltip>
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
      </GridDiv>
      <GridDiv>
        <Tooltip title="Beds" placement="bottom">
          <HotelIcon color="success" />
        </Tooltip>
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
      </GridDiv>
      <GridDiv>
        <Tooltip title="Area" placement="bottom">
          <ExpandIcon color="primary" />
        </Tooltip>
        <SliderRangeInput
          inputProps={{
            title: 'Area',
            name: 'area',
            min: 500,
            max: 10000,
            step: 50
          }}
          minValueName={'minArea'}
          maxValueName={'maxArea'}
          minValue={props.searchData.minArea}
          maxValue={props.searchData.maxArea}
          update={props.update}
        />
      </GridDiv>
    </>
  );
};

export default AdvancedControls;
