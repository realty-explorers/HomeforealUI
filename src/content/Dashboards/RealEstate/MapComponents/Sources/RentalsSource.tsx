import { Layer, Source } from "react-map-gl";
import { rentalsIndexLayer, rentalsLayer } from "../Layers/compLayers";

type RentalsSourceProps = {
  show: boolean;
  data: any;
};

// See CompsSource for the rationale — keep the `rentals-point` layer
// mounted and toggle visibility so other layers can reliably reference
// it via `beforeId`.
const RentalsSource = ({ show, data }: RentalsSourceProps) => {
  const visibility = show ? "visible" : "none";
  return data && (
    <Source
      id="rentals"
      type="geojson"
      data={data}
    >
      <Layer
        {...rentalsLayer}
        layout={{ ...(rentalsLayer.layout ?? {}), visibility }}
      />
      <Layer
        {...rentalsIndexLayer}
        layout={{ ...(rentalsIndexLayer.layout ?? {}), visibility }}
      />
    </Source>
  );
};

export default RentalsSource;
