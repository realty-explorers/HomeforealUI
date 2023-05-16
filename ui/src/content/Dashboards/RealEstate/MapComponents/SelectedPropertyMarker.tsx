import Deal from '@/models/deal';
import { Marker } from '@react-google-maps/api';

type SelectedPropertyMarkerProps = {
  selectedDeal: Deal | null;
  setSelectedDeal: (deal: Deal | null) => void;
};

const SelectedPropertyMarker = (props: SelectedPropertyMarkerProps) => {
  return props.selectedDeal ? (
    <Marker
      position={{
        lat: props.selectedDeal!.property.latitude,
        lng: props.selectedDeal!.property.longitude
      }}
      icon={{
        url: '/static/images/pins/star-pin.png',
        // scaledSize: new google.maps.Size(47, 50)
        scaledSize: new google.maps.Size(60, 60)
      }}
      onClick={() => {
        props.setSelectedDeal(null);
        //   setHoveredHouse('');
      }}
      // icon={props.selectedDeal!.house.imgSrc}
    />
  ) : (
    <></>
  );
};

export default SelectedPropertyMarker;
