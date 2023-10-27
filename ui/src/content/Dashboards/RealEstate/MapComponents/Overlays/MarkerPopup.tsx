import PropertyPreview from "@/models/propertyPreview";
import { Popup } from "react-map-gl";
import PropertyMapCard from "./PropertyMapCard";

type MarkerPopupProps = {
  property?: PropertyPreview;
};
const MarkerPopup = ({ property }: MarkerPopupProps) => {
  return property && (
    <Popup
      longitude={Number(property.longitude)}
      latitude={Number(property.latitude)}
      anchor="bottom"
      closeButton={false}
      className="mapbox-popup"
    >
      <PropertyMapCard
        property={property}
      />
    </Popup>
  );
};

export default MarkerPopup;
