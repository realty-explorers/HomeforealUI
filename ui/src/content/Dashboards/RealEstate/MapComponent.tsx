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
import PropertyMapCard from './PropertyMapCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchData,
  selectSearchResults,
  setSearchDistance,
  setSearchForSaleAge,
  setSearchMaxArea,
  // setSearchForSaleAge,
  setSearchMaxArv,
  setSearchMaxBaths,
  setSearchMaxBeds,
  setSearchMaxPrice,
  setSearchMinArea,
  setSearchMinArv,
  setSearchMinBaths,
  setSearchMinBeds,
  setSearchMinPrice,
  setSearchSoldAge,
  // setSearchSoldAge,
  setSearchUnderComps
} from '@/store/searchSlice';
import ReactDOM from 'react-dom';
import MapControls from './MapComponents/MapControls';
import { debounce } from '@mui/material';
import useSearch from '@/hooks/useSearch';
import { openGoogleSearch } from '@/utils/windowFunctions';
import CardsPanel from './MapComponents/CardsPanel';

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
  searching: boolean;
};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps
) => {
  const { searchDeals } = useSearch();
  const searchResults = useSelector(selectSearchResults);
  const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();

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
  const updateMinArea = (value: number) => {
    dispatch(setSearchMinArea(value));
  };
  const updateMaxArea = (value: number) => {
    dispatch(setSearchMaxArea(value));
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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  });
  const [map, updateMap] = useState<google.maps.Map>();
  const [root, setRoot] = useState<HTMLElement>();
  const [hoveredHouse, setHoveredHouse] = useState<string>('');

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
      case 'minArea':
        updateMinArea(value);
        break;
      case 'maxArea':
        updateMaxArea(value);
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
      default:
        break;
    }
    debounceUpdate({ ...searchData, [name]: value });
  };

  const debounceUpdate = useCallback(debounce(searchDeals, 400), []);

  const loadMapControls = (root: HTMLElement) => {
    // ReactDOM.render(
    //   <MapControls searchData={searchData} update={update} />,
    //   root
    // );
  };

  const handleMapClicked = () => {
    props.setSelectedDeal(null);
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    updateMap(map);
    map.setCenter(center);
    map.setOptions({
      // fullscreenControlOptions: {
      //   position: google.maps.ControlPosition.BOTTOM_LEFT
      // },
      streetViewControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT
      }
    });
    const rootElement = document.createElement('div');
    rootElement.id = 'map';
    loadMapControls(rootElement);
    setRoot(rootElement);
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
  }, []);

  useEffect(() => {
    if (map) {
      loadMapControls(root);
    }

    if (props.selectedDeal) {
      props.setSelectedDeal(
        searchResults.find(
          (deal: Deal) => deal.property.id === props.selectedDeal.property.id
        )
      );
      map.setCenter({
        lat: props.selectedDeal.property.latitude,
        lng: props.selectedDeal.property.longitude
      });
    } else {
      if (searchData.location.metaData) {
        map.setCenter({
          lat: searchData.location.metaData.lat,
          lng: searchData.location.metaData.lng
        });
      }
    }
  }, [props.selectedDeal, props.searching, searchData, searchResults]);

  const handleMouseHover = (houseId: string) => {
    setHoveredHouse(houseId);
  };
  const handleMouseOut = () => {
    setHoveredHouse('');
  };

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

  const locationBounds = () => {
    const bounds: any = searchData.locationData.bounds;
    console.log(searchData.locationData.type);
    if (bounds) {
      if (searchData.locationData.type === 'Polygon') {
        console.log('in polygon');
        const arr = bounds.map((bound) => {
          const bs = bound.map((b) => {
            return {
              lat: b.longitude,
              lng: b.latitude
            };
          });
          return bs;
        });
        return (
          <Polygon
            paths={arr}
            options={{
              fillColor: '#267dab',
              // fillOpacity: 0.4,
              fillOpacity: 0.1,
              strokeColor: '#267dab',
              strokeOpacity: 1,
              strokeWeight: 2
            }}
          />
        );
      } else {
        const arrr = bounds.map((a) => {
          const arr = a.map((bound) => {
            const bs = bound.map((b) => {
              return {
                lat: b.longitude,
                lng: b.latitude
              };
            });
            return bs;
          });
          return arr;
        });
        console.log(JSON.stringify(arrr));

        return arrr.map((a, index) => {
          return (
            <Polygon
              key={index}
              paths={a}
              options={{
                fillColor: '#267dab',
                // fillOpacity: 0.4,
                fillOpacity: 0.1,
                strokeColor: '#267dab',
                strokeOpacity: 1,
                strokeWeight: 2
              }}
            />
          );
        });
      }
    }
    return <></>;
  };

  const selectedHouseMarker = () => {
    return props.selectedDeal ? (
      <Marker
        position={{
          lat: props.selectedDeal!.property.latitude,
          lng: props.selectedDeal!.property.longitude
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
        position={{ lat: deal.property.latitude, lng: deal.property.longitude }}
        icon={{
          url: '/static/images/pins/greenPin.png',
          scaledSize: new google.maps.Size(40, 40)
        }}
        onMouseOver={() => handleMouseHover(deal.property.id)}
        onMouseOut={() => handleMouseOut()}
        onClick={() => {
          props.setSelectedDeal(deal);
          setHoveredHouse('');
        }}
      >
        {hoveredHouse === deal.property.id && (
          <InfoWindow
            position={{
              lat: deal.property.latitude,
              lng: deal.property.longitude
            }}
          >
            <PropertyMapCard property={deal.property} />
          </InfoWindow>
        )}
      </Marker>
    ));
  };

  const soldHousesMarkers = () => {
    return props.selectedDeal ? (
      props.selectedDeal?.relevantSoldHouses.map(
        (compsProperty: CompsProperty, index: number) => (
          <Marker
            key={index}
            position={{
              lat: compsProperty.latitude,
              lng: compsProperty.longitude
            }}
            icon={'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
            onMouseOver={() => handleMouseHover(compsProperty.id)}
            onMouseOut={() => handleMouseOut()}
            animation={
              hoveredHouse === compsProperty.id
                ? google.maps.Animation.BOUNCE
                : null
            }
            onClick={() => openGoogleSearch(compsProperty.address)}
          >
            {hoveredHouse === compsProperty.id && (
              <InfoWindow
                position={{
                  lat: compsProperty.latitude,
                  lng: compsProperty.longitude
                }}
              >
                <PropertyMapCard property={compsProperty} />
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
    const distanceInKilometers = (searchData.distance || 0) * 1609.34;
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
          lat: props.selectedDeal.property.latitude,
          lng: props.selectedDeal.property.longitude
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
      />
      <MapControls searchData={searchData} update={update} />
      {props.selectedDeal ? (
        <>
          {houseRadiusCircle()}
          {selectedHouseMarker()}
          {soldHousesMarkers()}
        </>
      ) : (
        <>{searchResultsMarkers()}</>
      )}

      {locationBounds()}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapComponent);
