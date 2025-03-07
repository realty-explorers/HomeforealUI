'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapBox, {
  FullscreenControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  ViewStateChangeEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import type { MapRef } from 'react-map-gl';
import type { GeoJSONSource } from 'react-map-gl';
import { clusterLayer } from './MapComponents/Layers/layers';
import MapControlPanel from './MapControlPanel/MapControlPanel';
import { FeatureCollection, Geometry } from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import {
  locationApi,
  locationApiEndpoints
} from '@/store/services/locationApiService';
import {
  propertiesApiEndpoints,
  useLazyGetPropertyQuery
} from '@/store/services/propertiesApiService';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';
import PropertyPreview from '@/models/propertyPreview';
import CardsPanel from './MapComponents/CardsPanel/CardsPanel';
import {
  selectFilter,
  setBuybox,
  setPropertyTypes
} from '@/store/slices/filterSlice';
import {
  selectProperties,
  setRentalCalculatedProperty,
  setSaleCalculatedProperty,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyLocation,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
  setSelecting
} from '@/store/slices/propertiesSlice';

import PropertiesSource from './MapComponents/Sources/PropertiesSource';
import CompsSource from './MapComponents/Sources/CompsSource';
import LocationBoundsSource from './MapComponents/Sources/LocationBoundsSource';
import SelectedPropertyMarker from './MapComponents/Markers/SelectedPropertyMarker';
import MarkerPopup from './MapComponents/Overlays/MarkerPopup';
import {
  generateCompsGeoJson,
  generatePropertyGeoJson
} from './MapUtils/CoordinatesUtils';
import {
  INITIAL_VIEW_STATE,
  MAPBOX_STYLE,
  MAPBOX_TOKEN,
  US_BOUNDS
} from './MapUtils/constants';
import { CircularProgress } from '@mui/material';
import CompMarkersPopup from './MapComponents/Overlays/CompMarkerPopup';
import LoadingSpinner from './MapComponents/Overlays/LoadingSpinner';
import RentalsSource from './MapComponents/Sources/RentalsSource';
import PropertyLocationBoundsSource from './MapComponents/Sources/PropertyLocationBoundsSource';
import useProperty from '@/hooks/useProperty';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSnackbar } from 'notistack';
import { setMapLoading } from '@/store/slices/mapSlice';
import styles from './Map.module.scss';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLazyGetBuyBoxesQuery } from '@/store/services/buyboxApiService';

