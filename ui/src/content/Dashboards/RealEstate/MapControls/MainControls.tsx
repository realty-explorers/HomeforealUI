import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  ListItem,
  ListItemText,
  styled,
  Tooltip,
  Typography
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SliderRangeInput from '../FormFields/SliderRangeInput';
import SliderInput from '../FormFields/SliderInput';
import {
  ageFormatter,
  ageReverseScale,
  ageScale,
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import SliderField from './SliderField';

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

type MainControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const MainControls: React.FC<MainControlsProps> = (
  props: MainControlsProps
) => {
  return (
    <>
      <SliderField fieldName="Price">
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
      </SliderField>
      <SliderField fieldName="ARV">
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
      </SliderField>
      <SliderField fieldName="Radius">
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
      </SliderField>
      <SliderField fieldName="%⇩Comps">
        <SliderInput
          inputProps={{
            title: '%⇩Comps',
            name: 'underComps',
            min: 0,
            max: 100,
            step: 1
          }}
          value={props.searchData.underComps}
          update={props.update}
        />
      </SliderField>
      <SliderField fieldName="Comps Age">
        <SliderInput
          inputProps={{
            title: 'Comps Age',
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
      </SliderField>
    </>
  );
};

export default MainControls;
