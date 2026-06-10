import mapboxgl from "mapbox-gl";
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

// Keep the bounds layers mounted whenever the source has data so their
// position in the Mapbox layer stack is set once (right after this
// Source mounts in JSX order). Toggling `show` via visibility avoids
// unmount/remount cycles that would re-append the layers above comps
// when the user re-selects a property.
const PropertyLocationBoundsSource = (
  { show, data }: PropertyLocationBoundsSourceProps,
) => {
  const visibility = show ? "visible" : "none";
  return data && (
    <Source
      id="property-bounds"
      type="geojson"
      data={data}
    >
      <Layer
        {...propertyBoundsLayer}
        layout={{ ...(propertyBoundsLayer.layout ?? {}), visibility }}
      />
      <Layer
        {...propertyBoundsLineLayer}
        layout={{ ...(propertyBoundsLineLayer.layout ?? {}), visibility }}
      />
    </Source>
  );
};

export default PropertyLocationBoundsSource;
