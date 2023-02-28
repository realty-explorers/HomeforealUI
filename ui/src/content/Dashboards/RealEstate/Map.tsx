import React from 'react';
import Deal from '@/models/deal';
import { Card, CardContent, Grid, styled, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import MapComponent from './MapComponent';
import SliderInput from './SliderInput';
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
import SliderRangeInput from './SliderRangeInput';

const MapCard = styled(Card)(({}) => ({
  margin: '0',
  backgroundColor: 'rgba(255,255,255,0.5)'
  // ...(selected && {
  //   boxShadow:
  //     '0px 0px 30px rgba(0, 24, 255, 0.8),0px 2px 20px rgba(159, 162, 191, 0.7)'
  // })
}));

const GridDiv = styled('div')(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  '> svg': {
    marginBottom: '0.5em'
  }
}));

type MapProps = {
  selectedDeal?: Deal;
  setSelectedDeal: (deal: Deal) => void;
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
    <div
      style={{
        position: 'relative',
        zIndex: 0,
        width: '100%', // or you can use width: '100vw'
        height: '100%' // or you can use height: '100vh'
      }}
    >
      <div style={{ position: 'absolute', zIndex: 1, right: 100, top: 5 }}>
        <MapCard>
          <CardContent>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={3}
              sx={{ width: 'auto', height: 200, margin: 0, padding: '0 1em' }}
            >
              <GridDiv>
                <Tooltip title="Price" placement="bottom">
                  <LocalOfferIcon color="warning" />
                </Tooltip>
                <SliderRangeInput
                  inputProps={{
                    title: 'Price',
                    name: 'price',
                    min: 0,
                    max: 1000000,
                    step: 100000
                  }}
                  minValueName={'minPrice'}
                  maxValueName={'maxPrice'}
                  value={[
                    parseInt(searchData.minPrice),
                    parseInt(searchData.maxPrice)
                  ]}
                  setMinValue={setMinPrice}
                  setMaxValue={setMaxPrice}
                  update={searchProperties}
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
                    max: 1000000,
                    step: 100000
                  }}
                  minValueName={'minArv'}
                  maxValueName={'maxArv'}
                  value={[
                    parseInt(searchData.minArv),
                    parseInt(searchData.maxArv)
                  ]}
                  setMinValue={setMinArv}
                  setMaxValue={setMaxArv}
                  update={searchProperties}
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
                  value={searchData.distance}
                  setValue={setDistance}
                  update={searchProperties}
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
                  value={searchData.underComps}
                  setValue={setUnderComps}
                  update={searchProperties}
                />
              </GridDiv>
            </Grid>
          </CardContent>
        </MapCard>
      </div>
      <MapComponent
        selectedDeal={props.selectedDeal}
        setSelectedDeal={props.setSelectedDeal}
        searching={searching}
      />
    </div>
  );
};

export default Map;
