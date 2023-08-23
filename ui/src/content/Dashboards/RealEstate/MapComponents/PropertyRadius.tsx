import Deal from '@/models/deal';
import { Circle } from '@react-google-maps/api';

type PropertyRadiusProps = {
  selectedDeal: Deal;
};

const PropertyRadius = (props: PropertyRadiusProps) => {
  // const distanceInKilometers = (props.searchData.distance || 0) * 1609.34;
  const distanceInKilometers = 0;
  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#F9E076',
    fillOpacity: 0.15,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: distanceInKilometers,
    zIndex: 1
  };

  return props.selectedDeal ? (
    <Circle
      key={1}
      center={{
        lat: props.selectedDeal.property.latitude,
        lng: props.selectedDeal.property.longitude
      }}
      options={options}
    />
  ) : (
    <></>
  );
};

export default PropertyRadius;
