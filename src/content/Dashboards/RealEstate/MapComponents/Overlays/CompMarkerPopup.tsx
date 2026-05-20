import AnalyzedProperty, { CompData } from '@/models/analyzedProperty';
import { Popup } from 'react-map-gl';
import { X } from 'lucide-react';
import CompsMapCard from './CompsMapCard';

type CompMarkersPopupProps = {
  comp?: CompData;
  subject?: AnalyzedProperty;
  onCardEnter?: () => void;
  onCardLeave?: () => void;
  onClose?: () => void;
};
const CompMarkersPopup = ({
  comp,
  subject,
  onCardEnter,
  onCardLeave,
  onClose
}: CompMarkersPopupProps) => {
  return (
    comp && (
      <Popup
        longitude={Number(comp.location.geometry.coordinates[0])}
        latitude={Number(comp.location.geometry.coordinates[1])}
        offset={[0, -10]}
        anchor="bottom"
        closeButton={false}
        closeOnClick={false}
        focusAfterOpen={false}
        className="mapbox-popup pointer-events-none"
      >
        <div
          className="pointer-events-auto relative"
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-1 right-1 z-10 flex items-center justify-center size-5 rounded-full bg-white/90 text-slate-600 shadow hover:bg-white hover:text-slate-900 border-0 outline-none focus:outline-none focus-visible:outline-none"
          >
            <X className="size-3" />
          </button>
          <CompsMapCard property={comp} subject={subject} />
        </div>
      </Popup>
    )
  );
};

export default CompMarkersPopup;