type MapProps = {};
const Map: React.FC<MapProps> = (props: MapProps) => {
  const { data: user, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBuyBoxId = searchParams.get('buybox_id') as string;
  const selectedPropertyId = searchParams.get('property_id') as string;

  const mapRef = useRef<MapRef>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [data, setData] = useState<
    FeatureCollection<
      Geometry,
      {
        [name: string]: any;
      }
    >
  >();
  const [compsData, setCompsData] = useState<
    FeatureCollection<
      Geometry,
      {
        [name: string]: any;
      }
    >
  >();

  const [rentalsData, setRentalsData] = useState<
    FeatureCollection<
      Geometry,
      {
        [name: string]: any;
      }
    >
  >();

  const [boundsData, setBoundsData] = useState<Geometry>();
  const [propertyBoundsData, setPropertyBoundsData] = useState<Geometry>();
  const [hoveredProperty, setHoveredProperty] = useState<any>();
  const [hoveredComp, setHoveredComp] = useState<any>();

  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const { filteredProperties, strategyMode, buybox } =
    useSelector(selectFilter);
  const {
    selectedPropertyPreview,
    selectedComps,
    selectedRentalComps,
    selectedProperty,
    selectedPropertyLocation,
    selecting
  } = useSelector(selectProperties);

  const { selectProperty, deselectProperty, selectPropertyId, propertyState } =
    useProperty();

  // const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const locationState = locationApiEndpoints.getLocationData.useQueryState(
    suggestion || skipToken
  );

  const propertiesState =
    propertiesApiEndpoints.getPropertiesPreviews.useQueryState(
      suggestion && buybox ? { suggestion, buybox_id: buybox?.id } : skipToken
    );

  const handleDeselectProperty = () => {
    deselectProperty();
  };

  const handleSelectProperty = async (property?: PropertyPreview) => {
    selectProperty(property);
  };

  const onMove = useCallback((viewState: ViewStateChangeEvent) => {
    const newCenter = {
      ...viewState.viewState
    };
    setViewState(newCenter);
    // Only update the view state if the center is inside the geofence
    // if (
    //   turf.booleanPointInPolygon(
    //     [newCenter.longitude, newCenter.latitude],
    //     GEOFENCE,
    //   )
    // ) {
    //   setViewState(newCenter);
    // }
  }, []);

  const handleClickCluster = (
    event: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    const feature = event.features[0];
    if (feature) {
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current?.getSource(
        'properties'
      ) as GeoJSONSource;

      mapboxSource?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current?.flyTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500,
          pitch: 0
        });
      });
    }
  };

  const handleHoverProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    if (mapRef?.current) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    }
    const feature = e.features[0];
    const hoveredProperty = filteredProperties?.find(
      (property) => property.id === feature.properties.id
    );
    setHoveredProperty(hoveredProperty);
  };

  const handleMouseLeaveProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    if (mapRef?.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
    setHoveredProperty(null);
  };

  const handleClickProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    const feature = e.features[0];

    const selectedProperty = filteredProperties?.find(
      (property) => property.id === feature.properties.id
    );
    handleSelectProperty(selectedProperty);
  };

  const handleMouseEnterComps = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    const feature = e.features[0];
    const hoveredProperty = selectedComps?.find(
      (property) => property.index === feature.properties.index - 1
    );
    setHoveredComp(hoveredProperty);

    // const angle = Math.atan2(
    //   hoveredProperty.longitude - selectedPropertyPreview.longitude,
    //   hoveredProperty.latitude - selectedPropertyPreview.latitude,
    // ) *
    //   (180 / Math.PI);
    // alert(angle);
    // mapRef.current?.rotateTo(-angle, {
    //   duration: 1000,
    // });
  };

  const handleMouseLeaveComps = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    setHoveredComp(null);
  };

  const handleMouseEnterRentals = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    const feature = e.features[0];
    const hoveredProperty = selectedRentalComps?.find(
      (property) => property.index === feature.properties.index - 1
    );
    setHoveredComp(hoveredProperty);
  };

  const handleMouseLeaveRentals = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData
  ) => {
    setHoveredComp(null);
  };

  const handleRender = () => {
    // if (!mapRef.current?.isSourceLoaded("properties")) return;
  };

  const centerMap = () => {
    if (mapRef && locationState.data?.center) {
      mapRef.current?.flyTo({
        center: [
          locationState.data.center.longitude,
          locationState.data.center.latitude
        ],
        zoom: 11,
        pitch: 0,
        duration: 2000
      });
      // mapRef.current?.fitBounds(locationState.data.bounds);
    }
  };

  const handleResize = () => {
    mapRef.current?.resize();
    const infoEl = document.getElementsByClassName(
      'mapboxgl-ctrl mapboxgl-ctrl-attrib'
    );
    infoEl[0]?.classList.add('mapboxgl-compact');
  };

  function enableLineAnimation() {
    alert(mapRef?.current);
  }

  const [getBuyBoxes, buyBoxesState] = useLazyGetBuyBoxesQuery();

  useEffect(() => {
    if (!router.isReady || !user?.user) return;
    const getBuyBoxesData = async () => {
      try {
        const data = await getBuyBoxes('', true).unwrap();
        if (data && data.length > 0) {
          if (selectedBuyBoxId) {
            const selectedBuyBox = data.find(
              (buybox) => buybox.id === selectedBuyBoxId
            );
            if (selectedBuyBox) {
              dispatch(setBuybox(selectedBuyBox));
            } else {
              enqueueSnackbar(`BuyBox not found in your allowed BuyBoxes`, {
                variant: 'warning'
              });
            }
          } else {
            // const defaultBuyBox = data.find(
            //   (buybox) => buybox.parameters.name === 'General BuyBox'
            // );

            const defaultBuyBox = data[0];
            router.push(
              {
                pathname: router.pathname,
                query: {
                  buybox_id: defaultBuyBox.id
                }
              },
              undefined,
              { shallow: true }
            );
            dispatch(setBuybox(defaultBuyBox));
          }
        }
      } catch (error) {
        let message = 'Something went wrong, try again later :(';
        console.error(error);
        if (error.status === 'FETCH_ERROR') {
          message = `Connection failed, try again later`;
        } else if (error.status === 401) {
          message = 'You were disconnected, please sign in again';
          // router.push('/api/auth/logout');
          // signOut();
        }
        enqueueSnackbar(message, {
          variant: 'error'
        });
      }
    };
    getBuyBoxesData();

    if (selectedBuyBoxId && selectedPropertyId) {
      console.log('selecting property');
      selectPropertyId(
        selectedBuyBoxId,
        selectedPropertyId,
        !user.user.verified
      );
    } else {
      dispatch(setSelectedPropertyPreview(null));
      mapRef.current?.setPitch(0);
      dispatch(locationApi.util.invalidateTags(['Suggestion', 'LocationData']));
      dispatch(setSuggestion(null));
    }
  }, [router.isReady, user?.user, user?.user?.verified]);

  useEffect(() => {
    mapRef?.current?.on('render', handleRender);
    mapRef?.current?.on('click', 'unclustered-point', handleClickProperty);
    mapRef?.current?.on('mouseenter', 'unclustered-point', handleHoverProperty);
    mapRef?.current?.on(
      'mouseleave',
      'unclustered-point',
      handleMouseLeaveProperty
    );
    mapRef?.current?.on('click', 'clusters', handleClickCluster);

    return () => {
      mapRef.current?.off('click', 'unclustered-point', handleClickProperty);
      mapRef?.current?.off(
        'mouseenter',
        'unclustered-point',
        handleHoverProperty
      );
      mapRef?.current?.off(
        'mouseleave',
        'unclustered-point',
        handleMouseLeaveProperty
      );

      mapRef.current?.off('click', 'clusters', handleClickCluster);
    };
  }, [mapRef.current, filteredProperties]);

  useEffect(() => {
    centerMap();
    if (locationState.data?.bounds && locationState.data?.type) {
      const bounds = locationState.data.bounds;
      const newData: Geometry = {
        type: locationState.data.type,
        coordinates: bounds
      };
      setBoundsData(newData);
    }
  }, [locationState.data]);

  useEffect(() => {
    if (selectedPropertyLocation?.bounds && selectedPropertyLocation?.type) {
      const bounds = selectedPropertyLocation.bounds;
      const newData: Geometry = {
        type: selectedPropertyLocation.type,
        coordinates: bounds
      };
      setPropertyBoundsData(newData);
    }
  }, [selectedPropertyLocation]);

  useEffect(() => {
    const coordinates = [];
    if (filteredProperties?.length > 0) {
      for (const property of filteredProperties) {
        coordinates.push(generatePropertyGeoJson(property, strategyMode));
      }
      const newData: FeatureCollection<
        Geometry,
        {
          [name: string]: any;
        }
      > = {
        type: 'FeatureCollection',
        features: coordinates
      };
      setData(newData);
    } else {
      if (buybox && suggestion) {
        enqueueSnackbar('No results found', {
          variant: 'default',
          preventDuplicate: true
        });
      }
      setData(null);
    }
  }, [filteredProperties]);

  useEffect(() => {
    mapRef.current?.resize();
    dispatch(setSelecting(true));

    if (selectedPropertyPreview) {
      mapRef.current?.flyTo({
        center: selectedPropertyPreview?.coordinates,
        zoom: selectedPropertyPreview.masked ? 12 : 15,
        pitch: selectedPropertyPreview.masked ? 0 : 70,
        speed: 0.1,
        duration: 1500
      });
    } else {
      mapRef.current?.flyTo({
        zoom: mapRef.current.getZoom() - 1,
        pitch: 0,
        speed: 0.1,
        duration: 1500
      });
      // centerMap();
    }

    const selectTimeout = setTimeout(() => {
      dispatch(setSelecting(false));
    }, 1500);
    return () => clearTimeout(selectTimeout);
  }, [selectedPropertyPreview]);

  useEffect(() => {
    mapRef?.current?.on('mouseenter', 'comps-point', handleMouseEnterComps);
    mapRef?.current?.on('mouseleave', 'comps-point', handleMouseLeaveComps);

    const coordinates = [];
    if (selectedComps?.length > 0) {
      for (let i = 0; i < selectedComps.length; i++) {
        coordinates.push(generateCompsGeoJson(selectedComps[i]));
      }
      const newData: FeatureCollection<
        Geometry,
        {
          [name: string]: any;
        }
      > = {
        type: 'FeatureCollection',
        features: coordinates
      };
      setCompsData(newData);
    }

    return () => {
      mapRef?.current?.off('mouseenter', 'comps-point', handleMouseEnterComps);
      mapRef?.current?.off('mouseleave', 'comps-point', handleMouseLeaveComps);
    };
  }, [selectedComps]);

  useEffect(() => {
    mapRef?.current?.on('mouseenter', 'rentals-point', handleMouseEnterRentals);
    mapRef?.current?.on('mouseleave', 'rentals-point', handleMouseLeaveRentals);

    const coordinates =
      selectedRentalComps?.map((comp) => generateCompsGeoJson(comp)) || [];
    const newData: FeatureCollection<
      Geometry,
      {
        [name: string]: any;
      }
    > = {
      type: 'FeatureCollection',
      features: coordinates
    };
    setRentalsData(newData);

    return () => {
      mapRef?.current?.off(
        'mouseenter',
        'rentals-point',
        handleMouseEnterRentals
      );
      mapRef?.current?.off(
        'mouseleave',
        'rentals-point',
        handleMouseLeaveRentals
      );
    };
  }, [selectedRentalComps]);

  const handleLoad = () => {
    setLoading(false);
    dispatch(setMapLoading(false));
    mapRef?.current?.loadImage(
      '/static/images/pins/marker-label.png',
      (error, image) => {
        if (error) throw error;
        mapRef?.current?.addImage('custom-marker', image);
      }
    );
  };

  return (
    <>
      {(loading || propertyState.isFetching) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      <MapBox
        reuseMaps
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        style={{
          width: '100%',
          height: '100%',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.5s ease',
          position: 'relative'
        }}
        onLoad={handleLoad}
        interactiveLayerIds={[clusterLayer.id]}
        onResize={handleResize}
        onMove={onMove}
        ref={mapRef}
        maxBounds={US_BOUNDS}
        initialViewState={INITIAL_VIEW_STATE}
        {...viewState}
      >
        <FullscreenControl style={{ display: 'var(--controls-display)' }} />
        <NavigationControl
          visualizePitch={true}
          style={{ display: 'var(--controls-display)' }}
        />
        <LoadingSpinner
          loading={propertiesState.isFetching || locationState.isFetching}
        />
        <MapControlPanel />
        <LocationBoundsSource show={true} data={boundsData} />
        <SelectedPropertyMarker
          onClick={handleDeselectProperty}
          selectedProperty={selectedPropertyPreview}
        />

        <CardsPanel open={Boolean(propertiesState.data)} />
        <PropertyLocationBoundsSource
          show={
            !selecting &&
            Boolean(selectedPropertyPreview) &&
            !selectedPropertyPreview?.masked
          }
          data={propertyBoundsData}
          map={mapRef.current?.getMap()}
        />
        <PropertiesSource show={!selectedPropertyPreview} data={data} />
        <CompsSource
          show={Boolean(selectedPropertyPreview && !selecting)}
          data={compsData}
        />
        <RentalsSource
          show={Boolean(selectedPropertyPreview && !selecting)}
          data={rentalsData}
        />
        <MarkerPopup property={hoveredProperty} />
        <CompMarkersPopup comp={hoveredComp} />
      </MapBox>
    </>
  );
};

export default Map;
