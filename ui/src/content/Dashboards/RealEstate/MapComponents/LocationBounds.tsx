import { Polygon } from '@react-google-maps/api';

type LocationBoundsProps = {
  locationData: any;
};

const LocationBounds = (props: LocationBoundsProps) => {
  if (!props.locationData) return <></>;
  const bounds: any = props.locationData.bounds;
  console.log(props.locationData.type);
  if (bounds) {
    if (props.locationData.type === 'Polygon') {
      console.log('in polygon');
      const arr = bounds.map((bound) => {
        const bs = bound.map((b) => {
          return {
            lat: b.longitude,
            lng: b.latitude
          };
        });
        return bs;
      });
      return (
        <Polygon
          paths={arr}
          options={{
            fillColor: '#267dab',
            // fillOpacity: 0.4,
            fillOpacity: 0.1,
            strokeColor: '#267dab',
            strokeOpacity: 1,
            strokeWeight: 2
          }}
        />
      );
    } else {
      const arrr = bounds.map((a) => {
        const arr = a.map((bound) => {
          const bs = bound.map((b) => {
            return {
              lat: b.longitude,
              lng: b.latitude
            };
          });
          return bs;
        });
        return arr;
      });
      console.log(JSON.stringify(arrr));

      return arrr.map((a, index) => {
        return (
          <Polygon
            key={index}
            paths={a}
            options={{
              fillColor: '#267dab',
              // fillOpacity: 0.4,
              fillOpacity: 0.1,
              strokeColor: '#267dab',
              strokeOpacity: 1,
              strokeWeight: 2
            }}
          />
        );
      });
    }
  }
  return <></>;
};

export default LocationBounds;
