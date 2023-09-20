import { locationApiEndpoints } from "@/store/services/locationApiService";
import {
  propertiesApiEndpoints,
  useGetPropertiesQuery,
} from "@/store/services/propertiesApiService";
import { selectFilter } from "@/store/slices/filterSlice";
import { selectLocation } from "@/store/slices/locationSlice";
import {
  selectProperties,
  setSelectedComps,
  setSelectedProperty,
} from "@/store/slices/propertiesSlice";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsPanel from "./MapComponents/CardsPanel";
import LocationBounds from "./MapComponents/LocationBounds";
import PropertiesMarkers from "./MapComponents/PropertiesMarkers";
import PropertyRadius from "./MapComponents/PropertyRadius";
import SelectedPropertyMarker from "./MapComponents/SelectedPropertyMarker";
import SoldPropertiesMarkers from "./MapComponents/SoldPropertiesMarkers";
import MapControlPanel from "./MapControlPanel/MapControlPanel";
import MapControls from "./MapControls/MapControls";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const center = {
  lat: 33.429565,
  lng: -86.84005,
};

type MapComponentProps = {};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps,
) => {
  const { selectedProperty, selectedComps } = useSelector(selectProperties);

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
    propertyTypes,
  } = useSelector(selectFilter);
  const locationState = locationApiEndpoints.getLocationData.useQueryState(
    suggestion,
  );
  const propertiesState = propertiesApiEndpoints.getProperties.useQueryState(
    suggestion,
  );

  //Resubscribe to redux cache so the data wont be lost when the component unmounts
  locationApiEndpoints.getLocationData.useQuerySubscription(suggestion);
  propertiesApiEndpoints.getProperties.useQuerySubscription(suggestion);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });
  const [map, updateMap] = useState<google.maps.Map>();

  const handleSelectProperty = (property: AnalyzedProperty) => {
    dispatch(setSelectedProperty(property));
    dispatch(setSelectedComps(property?.CompsData));
  };

  const filterProperties: (
    properties?: AnalyzedProperty[],
  ) => AnalyzedProperty[] = (
    properties?: AnalyzedProperty[],
  ) => {
    const filteredProperties = properties?.filter((property) => {
      if (
        property.property.bedrooms < minBeds ||
        property.property.bedrooms > maxBeds
      ) {
        return false;
      }
      if (
        property.property.full_bathrooms < minBaths ||
        property.property.full_bathrooms > maxBaths
      ) {
        return false;
      }
      if (
        property.listing_price < minListingPrice ||
        property.listing_price > maxListingPrice
      ) {
        return false;
      }
      // if (property.margin_percentage < arvMargin) {
      //   return false;
      // }
      // if (property.sal < compsMargin) {
      //   return false;
      // }
      if (
        property.property.building_area < minSqft ||
        property.property.building_area > maxSqft
      ) {
        return false;
      }
      // if (!propertyTypes.includes(property.property.type)) {
      //   return false;
      // }
      return true;
    });
    return filteredProperties;
  };

  const handleMapClicked = () => {
    dispatch(setSelectedProperty(null));
    dispatch(setSelectedComps([]));
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    updateMap(map);
    map.setCenter(center);
    map.setOptions({
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      fullscreenControl: false,
    });
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
    map.controls[google.maps.ControlPosition.TOP_LEFT].clear();
  }, []);

  useEffect(() => {
    // console.log(locationState.data?.center.latitude);
    if (selectedProperty && map) {
      // map.panTo({
      //   lat: selectedProperty.property.latitude,
      //   lng: selectedProperty.property.longitude,
      // });
    } else {
      if (locationState.data && map) {
        map.panTo({
          lat: locationState.data.center.latitude,
          lng: locationState.data.center.longitude,
        });
      }
    }
  }, [
    selectedProperty,
    locationState.currentData,
    propertiesState.currentData,
  ]);

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

  return isLoaded
    ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClicked}
        options={{
          gestureHandling: "greedy",
          styles: [
            {
              elementType: "labels",
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              elementType: "labels",
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        <CardsPanel
          // deals={filterDeals(propertiesState.data)}
          properties={filterProperties(propertiesState.data)}
          selectedProperty={selectedProperty}
          setSelectedProperty={handleSelectProperty}
        />
        {/* <MapControls /> */}
        <MapControlPanel />
        <LocationBounds locationData={locationState.data} />
        {selectedProperty
          ? (
            <>
              {/* <PropertyRadius selectedDeal={selectedDeal} /> */}
              <SelectedPropertyMarker
                selectedProperty={selectedProperty}
                setSelectedProperty={handleSelectProperty}
              />
              <SoldPropertiesMarkers
                selectedComps={selectedComps}
              />
            </>
          )
          : (
            <PropertiesMarkers
              properties={propertiesState.data}
              setSelectedProperty={handleSelectProperty}
            />
          )}
      </GoogleMap>
    )
    : <></>;
};

export default memo(MapComponent);
