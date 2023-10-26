import { locationApiEndpoints } from "@/store/services/locationApiService";
import {
  propertiesApiEndpoints,
  useLazyGetPropertyQuery,
} from "@/store/services/propertiesApiService";
import { selectFilter } from "@/store/slices/filterSlice";
import { selectLocation } from "@/store/slices/locationSlice";
import {
  selectProperties,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import {
  GoogleMap,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsPanel from "./MapComponents/CardsPanel";
import LocationBounds from "./MapComponents/LocationBounds";
import PropertiesMarkers from "./MapComponents/PropertiesMarkers";
import SelectedPropertyMarker from "./MapComponents/SelectedPropertyMarker";
import SoldPropertiesMarkers from "./MapComponents/SoldPropertiesMarkers";
import MapControlPanel from "./MapControlPanel/MapControlPanel";
import AnalyzedProperty, { CompData } from "@/models/analyzedProperty";
import { PropertyType } from "@/models/property";
import Lottie from "lottie-react";
import mapAnimation from "@/static/animations/loading/mapAnimation.json";
import mapLoadingAnimation from "@/static/animations/loading/mapLoadingAnimation.json";
import * as TWEEN from "@tweenjs/tween.js";
import { EasingFunction } from "framer-motion";
import clsx from "clsx";
import { Fade } from "@mui/material";
import debounce from "lodash.debounce";
import PropertyMapCard from "./MapComponents/PropertyMapCard";
import RentPropertiesMarkers from "./MapComponents/RentPropertiesMarker";
import PropertyPreview from "@/models/propertyPreview";
import { init } from "next/dist/compiled/webpack/webpack";
import { useDebounce } from "@/hooks/useDebounce";
import { selectMap } from "@/store/slices/mapSlice";

// const center = {
//   lat: 33.429565,
//   lng: -86.84005,
// };
const center = {
  lat: 27.6648,
  lng: -81.5158,
};

type MapComponentProps = {};

const MapComponent: React.FC<MapComponentProps> = (
  props: MapComponentProps,
) => {
  const {
    selectedProperty,
    selectedPropertyPreview,
    selectedComps,
    selectedRentalComps,
  } = useSelector(
    selectProperties,
  );

  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const {
    filteredProperties,
  } = useSelector(selectFilter);
  const locationState = locationApiEndpoints.getLocationData.useQueryState(
    suggestion,
  );
  const propertiesState = propertiesApiEndpoints.getPropertiesPreviews
    .useQueryState(
      suggestion,
    );

  const [getProperty, propertyState] = useLazyGetPropertyQuery();

  //Resubscribe to redux cache so the data wont be lost when the component unmounts
  // locationApiEndpoints.getLocationData.useQuerySubscription(suggestion);
  // propertiesApiEndpoints.getProperties.useQuerySubscription(suggestion);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    // mapIds: ["46cdcdbdfb4f416b"],
  });
  const [map, updateMap] = useState<google.maps.Map>();
  let infoWindow: google.maps.InfoWindow;

  const handleSelectProperty = (property?: PropertyPreview) => {
    dispatch(setSelectedPropertyPreview(property));
    if (property) {
      fetchPropertyData(property);
    } else {
      dispatch(setSelectedProperty(null));
    }

    // dispatch(setSelectedComps(property?.sales_comps?.data));
    // dispatch(setSelectedRentalComps(property?.rents_comps?.data));
  };

  const fetchPropertyData = async (property: PropertyPreview) => {
    //TODO: Watch out here for race conditions when internet not stable
    const propertyData = await getProperty(property?.source_id).unwrap();
    dispatch(setSelectedComps(propertyData?.sales_comps?.data));
    dispatch(setSelectedRentalComps(propertyData?.rents_comps?.data));
    dispatch(setSelectedProperty(propertyData));
  };

  const handleMapClicked = () => {
    dispatch(setSelectedPropertyPreview(null));
    // dispatch(setSelectedProperty(null));
    dispatch(setSelectedComps([]));
  };

  const handleZoomChanged = () => {
    handleCloseInfoWindow();
  };

  const initMapLocation = (map: google.maps.Map) => {
    const propertySelected = selectedPropertyPreview;
    typeof selectedPropertyPreview?.latitude === "number" &&
      typeof selectedPropertyPreview?.longitude === "number";
    console.log(
      "property selected",
      propertySelected ? "ture" : "false",
    );
    if (propertySelected) {
      panToProperty(map);
    } else {
      centerMap(map);
    }
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setOptions({
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      streetViewControl: false,
      rotateControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      fullscreenControl: false,
    });
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(rootElement);
    map.controls[google.maps.ControlPosition.TOP_LEFT].clear();

    infoWindow = new google.maps.InfoWindow();
    map.setCenter(center);
    map.setZoom(11);
    initMapLocation(map);
    updateMap(map);
    // const propertySelected = selectedProperty && map &&
    //   selectedProperty?.latitude &&
    //   selectedProperty?.longitude;
    //
    // if (suggestion && suggestion.latitude && suggestion.longitude) {
    //   map.panTo({
    //     lat: suggestion.latitude,
    //     lng: suggestion.longitude,
    //   });
    // } else if (propertySelected) {
    //   map.panTo({
    //     lat: selectedProperty.latitude,
    //     lng: selectedProperty.longitude,
    //   });
    // } else {
    //   map.setCenter(center);
    // }
  }, []);

  const centerMap = async (map: google.maps.Map) => {
    let newCenter = {
      latitude: center.lat,
      longitude: center.lng,
    };
    if (suggestion && suggestion.latitude && suggestion.longitude) {
      newCenter = {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
      };
      console.log("has suggestions ");
    }
    const firstTarget = {
      duration: 1000,
      center: newCenter,
      zoom: 11,
    };

    // animateMap([firstTarget], map);
    map.moveCamera({
      zoom: firstTarget.zoom,
      center: {
        lat: firstTarget.center.latitude,
        lng: firstTarget.center.longitude,
      },
    });
  };

  const propertyInBounds = (property: AnalyzedProperty) =>
    map.getBounds().contains({
      lat: property.latitude,
      lng: property.longitude,
    });

  const panToProperty = async (map: google.maps.Map) => {
    const firstTarget = {
      duration: 1000,
      center: {
        latitude: selectedPropertyPreview.latitude,
        longitude: selectedPropertyPreview.longitude,
      },
      zoom: 13,
    };

    const secondTarget = {
      duration: 1000,
      zoom: 14,
      center: {
        latitude: selectedPropertyPreview.latitude,
        longitude: selectedPropertyPreview.longitude,
      },
      easing: TWEEN.Easing.Quartic.Out,
    };
    // animateMap([firstTarget, secondTarget], map);
    map.moveCamera({
      zoom: firstTarget.zoom,
      center: {
        lat: firstTarget.center.latitude,
        lng: firstTarget.center.longitude,
      },
    });
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const createTween = (
    map: google.maps.Map,
    mapCameraOptions: {
      zoom?: number;
      lat?: number;
      lng?: number;
    },
    duration: number,
    center?: { latitude: number; longitude: number },
    zoom?: number,
    easing: EasingFunction = TWEEN.Easing.Quadratic.Out,
  ) => {
    const targetOptions = {};
    if (center) {
      targetOptions["lat"] = center.latitude;
      targetOptions["lng"] = center.longitude;
    }
    if (zoom) {
      targetOptions["zoom"] = zoom;
    }
    const newTween = new TWEEN.Tween(mapCameraOptions)
      .to(targetOptions, duration)
      .onUpdate(() => {
        map.moveCamera({
          zoom: mapCameraOptions.zoom,
          center: {
            lat: mapCameraOptions.lat,
            lng: mapCameraOptions.lng,
          },
        });
      })
      .easing(easing);
    return newTween;
  };

  const animateMap = (
    targets: {
      duration: number;
      center?: { latitude: number; longitude: number };
      zoom?: number;
    }[],
    map: google.maps.Map,
  ) => {
    const tweens = TWEEN.getAll();
    for (const tween of tweens) {
      tween.stop();
    }

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
    if (targets) {
      const cameraOptions = {
        zoom: map.getZoom(),
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      };
      const tween = createTween(
        map,
        cameraOptions,
        targets[0].duration,
        targets[0].center,
        targets[0].zoom,
      );
      TWEEN.add(tween);
      let lastTween = tween;
      for (let i = 1; i < targets.length; i++) {
        const newTween = createTween(
          map,
          cameraOptions,
          targets[i].duration,
          targets[i].center,
          targets[i].zoom,
        );
        lastTween.chain(newTween);
        lastTween = newTween;
        TWEEN.add(newTween);
      }
      // tween.delay(250);
      tween.start();
    }
  };

  useEffect(() => {
    console.log(
      "selectedProperty  preview",
      selectedPropertyPreview?.sales_listing_price,
    );
    if (map) {
      initMapLocation(map);
    }
  }, [
    selectedProperty,
    selectedPropertyPreview,
    locationState?.currentData,
    propertiesState?.data,
    filteredProperties,
  ]);

  const onUnmount = useCallback(function callback() {
    updateMap(null);
  }, []);

  const clusterStyles = [
    {
      // url: "https://cdn-icons-png.flaticon.com/512/1632/1632646.png",
      url: "",
      height: 50,
      textColor: "#ffffff",
      // textColor: "#000",
      textSize: 14,
      width: 50,
      fontFamily: "var(--font-poppins)",
      // url:
      //   'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" height="50" width="100"%3E%3Ccircle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="green" /%3E%3C/svg%3E',
    },
    // {
    //   height: 50,
    //   textColor: "#ffffff",
    //   width: 50,
    //   // url:
    //   //   'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" height="50" width="100"%3E%3Ccircle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="red" /%3E%3C/svg%3E',
    // },
  ];

  const containerStyle: React.CSSProperties = {
    position: "relative",
    height: "100%",
    width: "100%",
    // display: clsx([tilesLoaded ? "block" : "hidden"]),
  };
  const handleOpenInfoWindow = useCallback((cluster) => {
    if (infoWindow) {
      infoWindow.setContent(`View ${cluster.markers.length} more properties`);
      infoWindow.setPosition(cluster.center);
      infoWindow.setOptions({
        pixelOffset: new google.maps.Size(0, -25),
        disableAutoPan: true,
      });

      infoWindow.open(cluster.map);
    }
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    if (infoWindow) {
      infoWindow.close();
    }
  }, []);

  const handleClusterClicked = useCallback((cluster) => {
    handleCloseInfoWindow();
    try {
      // const map = cluster.getMap();
      // const firstTarget = {
      //   duration: 350,
      //   center: {
      //     latitude: cluster.center.lat(),
      //     longitude: cluster.center.lng(),
      //   },
      //   zoom: map.getZoom() + 2,
      // };
      //
      // animateMap([firstTarget]);
      const newZoom = map.getZoom() + 2;
      const cameraOptions = {
        center: cluster.center,
        zoom: map.getZoom(),
      };
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }

      requestAnimationFrame(animate);
      new TWEEN.Tween(cameraOptions)
        .to({ zoom: map.getZoom() + 2 }, 350)
        .easing(
          TWEEN.Easing.Quadratic.InOut,
        )
        .onUpdate(() => {
          map.moveCamera(cameraOptions);
        })
        .start();
      // map.panTo(cluster.center);
      // map.setZoom(map.getZoom() + 2);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const US_BOUNDS = {
    north: 49.3457868,
    south: 24.396308,
    west: -125.000000,
    east: -66.934570,
  };

  const getMockProperties = () => {
    const properties = [];
    for (let i = 0; i < 20; i++) {
      const newProperty = {
        images: [],
      } as AnalyzedProperty;
      properties.push(newProperty);
    }
    return properties;
  };

  return isLoaded
    ? (
      <GoogleMap
        id="map"
        mapContainerStyle={containerStyle}
        // zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClicked}
        onZoomChanged={handleZoomChanged}
        options={{
          // mapId: "46cdcdbdfb4f416b",
          // disableDefaultUI: true,
          restriction: {
            latLngBounds: US_BOUNDS,
          },
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
            {
              featureType: "road",
              elementType: "labels",
              stylers: [
                { visibility: "off" },
              ],
            },
          ],
        }}
      >
        <CardsPanel
          // deals={filterDeals(propertiesState.data)}
          // properties={filterProperties(propertiesState?.data)}
          // properties={filterProperties(propertiesState.data)}
          // properties={propertiesState.data}
          properties={filteredProperties}
          // properties={getMockProperties()}
          selectedProperty={selectedPropertyPreview}
          setSelectedProperty={handleSelectProperty}
          // selectedProperty={{} as PropertyPreview}
          // setSelectedProperty={() => {}}
        />

        {propertiesState.isFetching && (
          <div
            className={clsx([
              "absolute top-0 right-0 w-20 h-20 ",
              propertiesState.isFetching ? "flex" : "hidden",
            ])}
          >
            <Lottie
              animationData={mapLoadingAnimation}
              className="h-20 w-20"
            />
          </div>
        )}

        <MapControlPanel />
        <LocationBounds locationData={locationState?.data} />
        {selectedPropertyPreview
          ? (
            <SelectedPropertyMarker
              selectedProperty={selectedPropertyPreview}
              setSelectedProperty={handleSelectProperty}
            />
          )
          : (
            <MarkerClusterer
              options={{
                averageCenter: true,
                styles: clusterStyles,
              }}
              onMouseOver={handleOpenInfoWindow}
              onMouseOut={handleCloseInfoWindow}
              onClick={handleClusterClicked}
              minimumClusterSize={4}
              zoomOnClick={false}
            >
              {(clusterer) => (
                <>
                  <PropertiesMarkers
                    // properties={filterProperties(propertiesState?.data)}
                    properties={filteredProperties}
                    // properties={propertiesState?.data || []}
                    setSelectedProperty={handleSelectProperty}
                    clusterer={clusterer}
                  />
                </>
              )}
            </MarkerClusterer>
          )}
        {selectedProperty &&
          (
            <>
              <SoldPropertiesMarkers
                selectedComps={selectedComps}
              />

              <RentPropertiesMarkers
                selectedComps={selectedRentalComps}
              />
            </>
          )}
      </GoogleMap>
    )
    : (
      <div className="flex justify-center items-center w-screen h-screen">
        <Lottie animationData={mapAnimation} className="h-2/3" loop={false} />
      </div>
    );
};

export default memo(MapComponent);
