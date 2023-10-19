import PropertyPreview from "@/models/propertyPreview";
import { Marker } from "@react-google-maps/api";

type SelectedPropertyMarkerProps = {
  selectedProperty: PropertyPreview | null;
  setSelectedProperty: (property: PropertyPreview | null) => void;
};

const SelectedPropertyMarker = (props: SelectedPropertyMarkerProps) => {
  return props.selectedProperty
    ? (
      <Marker
        position={{
          lat: props.selectedProperty!.latitude,
          lng: props.selectedProperty!.longitude,
        }}
        icon={{
          url: "/static/images/pins/star-pin.png",
          // scaledSize: new google.maps.Size(47, 50)
          scaledSize: new google.maps.Size(60, 60),
        }}
        onClick={() => {
          props.setSelectedProperty(null);
          //   setHoveredHouse('');
        }}
        // icon={props.selectedDeal!.house.imgSrc}
      />
    )
    : <></>;
};

export default SelectedPropertyMarker;
