import React from 'react';
import Deal from '@/models/deal';
import { Card, CardContent, Grid, styled, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import MapComponent from './MapComponent';
import SliderInput from './FormFields/SliderInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchData,
  setSearchDistance,
  // setSearchForSaleAge,
  setSearchMaxArv,
  setSearchMaxPrice,
  setSearchMinArv,
  setSearchMinPrice,
  // setSearchSoldAge,
  setSearchUnderComps
} from '@/store/searchSlice';
import useSearch from '@/hooks/useSearch';

type MapProps = {
  selectedDeal?: Deal;
  setSelectedDeal: (deal: Deal) => void;
  setOpenMoreDetails: (open: boolean) => void;
};
const Map: React.FC<MapProps> = (props: MapProps) => {
  const { searchDeals, searching } = useSearch();
  const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();

  const searchProperties = (value: any) => {
    searchDeals(value);
  };

  const setMinPrice = (value: number) => {
    dispatch(setSearchMinPrice(value.toString()));
  };

  const setMaxPrice = (value: number) => {
    dispatch(setSearchMaxPrice(value.toString()));
  };
  const setMinArv = (value: number) => {
    dispatch(setSearchMinArv(value.toString()));
  };
  const setMaxArv = (value: number) => {
    dispatch(setSearchMaxArv(value.toString()));
  };
  const setUnderComps = (value: number) => {
    dispatch(setSearchUnderComps(value));
  };
  const setDistance = (value: number) => {
    dispatch(setSearchDistance(value));
  };

  // const setForSaleAge = (value: string) => {
  //   dispatch(setSearchForSaleAge(value));
  // };

  // const setSoldAge = (value: string) => {
  //   dispatch(setSearchSoldAge(value));
  // };

  return (
    <MapComponent
      selectedDeal={props.selectedDeal}
      setSelectedDeal={props.setSelectedDeal}
      setOpenMoreDetails={props.setOpenMoreDetails}
      searching={searching}
    />
  );
};

export default Map;
