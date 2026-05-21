import type { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";
import { boundsLayer, boundsLineLayer } from "../Layers/boundsLayers";

type LocationBoundsSourceProps = {
  show: boolean;
  data: any;
};

// Always-mounted Source so the bounds layers register at this JSX
// position even before location data arrives. If we only mounted on
// `data` truthy, a faster properties response would add
// `unclustered-point` first and bounds-area would later append on top.
const EMPTY_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const LocationBoundsSource = ({ data }: LocationBoundsSourceProps) => {
  return (
    <Source id="bounds" type="geojson" data={data ?? EMPTY_FC}>
      <Layer {...boundsLayer} />
      <Layer {...boundsLineLayer} />
    </Source>
  );
};

export default LocationBoundsSource;
