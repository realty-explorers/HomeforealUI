'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  useGetPropertiesPreviewsQuery,
  useLazyGetPropertyQuery
} from '@/store/services/propertiesApiService';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';
import PropertyPreview from '@/models/propertyPreview';
import CardsPanel from './MapComponents/CardsPanel/CardsPanel';
import {
  selectBuybox,
  selectFilteredProperties,
  selectStrategyMode,
  setBuybox,
  setPropertyTypes
} from '@/store/slices/filterSlice';
import {
  selectMapFlyTarget,
  selectSelectedComps,
  selectSelectedProperty,
  selectSelectedPropertyLocation,
  selectSelectedPropertyPreview,
  selectSelectedRentalComps,
  selectSelecting,
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
import PropertyHeatmapSource from './MapComponents/Sources/PropertyHeatmapSource';
import CompsSource from './MapComponents/Sources/CompsSource';
import LocationBoundsSource from './MapComponents/Sources/LocationBoundsSource';
import LayersControl from './MapComponents/Controls/LayersControl';
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
import { registerPillImages } from './MapUtils/markerPills';
import { CircularProgress } from '@mui/material';
import CompMarkersPopup from './MapComponents/Overlays/CompMarkerPopup';
import LoadingSpinner from './MapComponents/Overlays/LoadingSpinner';
import WelcomeLoader from './MapComponents/Overlays/WelcomeLoader';
import RentalsSource from './MapComponents/Sources/RentalsSource';
import PropertyLocationBoundsSource from './MapComponents/Sources/PropertyLocationBoundsSource';
import MultifamilyAnalysisDrawer from './MapComponents/Overlays/MultifamilyAnalysisDrawer';
import useProperty from '@/hooks/useProperty';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSnackbar } from 'notistack';
import {
  selectHeatmapMode,
  selectShowBounds,
  selectShowMarkers,
  selectShowRentComps,
  selectShowSalesComps,
  setMapLoading
} from '@/store/slices/mapSlice';
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
  const isVerifiedUser = Boolean(
    (user?.user as { verified?: boolean } | undefined)?.verified
  );

  const mapRef = useRef<MapRef>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const [hoveredProperty, setHoveredProperty] = useState<any>();
  const [hoveredComp, setHoveredComp] = useState<any>();
  const compHoverClearTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const cancelCompHoverClear = useCallback(() => {
    if (compHoverClearTimer.current) {
      clearTimeout(compHoverClearTimer.current);
      compHoverClearTimer.current = null;
    }
  }, []);
  const scheduleCompHoverClear = useCallback(() => {
    cancelCompHoverClear();
    compHoverClearTimer.current = setTimeout(() => {
      setHoveredComp(null);
      compHoverClearTimer.current = null;
    }, 150);
  }, [cancelCompHoverClear]);

  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const filteredProperties = useSelector(selectFilteredProperties);
  const strategyMode = useSelector(selectStrategyMode);
  const buybox = useSelector(selectBuybox);
  const selectedBuyBoxStrategyType =
    buybox?.parameters?.strategy?.strategyType || 'FIX_AND_FLIP';
  const isMultifamilyBuybox = selectedBuyBoxStrategyType === 'MULTIFAMILY';
  const selectedPropertyPreview = useSelector(selectSelectedPropertyPreview);
  const selectedComps = useSelector(selectSelectedComps);
  const selectedRentalComps = useSelector(selectSelectedRentalComps);
  const selectedProperty = useSelector(selectSelectedProperty);
  const selectedPropertyLocation = useSelector(selectSelectedPropertyLocation);
  const selecting = useSelector(selectSelecting);
  const mapFlyTarget = useSelector(selectMapFlyTarget);
  const showBounds = useSelector(selectShowBounds);
  const showMarkers = useSelector(selectShowMarkers);
  const showSalesComps = useSelector(selectShowSalesComps);
  const showRentComps = useSelector(selectShowRentComps);
  const heatmapMode = useSelector(selectHeatmapMode);

  const { selectProperty, deselectProperty, selectPropertyId, propertyState } =
    useProperty();

  const locationState = locationApiEndpoints.getLocationData.useQueryState(
    suggestion || skipToken
  );

  const propertiesState =
    propertiesApiEndpoints.getPropertiesPreviews.useQueryState(
      suggestion && buybox && user?.user
        ? { suggestion, buybox_id: buybox?.id, masked: !isVerifiedUser }
        : skipToken
    );

  // Refs so map event handlers can read the latest values without
  // detaching + rebinding on every state change.
  const filteredPropertiesRef = useRef(filteredProperties);
  const selectedCompsRef = useRef(selectedComps);
  const selectedRentalCompsRef = useRef(selectedRentalComps);
  const selectPropertyRef = useRef(selectProperty);

  useEffect(() => {
    filteredPropertiesRef.current = filteredProperties;
  }, [filteredProperties]);
  useEffect(() => {
    selectedCompsRef.current = selectedComps;
  }, [selectedComps]);
  useEffect(() => {
    selectedRentalCompsRef.current = selectedRentalComps;
  }, [selectedRentalComps]);
  useEffect(() => {
    selectPropertyRef.current = selectProperty;
  }, [selectProperty]);

  const handleDeselectProperty = useCallback(() => {
    deselectProperty();
  }, [deselectProperty]);

  const onMove = useCallback((viewStateEvent: ViewStateChangeEvent) => {
    setViewState({ ...viewStateEvent.viewState });
  }, []);

  const handleClickCluster = useCallback(
    (
      event: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      } & mapboxgl.EventData
    ) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const clusterId = feature.properties.cluster_id;
      const mapboxSource = mapRef.current?.getSource(
        'properties'
      ) as GeoJSONSource;
      mapboxSource?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (feature.geometry.type !== 'Point') return;
        const [longitude, latitude] = feature.geometry.coordinates;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom,
          duration: 500,
          pitch: 0
        });
      });
    },
    []
  );

  const handleHoverProperty = useCallback(
    (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      } & mapboxgl.EventData
    ) => {
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      }
      const feature = e.features?.[0];
      if (!feature) return;
      const hovered = filteredPropertiesRef.current?.find(
        (property) => property.id === feature.properties.id
      );
      setHoveredProperty(hovered);
    },
    []
  );

  const handleMouseLeaveProperty = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
    setHoveredProperty(null);
  }, []);

  const handleClickProperty = useCallback(
    (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      } & mapboxgl.EventData
    ) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const selected = filteredPropertiesRef.current?.find(
        (property) => property.id === feature.properties.id
      );
      selectPropertyRef.current?.(selected);
    },
    []
  );

  const handleMouseEnterComps = useCallback(
    (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      } & mapboxgl.EventData
    ) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const hovered = selectedCompsRef.current?.find(
        (property) => property.index === feature.properties.index - 1
      );
      cancelCompHoverClear();
      setHoveredComp(hovered);
    },
    [cancelCompHoverClear]
  );

  const handleMouseLeaveComps = useCallback(() => {
    scheduleCompHoverClear();
  }, [scheduleCompHoverClear]);

  const handleMouseEnterRentals = useCallback(
    (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      } & mapboxgl.EventData
    ) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const hovered = selectedRentalCompsRef.current?.find(
        (property) => property.index === feature.properties.index - 1
      );
      cancelCompHoverClear();
      setHoveredComp(hovered);
    },
    [cancelCompHoverClear]
  );

  const handleMouseLeaveRentals = useCallback(() => {
    scheduleCompHoverClear();
  }, [scheduleCompHoverClear]);

  const centerMap = useCallback(() => {
    if (
      mapRef.current &&
      suggestion?.latitude != null &&
      suggestion?.longitude != null
    ) {
      mapRef.current.flyTo({
        center: [suggestion.longitude, suggestion.latitude],
        zoom: 11,
        pitch: 0,
        duration: 2000
      });
    }
  }, [suggestion]);

  const handleResize = useCallback(() => {
    mapRef.current?.resize();
    const infoEl = document.getElementsByClassName(
      'mapboxgl-ctrl mapboxgl-ctrl-attrib'
    );
    infoEl[0]?.classList.add('mapboxgl-compact');
  }, []);

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
        !isVerifiedUser
      );
    } else {
      dispatch(setSelectedPropertyPreview(null));
      mapRef.current?.setPitch(0);
      dispatch(locationApi.util.invalidateTags(['Suggestion', 'LocationData']));
      dispatch(setSuggestion(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifiedUser, router.isReady, (user?.user as { id?: string })?.id]);

  // Attach Mapbox event listeners once the map is loaded. Handlers are
  // stable (useCallback w/ refs) so this effect only runs on mount/unmount.
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;
    if (!map) return;

    map.on('click', 'unclustered-point', handleClickProperty);
    map.on('mouseenter', 'unclustered-point', handleHoverProperty);
    map.on('mouseleave', 'unclustered-point', handleMouseLeaveProperty);
    map.on('click', 'clusters', handleClickCluster);
    map.on('mouseenter', 'comps-point', handleMouseEnterComps);
    map.on('mouseleave', 'comps-point', handleMouseLeaveComps);
    map.on('mouseenter', 'rentals-point', handleMouseEnterRentals);
    map.on('mouseleave', 'rentals-point', handleMouseLeaveRentals);

    return () => {
      map.off('click', 'unclustered-point', handleClickProperty);
      map.off('mouseenter', 'unclustered-point', handleHoverProperty);
      map.off('mouseleave', 'unclustered-point', handleMouseLeaveProperty);
      map.off('click', 'clusters', handleClickCluster);
      map.off('mouseenter', 'comps-point', handleMouseEnterComps);
      map.off('mouseleave', 'comps-point', handleMouseLeaveComps);
      map.off('mouseenter', 'rentals-point', handleMouseEnterRentals);
      map.off('mouseleave', 'rentals-point', handleMouseLeaveRentals);
    };
  }, [
    mapLoaded,
    handleClickProperty,
    handleHoverProperty,
    handleMouseLeaveProperty,
    handleClickCluster,
    handleMouseEnterComps,
    handleMouseLeaveComps,
    handleMouseEnterRentals,
    handleMouseLeaveRentals
  ]);

  const boundsData = useMemo<Geometry | undefined>(() => {
    if (!locationState.data?.bounds || !locationState.data?.type)
      return undefined;
    return {
      type: locationState.data.type,
      coordinates: locationState.data.bounds
    } as Geometry;
  }, [locationState.data]);

  const propertyBoundsData = useMemo<Geometry | undefined>(() => {
    if (!selectedPropertyLocation?.bounds || !selectedPropertyLocation?.type)
      return undefined;
    return {
      type: selectedPropertyLocation.type,
      coordinates: selectedPropertyLocation.bounds
    } as Geometry;
  }, [selectedPropertyLocation]);

  useEffect(() => {
    centerMap();
  }, [centerMap, locationState.data]);

  useEffect(() => {
    if (!mapFlyTarget || !mapRef.current) return;
    mapRef.current.flyTo({
      center: mapFlyTarget.coordinates,
      zoom: mapFlyTarget.zoom ?? 16,
      duration: 1200,
      essential: true
    });
  }, [mapFlyTarget]);

  const data = useMemo<FeatureCollection<
    Geometry,
    { [name: string]: any }
  > | null>(() => {
    if (!filteredProperties?.length) return null;
    const features = filteredProperties.map((property) =>
      generatePropertyGeoJson(property, strategyMode, selectedBuyBoxStrategyType)
    );
    return {
      type: 'FeatureCollection',
      features
    };
  }, [filteredProperties, selectedBuyBoxStrategyType, strategyMode]);

  // Heatmap reads the *unfiltered* buybox set so it can surface deal
  // density that the slider filters might be hiding. Memoized
  // separately from the marker data so toggling filters doesn't rebuild
  // the heatmap source.
  const heatmapData = useMemo<FeatureCollection<
    Geometry,
    { [name: string]: any }
  > | null>(() => {
    const all = propertiesState.data;
    if (!all?.length) return null;
    return {
      type: 'FeatureCollection',
      features: all.map((property) =>
        generatePropertyGeoJson(
          property,
          strategyMode,
          selectedBuyBoxStrategyType
        )
      )
    };
  }, [propertiesState.data, selectedBuyBoxStrategyType, strategyMode]);

  // Surface "No results" when both pipelines have settled for the
  // current data: API fetch is done AND the downstream filter dispatch
  // (MainControls -> setFilteredProperties) has run for this data ref.
  // Tracking the data ref lets us skip the stale first run where
  // propertiesState.data just changed but filteredProperties hasn't
  // caught up yet.
  const lastFilteredDataRef = useRef<typeof propertiesState.data>();
  useEffect(() => {
    if (!buybox || !suggestion) {
      lastFilteredDataRef.current = undefined;
      return;
    }
    if (!propertiesState.isSuccess || propertiesState.isFetching) return;

    const apiCount = propertiesState.data?.length ?? 0;
    const filteredCount = filteredProperties?.length ?? 0;

    // Data just changed and API has items — wait for filter to run.
    // The next effect run (triggered by filteredProperties ref change)
    // is the authoritative one.
    if (
      lastFilteredDataRef.current !== propertiesState.data &&
      apiCount > 0
    ) {
      lastFilteredDataRef.current = propertiesState.data;
      return;
    }
    lastFilteredDataRef.current = propertiesState.data;

    if (filteredCount === 0) {
      enqueueSnackbar('No results found', {
        variant: 'default',
        preventDuplicate: true
      });
    }
  }, [
    buybox?.id,
    suggestion,
    propertiesState.isSuccess,
    propertiesState.isFetching,
    propertiesState.data,
    filteredProperties,
    enqueueSnackbar
  ]);

  const compsData = useMemo<FeatureCollection<
    Geometry,
    { [name: string]: any }
  > | null>(() => {
    if (!selectedComps?.length) return null;
    return {
      type: 'FeatureCollection',
      features: selectedComps.map((c) => generateCompsGeoJson(c))
    };
  }, [selectedComps]);

  const rentalsData = useMemo<FeatureCollection<
    Geometry,
    { [name: string]: any }
  >>(() => {
    return {
      type: 'FeatureCollection',
      features: (selectedRentalComps ?? []).map((c) => generateCompsGeoJson(c))
    };
  }, [selectedRentalComps]);

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
        zoom: (mapRef.current?.getZoom() ?? 11) - 1,
        pitch: 0,
        speed: 0.1,
        duration: 1500
      });
    }

    const selectTimeout = setTimeout(() => {
      dispatch(setSelecting(false));
    }, 1500);
    return () => clearTimeout(selectTimeout);
  }, [selectedPropertyPreview, dispatch]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setMapLoaded(true);
    dispatch(setMapLoading(false));
    registerPillImages(mapRef.current?.getMap());
  }, [dispatch]);

  const mapBoxStyle = useMemo<React.CSSProperties>(
    () => ({
      width: '100%',
      height: '100%',
      opacity: loading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      position: 'relative'
    }),
    [loading]
  );

  const handleCompPopupClose = useCallback(() => {
    cancelCompHoverClear();
    setHoveredComp(null);
  }, [cancelCompHoverClear]);

  return (
    <>
      <WelcomeLoader
        authReady={status === 'authenticated'}
        workspaceReady={buyBoxesState.isSuccess}
        mapReady={!loading}
        name={(user?.user as { name?: string } | undefined)?.name}
      />
      {propertyState.isFetching && !loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      <MapBox
        reuseMaps
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        style={mapBoxStyle}
        onLoad={handleLoad}
        interactiveLayerIds={[clusterLayer.id]}
        onResize={handleResize}
        onMove={onMove}
        ref={mapRef}
        maxBounds={US_BOUNDS as [[number, number], [number, number]]}
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

        {(suggestion ||
          (selectedPropertyPreview && !selectedPropertyPreview.masked)) && (
          <LayersControl
            propertySelected={Boolean(selectedPropertyPreview)}
            heatmapDataEmpty={!propertiesState.data?.length}
          />
        )}

        <LocationBoundsSource show={showBounds} data={boundsData} />
        <SelectedPropertyMarker
          onClick={handleDeselectProperty}
          selectedProperty={selectedPropertyPreview}
        />

        <MultifamilyAnalysisDrawer
          open={Boolean(selectedProperty && isMultifamilyBuybox)}
          property={selectedProperty}
          buyboxId={buybox?.id}
          propertyId={selectedPropertyPreview?.id}
          masked={selectedPropertyPreview?.masked}
          onClose={handleDeselectProperty}
          strategy={buybox?.parameters?.strategy}
        />

        <CardsPanel open={Boolean(propertiesState.data)} />
        <PropertyLocationBoundsSource
          show={
            showBounds &&
            !selecting &&
            Boolean(selectedPropertyPreview) &&
            !selectedPropertyPreview?.masked
          }
          data={propertyBoundsData}
          map={mapRef.current?.getMap()}
        />
        <PropertyHeatmapSource
          show={!selectedPropertyPreview && heatmapMode !== 'off'}
          data={heatmapData}
          mode={heatmapMode}
        />
        <PropertiesSource
          show={!selectedPropertyPreview && showMarkers}
          data={data}
        />
        <CompsSource
          show={Boolean(
            selectedPropertyPreview && !selecting && showSalesComps
          )}
          data={compsData}
        />
        <RentalsSource
          show={Boolean(
            selectedPropertyPreview && !selecting && showRentComps
          )}
          data={rentalsData}
        />
        <MarkerPopup property={hoveredProperty} />
        <CompMarkersPopup
          comp={hoveredComp}
          subject={selectedProperty}
          onCardEnter={cancelCompHoverClear}
          onCardLeave={scheduleCompHoverClear}
          onClose={handleCompPopupClose}
        />
      </MapBox>
    </>
  );
};

export default Map;
