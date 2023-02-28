import React, { useCallback, useState, memo, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import Deal from '@/models/deal';
import House from '@/models/house';
import PropertyMapCard from './PropertyMapCard';
import { useSelector } from 'react-redux';
import { selectSearchResults } from '@/store/searchSlice';

const containerStyle: React.CSSProperties = {
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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
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
  const handleMouseOut = () => {
    setHoveredHouse('');
  };

  const onUnmount = useCallback(function callback() {
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
        onMouseOut={() => handleMouseOut()}
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
            onMouseOut={() => handleMouseOut()}
            animation={
              hoveredHouse === house.zpid ? google.maps.Animation.BOUNCE : null
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
        <>{searchResultsMarkers()}</>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
