import { Layer, Source } from 'react-map-gl';
import type { FeatureCollection, Geometry } from '@turf/turf';
import { propertyHeatmapLayer } from '../Layers/layers';
import type { HeatmapMode } from '@/store/slices/mapSlice';

type PropertyHeatmapSourceProps = {
  show: boolean;
  data: FeatureCollection<Geometry, { [name: string]: any }> | null;
  mode: HeatmapMode;
};

// Separate non-clustered source so the heatmap weights individual
// properties rather than cluster aggregates. Mapbox can't share a
// source between cluster=true and heatmap consumers.
const PropertyHeatmapSource = ({
  show,
  data,
  mode
}: PropertyHeatmapSourceProps) => {
  if (!data || !data.features?.length || mode === 'off') return null;
  return (
    <Source id="properties-heatmap" type="geojson" data={data} cluster={false}>
      {show && <Layer {...propertyHeatmapLayer(mode)} />}
    </Source>
  );
};

export default PropertyHeatmapSource;
