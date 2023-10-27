import { Layer, Source } from "react-map-gl";
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from "../Layers/layers";

type PropertiesSourceProps = {
  show: boolean;
  data: any;
};
const PropertiesSource = ({ show, data }: PropertiesSourceProps) => {
  return (
    <Source
      id="properties"
      type="geojson"
      data={data}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
      clusterMinPoints={5}
    >
      {show && (
        <>
          <Layer {...unclusteredPointLayer} />
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
        </>
      )}
    </Source>
  );
};

export default PropertiesSource;
