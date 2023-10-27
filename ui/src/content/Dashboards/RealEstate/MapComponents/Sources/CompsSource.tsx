import { Layer, Source } from "react-map-gl";
import { compsIndexLayer, compsLayer } from "../Layers/layers";

type CompsSourceProps = {
  show: boolean;
  data: any;
};
const CompsSource = ({ show, data }: CompsSourceProps) => {
  return (
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
