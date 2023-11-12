import mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { Layer, Source } from "react-map-gl";
import {
  propertyBoundsLayer,
  propertyBoundsLineLayer,
} from "../Layers/boundsLayers";

type PropertyLocationBoundsSourceProps = {
  show: boolean;
  data: any;
  map: mapboxgl.Map;
};
const PropertyLocationBoundsSource = (
  { show, data, map }: PropertyLocationBoundsSourceProps,
) => {
  return data && (
    <Source
      id="property-bounds"
      type="geojson"
      data={data}
    >
      {show && (
        <>
          <Layer {...propertyBoundsLayer} />
          <Layer {...propertyBoundsLineLayer} />
        </>
      )}
    </Source>
  );
};

export default PropertyLocationBoundsSource;
