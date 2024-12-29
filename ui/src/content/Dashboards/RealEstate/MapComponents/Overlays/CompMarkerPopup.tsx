import { CompData } from '@/models/analyzedProperty';
import { Popup } from 'react-map-gl';
import CompsMapCard from './CompsMapCard';

type CompMarkersPopupProps = {
  comp?: CompData;
};
const CompMarkersPopup = ({ comp }: CompMarkersPopupProps) => {
  return (
    comp && (
      <Popup
        longitude={Number(comp.location.geometry.coordinates[0])}
        latitude={Number(comp.location.geometry.coordinates[1])}
        offset={[0, -10]}
        anchor="bottom"
        closeButton={false}
        className="mapbox-popup"
      >
        <CompsMapCard property={comp} />
      </Popup>
    )
  );
};

export default CompMarkersPopup;
