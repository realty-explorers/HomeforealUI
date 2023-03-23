import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, styled, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SliderRangeInput from './SliderRangeInput';
import SliderInput from './SliderInput';
import {
  ageFormatter,
  ageReverseScale,
  ageScale,
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

type MainControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps
) => {
  return (
    <>
      <GridDiv>
        <Tooltip title="Price" placement="bottom">
          <LocalOfferIcon color="warning" />
        </Tooltip>
        <SliderRangeInput
          inputProps={{
            title: 'Price',
            name: 'price',
            min: 0,
            max: 60,
            step: 1,
            format: priceFormatter
          }}
          minValueName={'minPrice'}
          maxValueName={'maxPrice'}
          minValue={props.searchData.minPrice}
          maxValue={props.searchData.maxPrice}
          update={props.update}
          scale={{ scale: priceScale, reverseScale: priceReverseScale }}
        />
      </GridDiv>
      <GridDiv>
        <Tooltip title="ARV" placement="bottom">
          <OtherHousesIcon color="secondary" />
        </Tooltip>
        <SliderRangeInput
          inputProps={{
            title: 'ARV',
            name: 'arv',
            min: 0,
            max: 60,
            step: 1,
            format: priceFormatter
          }}
          minValueName={'minArv'}
          maxValueName={'maxArv'}
          minValue={props.searchData.minArv}
          maxValue={props.searchData.maxArv}
          update={props.update}
          scale={{ scale: priceScale, reverseScale: priceReverseScale }}
        />
      </GridDiv>

      <GridDiv>
        <Tooltip title="Radius" placement="bottom">
          <TrackChangesIcon color="error" />
        </Tooltip>
        <SliderInput
          inputProps={{
            title: 'Radius',
            name: 'distance',
            min: 0,
            max: 10,
            step: 0.5
          }}
          value={props.searchData.distance}
          update={props.update}
        />
      </GridDiv>
      <GridDiv>
        <Tooltip title="Comps" placement="bottom">
          <PriceCheckIcon color="success" />
        </Tooltip>
        <SliderInput
          inputProps={{
            title: 'Under Comps',
            name: 'underComps',
            min: 0,
            max: 100,
            step: 1
          }}
          value={props.searchData.underComps}
          update={props.update}
        />
      </GridDiv>
      <GridDiv>
        <Tooltip title="Age" placement="bottom">
          <AccessTimeIcon />
        </Tooltip>
        <SliderInput
          inputProps={{
            title: 'Age',
            name: 'soldAge',
            min: 0,
            max: 8,
            step: 1,
            format: ageFormatter
          }}
          value={props.searchData.soldAge}
          update={props.update}
          scale={{ scale: ageScale, reverseScale: ageReverseScale }}
        />
      </GridDiv>
    </>
  );
};

export default MainControls;
