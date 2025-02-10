import { CompData } from '@/models/analyzedProperty';
import PropertyPreview from '@/models/propertyPreview';
import { Popup } from 'react-map-gl';
import PropertyMapCard from './PropertyMapCard';

type MarkerPopupProps = {
  property?: PropertyPreview;
};
const MarkerPopup = ({ property }: MarkerPopupProps) => {
  return (
    property && (
      <Popup
        longitude={Number(property.coordinates[0])}
        latitude={Number(property.coordinates[1])}
        anchor="bottom"
        offset={[0, -10]}
        closeButton={false}
        className="mapbox-popup"
      >
        <PropertyMapCard property={property} />
      </Popup>
    )
  );
};

export default MarkerPopup;
