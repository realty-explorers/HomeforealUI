import Deal from '@/models/deal';
import { locationApiEndpoints } from '@/store/services/locationApiService';
import {
  propertiesApiEndpoints,
  useGetPropertiesQuery
} from '@/store/services/propertiesApiService';
import { selectFilter } from '@/store/slices/filterSlice';
import { selectLocation } from '@/store/slices/locationSlice';
import {
  selectProperties,
  setSelectedDeal
} from '@/store/slices/propertiesSlice';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardsPanel from './MapComponents/CardsPanel';
import LocationBounds from './MapComponents/LocationBounds';
import PropertiesMarkers from './MapComponents/PropertiesMarkers';
import PropertyRadius from './MapComponents/PropertyRadius';
import SelectedPropertyMarker from './MapComponents/SelectedPropertyMarker';
import SoldPropertiesMarkers from './MapComponents/SoldPropertiesMarkers';
import MapControlPanel from './MapControlPanel/MapControlPanel';
import MapControls from './MapControls/MapControls';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%'
};

const center = {
  lat: 33.429565,
  lng: -86.84005
};

type MapComponentProps = {};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps
) => {
  const { selectedDeal } = useSelector(selectProperties);

  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const {
    arvMargin,
    compsMargin,
    maxBaths,
    minBaths,
    maxBeds,
    minBeds,
    minListingPrice,
    maxListingPrice,
    minSqft,
    maxSqft,
    propertyTypes
  } = useSelector(selectFilter);
  const locationState =
    locationApiEndpoints.getLocationData.useQueryState(suggestion);
  const propertiesState =
    propertiesApiEndpoints.getDeals.useQueryState(suggestion);

  //Resubscribe to redux cache so the data wont be lost when the component unmounts
  locationApiEndpoints.getLocationData.useQuerySubscription(suggestion);
  propertiesApiEndpoints.getDeals.useQuerySubscription(suggestion);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  });
  const [map, updateMap] = useState<google.maps.Map>();

  const filterDeals: (deals?: Deal[]) => Deal[] = (deals?: Deal[]) => {
    const filteredDeals = deals?.filter((deal) => {
      if (deal.property.beds < minBeds || deal.property.beds > maxBeds) {
        return false;
      }
      if (deal.property.baths < minBaths || deal.property.baths > maxBaths) {
        return false;
      }
      if (
        deal.property.price < minListingPrice ||
        deal.property.price > maxListingPrice
      ) {
        return false;
      }
      if (deal.profit < arvMargin) {
        return false;
      }
      if (deal.profit < compsMargin) {
        return false;
      }
      if (deal.property.area < minSqft || deal.property.area > maxSqft) {
        return false;
      }
      if (!propertyTypes.includes(deal.property.type)) {
        return false;
      }
      return true;
    });
    return filteredDeals;
  };

  const handleMapClicked = () => {
    dispatch(setSelectedDeal(null));
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    updateMap(map);
    map.setCenter(center);
    map.setOptions({
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControl: false
    });
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
    map.controls[google.maps.ControlPosition.TOP_LEFT].clear();
  }, []);

  useEffect(() => {
    console.log(locationState.data?.center.latitude);
    if (selectedDeal && map) {
      map.panTo({
        lat: selectedDeal.property.latitude,
        lng: selectedDeal.property.longitude
      });
    } else {
      if (locationState.data && map) {
        map.panTo({
          lat: locationState.data.center.latitude,
          lng: locationState.data.center.longitude
        });
      }
    }
  }, [selectedDeal, locationState.currentData, propertiesState.currentData]);

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

  const test = () => {
    return (
      <h1>
        <p></p>
      </h1>
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClicked}
      options={{
        gestureHandling: 'greedy',
        styles: [
          {
            elementType: 'labels',
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            elementType: 'labels',
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      }}
    >
      <CardsPanel
        deals={filterDeals(propertiesState.data)}
        selectedDeal={selectedDeal}
        setSelectedDeal={(deal: Deal) => dispatch(setSelectedDeal(deal))}
      />
      {/* <MapControls /> */}
      <MapControlPanel />
      <LocationBounds locationData={locationState.data} />
      {selectedDeal ? (
        <>
          {/* <PropertyRadius selectedDeal={selectedDeal} /> */}
          <SelectedPropertyMarker
            selectedDeal={selectedDeal}
            setSelectedDeal={(deal: Deal) => dispatch(setSelectedDeal(deal))}
          />
          <SoldPropertiesMarkers
            selectedDeal={selectedDeal}
            setSelectedDeal={(deal: Deal) => dispatch(setSelectedDeal(deal))}
          />
        </>
      ) : (
        <PropertiesMarkers
          deals={propertiesState.data}
          setSelectedDeal={(deal: Deal) => dispatch(setSelectedDeal(deal))}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
