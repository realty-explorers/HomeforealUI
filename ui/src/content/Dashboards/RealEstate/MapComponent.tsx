import React, { useCallback, useState, memo, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
  InfoBox,
  InfoWindow,
  OverlayView
} from '@react-google-maps/api';
import Deal from '@/models/deal';
import House from '@/models/house';
import { Card, CardContent, CardMedia, Grid, List } from '@mui/material';
import PropertyMapCard from './PropertyMapCard';
import { useSelector } from 'react-redux';
import { selectSearchData, selectSearchResults } from '@/store/searchSlice';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '25em'
};

const center = {
  lat: 33.429565,
  lng: -86.84005
};

type MapComponentProps = {
  selectedDeal?: Deal;
  setSelectedDeal: (deal: Deal) => void;
  searching: boolean;
};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps
) => {
  const searchResults = useSelector(selectSearchResults);
  const searchData = useSelector(selectSearchData);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDRAjRxho27NBp9vLVYmuAxENL0QWf7Cvo'
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [hoveredHouse, setHoveredHouse] = useState<string>('');
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
    map.setCenter(center);
  }, []);

  useEffect(() => {
    if (props.selectedDeal) {
      props.setSelectedDeal(
        searchResults.find(
          (deal: Deal) => deal.house.id === props.selectedDeal.house.id
        )
      );
      map.setCenter({
        lat: props.selectedDeal.house.latitude,
        lng: props.selectedDeal.house.longitude
      });
    } else if (searchResults.length > 0) {
    }
  }, [props.selectedDeal, props.searching]);

  const handleMouseHover = (houseId: string) => {
    setHoveredHouse(houseId);
  };
  const handleMouseOut = (houseId: string) => {
    setHoveredHouse('');
  };

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const selectedHouseMarker = () => {
    return props.selectedDeal ? (
      <Marker
        position={{
          lat: props.selectedDeal!.house.latitude,
          lng: props.selectedDeal!.house.longitude
        }}
        onClick={() => {
          props.setSelectedDeal(null);
          setHoveredHouse('');
        }}
        // icon={props.selectedDeal!.house.imgSrc}
      />
    ) : (
      <></>
    );
  };

  const searchResultsMarkers = () => {
    return searchResults.map((deal: Deal, index: number) => (
      <Marker
        key={index}
        position={{ lat: deal.house.latitude, lng: deal.house.longitude }}
        onMouseOver={() => handleMouseHover(deal.house.zpid)}
        onMouseOut={() => handleMouseOut(deal.house.zpid)}
        onClick={() => {
          props.setSelectedDeal(deal);
          setHoveredHouse('');
        }}
      >
        {hoveredHouse === deal.house.zpid && (
          <InfoWindow
            position={{ lat: deal.house.latitude, lng: deal.house.longitude }}
          >
            <PropertyMapCard house={deal.house} />
          </InfoWindow>
        )}
      </Marker>
    ));
  };

  const soldHousesMarkers = () => {
    return props.selectedDeal ? (
      props.selectedDeal?.relevantSoldHouses.map(
        (house: House, index: number) => (
          <Marker
            key={index}
            position={{ lat: house.latitude, lng: house.longitude }}
            icon={'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
            onMouseOver={() => handleMouseHover(house.zpid)}
            onMouseOut={() => handleMouseOut(house.zpid)}
            animation={
              hoveredHouse === house.zpid ? google.maps.Animation.BOUNCE : ''
            }
          >
            {hoveredHouse === house.zpid && (
              <InfoWindow
                position={{ lat: house.latitude, lng: house.longitude }}
              >
                <PropertyMapCard house={house} />
              </InfoWindow>
            )}
          </Marker>
        )
      )
    ) : (
      <></>
    );
  };

  const searchResultsRadiusCircle = () => {
    console.log(searchData.location.metaData?.lng);
    const distanceInKilometers = searchData.distance * 1609.34;
    const options = {
      strokeColor: '#FF0000',
      // strokeOpacity: 0.3,
      strokeOpacity: 0.1,
      strokeWeight: 2,
      fillColor: '#F9E076',
      // fillOpacity: 0.15,
      fillOpacity: 0.05,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: distanceInKilometers,
      zIndex: 1
    };
    return searchResults.map((deal: Deal, index: number) => (
      <Circle
        key={index}
        center={{
          lat: deal.house.latitude,
          lng: deal.house.longitude
        }}
        options={options}
      />
    ));

    return searchData.location?.metaData ? (
      <Circle
        center={{
          lat: searchData.location.metaData.lat,
          lng: searchData.location.metaData.lng
        }}
        options={options}
      />
    ) : (
      <></>
    );
  };

  const houseRadiusCircle = () => {
    const distanceInKilometers = (props.selectedDeal?.distance || 0) * 1609.34;
    const options = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#F9E076',
      fillOpacity: 0.15,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: distanceInKilometers,
      zIndex: 1
    };

    return props.selectedDeal ? (
      <Circle
        key={1}
        center={{
          lat: props.selectedDeal.house.latitude,
          lng: props.selectedDeal.house.longitude
        }}
        options={options}
      />
    ) : (
      <></>
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {props.selectedDeal ? (
        <>
          {houseRadiusCircle()}
          {selectedHouseMarker()}
          {soldHousesMarkers()}
        </>
      ) : (
        <>
          {/* {searchResultsRadiusCircle()} */}
          {searchResultsMarkers()}
        </>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
