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

const containerStyle = {
  width: '100%',
  height: '25em'
};

const center = {
  lat: 33.429565,
  lng: -86.84005
};

type MapsProps = {
  selectedDeal?: Deal;
};

const Maps: React.FC<MapsProps> = (props: MapsProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDRAjRxho27NBp9vLVYmuAxENL0QWf7Cvo'
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [selectedHouse, setSelectedHouse] = useState<string>('');
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
    map.setCenter(center);
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    // setMap(map);
  }, []);

  useEffect(() => {
    if (props.selectedDeal) {
      map.setCenter({
        lat: props.selectedDeal.house.latitude,
        lng: props.selectedDeal.house.longitude
      });
    }
  }, [props.selectedDeal]);

  const handleMouseHover = (houseId: string) => {
    setSelectedHouse(houseId);
  };
  const handleMouseOut = (houseId: string) => {
    setSelectedHouse('');
  };

  const onUnmount = useCallback(function callback(map: any) {
    // setMap(null);
  }, []);

  const selectedHouseMarker = () => {
    return props.selectedDeal ? (
      <Marker
        position={{
          lat: props.selectedDeal!.house.latitude,
          lng: props.selectedDeal!.house.longitude
        }}
        // icon={props.selectedDeal!.house.imgSrc}
      />
    ) : (
      <></>
    );
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
              selectedHouse === house.zpid ? google.maps.Animation.BOUNCE : ''
            }
          >
            {selectedHouse === house.zpid && (
              <InfoWindow
              // position={{ lat: house.latitude, lng: house.longitude }}
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
        // optional
        // onLoad={onLoad}
        // optional
        // onUnmount={onUnmount}
        // required
        center={{
          lat: props.selectedDeal.house.latitude,
          lng: props.selectedDeal.house.longitude
        }}
        // required
        options={options}
      />
    ) : (
      <></>
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      // center={
      //   (props.selectedDeal && {
      //     lat: props.selectedDeal.house.latitude,
      //     lng: props.selectedDeal.house.longitude
      //   }) ||
      //   center
      // }
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
        <></>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(Maps);
