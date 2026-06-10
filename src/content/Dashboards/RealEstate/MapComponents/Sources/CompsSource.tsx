import { Layer, Source } from "react-map-gl";
import { compsIndexLayer, compsLayer } from "../Layers/compLayers";

type CompsSourceProps = {
  show: boolean;
  data: any;
};

// Keep the `comps-point` / `comps-index` layers mounted whenever the
// source has data and toggle visibility instead of unmounting them.
// Other layers (e.g. property bounds) use `comps-point` as a `beforeId`
// anchor, and Mapbox throws if that anchor disappears — so unmounting
// the comps layers when the user toggles them off would break stacking
// for any layer that points at them.
const CompsSource = ({ show, data }: CompsSourceProps) => {
  const visibility = show ? "visible" : "none";
  return data && (
    <Source
      id="comps"
      type="geojson"
      data={data}
    >
      <Layer
        {...compsLayer}
        layout={{ ...(compsLayer.layout ?? {}), visibility }}
      />
      <Layer
        {...compsIndexLayer}
        layout={{ ...(compsIndexLayer.layout ?? {}), visibility }}
      />
    </Source>
  );
};

export default CompsSource;
