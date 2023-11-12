import { Layer, Source } from "react-map-gl";
import { compsIndexLayer, compsLayer } from "../Layers/compLayers";

type CompsSourceProps = {
  show: boolean;
  data: any;
};
const CompsSource = ({ show, data }: CompsSourceProps) => {
  return data && (
    <Source
      id="comps"
      type="geojson"
      data={data}
    >
      {show && (
        <>
          <Layer {...compsLayer} />
          <Layer {...compsIndexLayer} />
        </>
      )}
    </Source>
  );
};

export default CompsSource;
