import React, { useCallback, useEffect, useRef, useState } from "react";
import MapComponent from "./MapComponent";
import MapBox, {
  Layer,
  Marker,
  Popup,
  Source,
  ViewStateChangeEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

import type { MapRef } from "react-map-gl";
import type { GeoJSONSource } from "react-map-gl";
import {
  boundsLayer,
  boundsLineLayer,
  clusterCountLayer,
  clusterLayer,
  compsIndexLayer,
  compsLayer,
  unclusteredPointLayer,
} from "./layers";
import MapControlPanel from "./MapControlPanel/MapControlPanel";
import { FeatureCollection, Geometry } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import { locationApiEndpoints } from "@/store/services/locationApiService";
import {
  propertiesApiEndpoints,
  useLazyGetPropertyQuery,
} from "@/store/services/propertiesApiService";
import { useDispatch, useSelector } from "react-redux";
import { selectLocation } from "@/store/slices/locationSlice";
import PropertyPreview from "@/models/propertyPreview";
import CardsPanel from "./MapComponents/CardsPanel";
import { selectFilter } from "@/store/slices/filterSlice";
import { currencyFormatter } from "@/utils/converters";
import {
  selectProperties,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import { CompData } from "@/models/analyzedProperty";
import PropertyMapCard from "./MapComponents/PropertyMapCard";
const GEOFENCE = turf.circle([-74.0122106, 40.7467898], 5, { units: "miles" });

function generateGeoJson(property: PropertyPreview) {
  return {
    type: "Feature",
    properties: {
      id: property.source_id, // Generate a random ID
      price: currencyFormatter(property.sales_listing_price),
    },
    geometry: {
      type: "Point",
      coordinates: [property.longitude, property.latitude, 0.0],
    },
  };
}

function generateCompsGeoJson(comp: CompData, index) {
  return {
    type: "Feature",
    properties: {
      id: comp.source_id, // Generate a random ID
      index: index,
    },
    geometry: {
      type: "Point",
      coordinates: [comp.longitude, comp.latitude, 0.0],
    },
  };
}

const US_BOUNDS = [
  [-125.000000, 24.396308], // Southwest coordinates
  [-66.934570, 49.3457868], // Northeast coordinates
];

type MapProps = {};
const Map: React.FC<MapProps> = (props: MapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 40.67,
    longitude: -103.59,
    zoom: 5,
  });
  const [data, setData] = useState<
    FeatureCollection<Geometry, {
      [name: string]: any;
    }>
  >();
  const [compsData, setCompsData] = useState<
    FeatureCollection<Geometry, {
      [name: string]: any;
    }>
  >();

  const [rentalData, setRentalData] = useState<
    FeatureCollection<Geometry, {
      [name: string]: any;
    }>
  >();

  const [boundsData, setBoundsData] = useState<Geometry>();
  const [hoveredProperty, setHoveredProperty] = useState<any>();

  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const { filteredProperties } = useSelector(selectFilter);
  const { selectedPropertyPreview, selectedComps, selectedRentalComps } =
    useSelector(selectProperties);

  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const locationState = locationApiEndpoints.getLocationData.useQueryState(
    suggestion,
  );

  const propertiesState = propertiesApiEndpoints.getPropertiesPreviews
    .useQueryState(
      suggestion,
    );

  const handleSelectProperty = (property?: PropertyPreview) => {
    dispatch(setSelectedPropertyPreview(property));
    if (property) {
      fetchPropertyData(property);
    } else {
      dispatch(setSelectedProperty(null));
    }
  };

  const fetchPropertyData = async (property: PropertyPreview) => {
    //TODO: Watch out here for race conditions when internet not stable
    const propertyData = await getProperty(property?.source_id).unwrap();
    dispatch(setSelectedComps(propertyData?.sales_comps?.data));
    dispatch(setSelectedRentalComps(propertyData?.rents_comps?.data));
    dispatch(setSelectedProperty(propertyData));
  };

  const onMove = useCallback((viewState: ViewStateChangeEvent) => {
    const newCenter = {
      ...viewState.viewState,
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
    } & mapboxgl.EventData,
  ) => {
    const feature = event.features[0];
    if (feature) {
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current.getSource(
        "earthquakes",
      ) as GeoJSONSource;

      mapboxSource?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current.flyTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500,
          pitch: 0,
        });
      });
    }
  };

  const handleHoverProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData,
  ) => {
    mapRef.current.getCanvas().style.cursor = "pointer";
    const feature = e.features[0];
    const hoveredProperty = filteredProperties?.find(
      (property) => property.source_id === feature.properties.id,
    );
    setHoveredProperty(hoveredProperty);

    // setHoveredProperty({
    //   longitude: feature.geometry.coordinates[0],
    //   latitude: feature.geometry.coordinates[1],
    // });
  };

  const handleMouseLeaveProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData,
  ) => {
    mapRef.current.getCanvas().style.cursor = "";
    setHoveredProperty(null);
  };

  const handleClickProperty = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    } & mapboxgl.EventData,
  ) => {
    const feature = e.features[0];

    const selectedProperty = filteredProperties?.find(
      (property) => property.source_id === feature.properties.id,
    );
    handleSelectProperty(selectedProperty);
  };

  const createElement = (props) => {
    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(/static/images/pins/clusterPin.png)`;
    el.style.width = "40px";
    el.style.height = "40px";
    el.style.backgroundSize = "cover";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.color = "#fff";
    el.style.fontSize = "12px";
    el.style.fontWeight = "bold";
    el.style.cursor = "pointer";
    el.style.borderRadius = "50%";
    el.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
    el.style.zIndex = "1";
    el.innerHTML = "meow";
    return el;
  };

  const markers = {};
  let markersOnScreen = {};
  const updateMarkers = () => {
  };

  const handleRender = () => {
    if (!mapRef.current?.isSourceLoaded("properties")) return;
  };

  useEffect(() => {
    mapRef?.current?.on("render", handleRender);
    mapRef?.current?.on("click", "unclustered-point", handleClickProperty);
    mapRef?.current?.on("mouseenter", "unclustered-point", handleHoverProperty);
    mapRef?.current?.on(
      "mouseleave",
      "unclustered-point",
      handleMouseLeaveProperty,
    );
    mapRef?.current?.on("click", "clusters", handleClickCluster);

    return () => {
      mapRef.current.off("click", "unclustered-point", handleClickProperty);
      mapRef?.current?.on(
        "mouseenter",
        "unclustered-point",
        handleHoverProperty,
      );
      mapRef?.current?.on(
        "mouseleave",
        "unclustered-point",
        handleMouseLeaveProperty,
      );
      mapRef.current.off("click", "clusters", handleClickCluster);
    };
  }, [mapRef.current, filteredProperties]);

  const centerMap = () => {
    if (mapRef && locationState.data?.center) {
      mapRef.current.flyTo({
        center: [
          locationState.data.center.longitude,
          locationState.data.center.latitude,
        ],
        zoom: 10,
        pitch: 0,
        duration: 500,
      });
    }
  };

  useEffect(() => {
    centerMap();
    if (locationState.data?.bounds) {
      const bounds = locationState.data.bounds;
      const newData: Geometry = {
        type: "MultiPolygon",
        coordinates: bounds,
      };
      // const newData: FeatureCollection<Geometry, {
      //   [name: string]: any;
      // }> = {
      //   type: "geojson",
      //   features: bounds,
      // };
      setBoundsData(newData);
    }
  }, [locationState.data]);

  useEffect(() => {
    const coordinates = [];
    if (filteredProperties?.length > 0) {
      for (const property of filteredProperties) {
        coordinates.push(generateGeoJson(property));
      }
      // const coordinates = propertiesState.data?.map(property => generateGeoJson(property));
      const newData: FeatureCollection<Geometry, {
        [name: string]: any;
      }> = {
        type: "FeatureCollection",
        features: coordinates,
      };
      setData(newData);
    }
  }, [filteredProperties]);

  useEffect(() => {
    const coordinates = [];
    if (selectedComps?.length > 0) {
      for (let i = 0; i < selectedComps.length; i++) {
        coordinates.push(generateCompsGeoJson(selectedComps[i], i));
      }
      const newData: FeatureCollection<Geometry, {
        [name: string]: any;
      }> = {
        type: "FeatureCollection",
        features: coordinates,
      };
      setCompsData(newData);
    }

    if (selectedPropertyPreview) {
      mapRef.current.flyTo({
        center: [
          selectedPropertyPreview?.longitude,
          selectedPropertyPreview?.latitude,
        ],
        zoom: 15,
        pitch: 70,
        duration: 1000,
      });
    } else {
      centerMap();
    }

    const timeoutes = [];
    for (let i = 0; i < 5; i++) {
      const resizeTimeout = setTimeout(() => {
        mapRef.current?.resize();
      }, 100 * i);
      timeoutes.push(resizeTimeout);
    }

    return () => {
      for (const timeout of timeoutes) {
        clearTimeout(timeout);
      }
    };
  }, [selectedPropertyPreview, selectedComps, selectedRentalComps]);

  const handleResize = () => {
    mapRef.current?.resize();
    const infoEl = document.getElementsByClassName(
      "mapboxgl-ctrl mapboxgl-ctrl-attrib",
    );
    infoEl[0]?.classList.add("mapboxgl-compact");
  };

  return (
    <>
      <MapBox
        reuseMaps
        onResize={handleResize}
        {...viewState}
        onMove={onMove}
        mapboxAccessToken="pk.eyJ1Ijoic2hhcm9uZmFiaW4iLCJhIjoiY2xvNW9hOXE0MGYxaTJqbXYweHJhcjZmNCJ9.rgBtH32YRHpNHRJoXzyhYA"
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/sharonfabin/clo5pj7y400pv01qvgnsdejw9"
        interactiveLayerIds={[clusterLayer.id]}
        // onClick={onClick}
        ref={mapRef}
        maxBounds={US_BOUNDS}
      >
        <MapControlPanel />

        <CardsPanel />
        <Source
          id="bounds"
          type="geojson"
          data={boundsData}
        >
          <Layer {...boundsLayer} />
          <Layer {...boundsLineLayer} />
        </Source>
        <Source
          id="properties"
          type="geojson"
          data={data}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterMinPoints={5}
        >
          {!selectedPropertyPreview && (
            <>
              <Layer {...unclusteredPointLayer} />
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
            </>
          )}
        </Source>
        <Source
          id="comps"
          type="geojson"
          data={compsData}
        >
          {selectedPropertyPreview && (
            <>
              <Layer {...compsLayer} />
              <Layer {...compsIndexLayer} />
            </>
          )}
        </Source>

        {selectedPropertyPreview && (
          <Marker
            longitude={selectedPropertyPreview.longitude}
            latitude={selectedPropertyPreview.latitude}
            anchor="bottom"
          >
            <img src="/static/images/pins/homePin.png" width={60} height={60} />
          </Marker>
        )}

        {hoveredProperty && (
          <Popup
            longitude={Number(hoveredProperty.longitude)}
            latitude={Number(hoveredProperty.latitude)}
            anchor="bottom"
            closeButton={false}
            className="mapbox-popup"
          >
            <PropertyMapCard
              // property={hoveredProperty as PropertyPreview}
              property={hoveredProperty}
            />
          </Popup>
        )}
      </MapBox>
    </>
  );
  // return <MapComponent />;
};

export default Map;
