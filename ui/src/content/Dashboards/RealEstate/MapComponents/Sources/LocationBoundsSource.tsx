import { Layer, Source } from "react-map-gl";
import { boundsLayer, boundsLineLayer } from "../Layers/boundsLayers";

type LocationBoundsSourceProps = {
  show: boolean;
  data: any;
};
const LocationBoundsSource = (
  { show, data }: LocationBoundsSourceProps,
) => {
  return (
    <Source
      id="bounds"
      type="geojson"
      data={data}
    >
      <Layer {...boundsLayer} />
      <Layer {...boundsLineLayer} />
    </Source>
  );
};

export default LocationBoundsSource;
