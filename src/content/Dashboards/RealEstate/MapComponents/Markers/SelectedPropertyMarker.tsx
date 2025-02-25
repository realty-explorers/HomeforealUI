import PropertyPreview from '@/models/propertyPreview';
import { Marker, CircleLayer, Source, Layer } from 'react-map-gl';
import MapboxCircle from 'mapbox-gl-circle';
import { useMemo } from 'react';
import { circle } from '@turf/turf';

type SelectedPropertyMarkerProps = {
  selectedProperty?: PropertyPreview;
  onClick: (property: PropertyPreview) => void;
};

const SelectedPropertyMarker = ({
  selectedProperty,
  onClick
}: SelectedPropertyMarkerProps) => {
  const circleData = useMemo(() => {
    const center = [
      selectedProperty?.coordinates[0] || 0,
      selectedProperty?.coordinates[1] || 0
    ];
    const myCircle = circle(center, 1, {
      steps: 64,
      units: 'miles',
      properties: { foo: 'bar' }
    });
    return myCircle;
  }, [selectedProperty]);
  return (
    selectedProperty &&
    (selectedProperty.masked ? (
      <Source id="circle-source" type="geojson" data={circleData}>
        <Layer
          id="circle-layer"
          type="fill"
          paint={{
            'fill-color': 'rgba(79, 136, 255, 0.4)', // A semi-transparent primary color
            'fill-opacity': 0.7,
            'fill-outline-color': 'rgb(79, 136, 255)' // Outline matching the fill color
          }}
        />
        <Layer
          id="circle-outline-layer"
          type="line"
          source="circle-source"
          paint={{
            'line-color': 'rgb(79, 136, 255)', // Match the fill color or use a contrasting color
            'line-width': 2,
            'line-dasharray': [4, 2] // Adjust values to control dash and gap size
          }}
        />
      </Source>
    ) : (
      <Marker
        longitude={selectedProperty.coordinates[0]}
        latitude={selectedProperty.coordinates[1]}
        anchor="bottom"
        onClick={() => onClick(selectedProperty)}
        style={{ cursor: 'pointer' }}
      >
        <img src="/static/images/pins/homePin.png" width={60} height={60} />
      </Marker>
    ))
  );
};

export default SelectedPropertyMarker;
