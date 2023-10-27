import PropertyPreview from "@/models/propertyPreview";
import { Marker } from "react-map-gl";

type SelectedPropertyMarkerProps = {
  selectedProperty?: PropertyPreview;
  onClick: (property: PropertyPreview) => void;
};

const SelectedPropertyMarker = (
  { selectedProperty, onClick }: SelectedPropertyMarkerProps,
) => {
  return selectedProperty && (
    <Marker
      longitude={selectedProperty.longitude}
      latitude={selectedProperty.latitude}
      anchor="bottom"
      onClick={() => onClick(selectedProperty)}
    >
      <img src="/static/images/pins/homePin.png" width={60} height={60} />
    </Marker>
  );
};

export default SelectedPropertyMarker;
