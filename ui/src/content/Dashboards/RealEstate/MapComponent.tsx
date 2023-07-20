import React, {
  useCallback,
  useState,
  memo,
  useEffect,
  createElement
} from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
  InfoWindow,
  Polygon
} from '@react-google-maps/api';
import Deal from '@/models/deal';
import CompsProperty from '@/models/comps_property';
import PropertyMapCard from './MapComponents/PropertyMapCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchData,
  selectSearchResults,
  setSearchDistance,
  setSearchForSaleAge,
  setSearchSoldMinArea,
  setSearchSoldMaxArea,
  setSearchForSaleMinArea,
  setSearchForSaleMaxArea,
  // setSearchForSaleAge,
  setSearchMaxArv,
  setSearchMaxBaths,
  setSearchMaxBeds,
  setSearchMaxPrice,
  setSearchMinArv,
  setSearchMinBaths,
  setSearchMinBeds,
  setSearchMinPrice,
  setSearchSoldAge,
  // setSearchSoldAge,
  setSearchUnderComps,
  setSearchPropertyTypes
} from '@/store/searchSlice';
import ReactDOM from 'react-dom';
import MapControls from './MapControls/MapControls';
import { debounce } from '@mui/material';
import useSearch from '@/hooks/useSearch';
import { openGoogleSearch } from '@/utils/windowFunctions';
import CardsPanel from './MapComponents/CardsPanel';
import LocationBounds from './MapComponents/LocationBounds';
import PropertiesMarkers from './MapComponents/PropertiesMarkers';
import PropertyRadius from './MapComponents/PropertyRadius';
import SoldPropertiesMarkers from './MapComponents/SoldPropertiesMarkers';
import SelectedPropertyMarker from './MapComponents/SelectedPropertyMarker';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%'
};

const center = {
  lat: 33.429565,
  lng: -86.84005
};

type MapComponentProps = {
  selectedDeal?: Deal;
  setSelectedDeal: (deal: Deal) => void;
  setOpenMoreDetails: (open: boolean) => void;
  searching: boolean;
};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps
) => {
  const { searchDeals } = useSearch();
  const searchResults = useSelector(selectSearchResults);
  const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();
  const [trueArv, setTrueArv] = useState<boolean>(false);

  const updateMinPrice = (value: number) => {
    dispatch(setSearchMinPrice(value.toString()));
  };

  const updateMaxPrice = (value: number) => {
    dispatch(setSearchMaxPrice(value.toString()));
  };
  const updateMinArv = (value: number) => {
    dispatch(setSearchMinArv(value.toString()));
  };
  const updateMaxArv = (value: number) => {
    dispatch(setSearchMaxArv(value.toString()));
  };
  const updateUnderComps = (value: number) => {
    dispatch(setSearchUnderComps(value));
  };
  const updateDistance = (value: number) => {
    dispatch(setSearchDistance(value));
  };

  const updateSoldAge = (value: number) => {
    dispatch(setSearchSoldAge(value));
  };
  const updateForSaleAge = (value: number) => {
    dispatch(setSearchForSaleAge(value));
  };
  const updateSoldMinArea = (value: number) => {
    dispatch(setSearchSoldMinArea(value));
  };
  const updateSoldMaxArea = (value: number) => {
    dispatch(setSearchSoldMaxArea(value));
  };
  const updateForSaleMinArea = (value: number) => {
    dispatch(setSearchForSaleMinArea(value));
  };
  const updateForSaleMaxArea = (value: number) => {
    dispatch(setSearchForSaleMaxArea(value));
  };
  const updateMinBeds = (value: number) => {
    dispatch(setSearchMinBeds(value));
  };
  const updateMaxBeds = (value: number) => {
    dispatch(setSearchMaxBeds(value));
  };
  const updateMinBaths = (value: number) => {
    dispatch(setSearchMinBaths(value));
  };
  const updateMaxBaths = (value: number) => {
    dispatch(setSearchMaxBaths(value));
  };
  const updatePropertyTypes = (value: string[]) => {
    dispatch(setSearchPropertyTypes(value));
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  });
  const [map, updateMap] = useState<google.maps.Map>();

  const update = (name: string, value: any) => {
    switch (name) {
      case 'minPrice':
        updateMinPrice(value);
        break;
      case 'maxPrice':
        updateMaxPrice(value);
        break;
      case 'minArv':
        updateMinArv(value);
        break;
      case 'maxArv':
        updateMaxArv(value);
        break;
      case 'underComps':
        updateUnderComps(value);
        break;
      case 'distance':
        updateDistance(value);
        break;
      case 'soldAge':
        updateSoldAge(value);
        break;
      case 'forSaleAge':
        updateForSaleAge(value);
        break;
      case 'minSoldArea':
        updateSoldMinArea(value);
        break;
      case 'maxSoldArea':
        updateSoldMaxArea(value);
        break;
      case 'minForSaleArea':
        updateForSaleMinArea(value);
        break;
      case 'maxForSaleArea':
        updateForSaleMaxArea(value);
        break;
      case 'minBeds':
        updateMinBeds(value);
        break;
      case 'maxBeds':
        updateMaxBeds(value);
        break;
      case 'minBaths':
        updateMinBaths(value);
        break;
      case 'maxBaths':
        updateMaxBaths(value);
        break;
      case 'propertyTypes':
        updatePropertyTypes(value);
        break;
      default:
        break;
    }
    debounceUpdate({ ...searchData, [name]: value });
  };

  const debounceUpdate = useCallback(debounce(searchDeals, 400), []);

  const handleMapClicked = () => {
    props.setSelectedDeal(null);
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    updateMap(map);
    map.setCenter(center);
    map.setOptions({
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControl: false
    });
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].clear();
  }, []);

  useEffect(() => {
    if (props.selectedDeal) {
      props.setSelectedDeal(
        searchResults.find(
          (deal: Deal) => deal.property.id === props.selectedDeal.property.id
        )
      );
      map.panTo({
        lat: props.selectedDeal.property.latitude,
        lng: props.selectedDeal.property.longitude
      });
    } else {
      if (searchData.location.metaData) {
        map.panTo({
          lat: searchData.location.metaData.lat,
          lng: searchData.location.metaData.lng
        });
      }
    }
  }, [props.selectedDeal, props.searching, searchData, searchResults]);

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

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
        deals={searchResults}
        selectedDeal={props.selectedDeal}
        setSelectedDeal={props.setSelectedDeal}
        setOpenMoreDetails={props.setOpenMoreDetails}
        trueArv={trueArv}
        setTrueArv={setTrueArv}
      />
      <MapControls searchData={searchData} update={update} />
      <LocationBounds searchData={searchData} />
      {props.selectedDeal ? (
        <>
          <PropertyRadius
            selectedDeal={props.selectedDeal}
            searchData={searchData}
          />
          <SelectedPropertyMarker
            selectedDeal={props.selectedDeal}
            setSelectedDeal={props.setSelectedDeal}
          />
          <SoldPropertiesMarkers
            searchResults={searchResults}
            selectedDeal={props.selectedDeal}
            setSelectedDeal={props.setSelectedDeal}
            trueArv={trueArv}
          />
        </>
      ) : (
        <PropertiesMarkers
          searchResults={searchResults}
          setSelectedDeal={props.setSelectedDeal}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
