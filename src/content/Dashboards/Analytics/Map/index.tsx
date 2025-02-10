import React, { useCallback, useState, memo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  });
  const [map, updateMap] = useState<google.maps.Map>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    updateMap(map);
    map.setCenter(center);
    map.setOptions({
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControl: false
    });
  }, []);

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
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
    ></GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
