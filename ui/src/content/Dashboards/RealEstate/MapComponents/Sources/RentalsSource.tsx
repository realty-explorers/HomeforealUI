import { Layer, Source } from "react-map-gl";
import { rentalsIndexLayer, rentalsLayer } from "../Layers/compLayers";

type RentalsSourceProps = {
  show: boolean;
  data: any;
};
const RentalsSource = ({ show, data }: RentalsSourceProps) => {
  return (
    <Source
      id="rentals"
      type="geojson"
      data={data}
    >
      {show && (
        <>
          <Layer {...rentalsLayer} />
          <Layer {...rentalsIndexLayer} />
        </>
      )}
    </Source>
  );
};

export default RentalsSource;
