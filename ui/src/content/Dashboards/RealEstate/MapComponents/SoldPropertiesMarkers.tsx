import { useState } from 'react';
import CompsProperty from '@/models/comps_property';
import Deal from '@/models/deal';
import { InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import PropertyMapCard from './PropertyMapCard';
import { openGoogleSearch } from '@/utils/windowFunctions';
import { Fade } from '@mui/material';

type SoldPropertiesMarkersProps = {
  searchResults: Deal[];
  setSelectedDeal: (deal: Deal) => void;
  selectedDeal?: Deal;
};

const SoldPropertiesMarkers = (props: SoldPropertiesMarkersProps) => {
  const [hoveredProperty, setHoveredProperty] = useState<string>('');
  const [showOverlayTimeout, setShowOverlayTimeout] = useState<any>();

  const handleMouseHover = (houseId: string) => {
    setHoveredProperty(houseId);
    clearTimeout(showOverlayTimeout);
  };
  const handleMouseOut = () => {
    const showTimeout = setTimeout(() => setHoveredProperty(''), 100);
    setShowOverlayTimeout(showTimeout);
  };
  const divStyle = {
    cursor: 'default'
  };

  return (
    <>
      {props.selectedDeal ? (
        props.selectedDeal?.soldProperties.map(
          (compsProperty: CompsProperty, index: number) => (
            <Marker
              key={index}
              position={{
                lat: compsProperty.latitude,
                lng: compsProperty.longitude
              }}
              icon={{
                url: '/static/images/pins/yellowPin.png',
                scaledSize: new google.maps.Size(40, 40),
                strokeWeight: 10,
                strokeColor: 'white'
              }}
              onMouseOver={() => handleMouseHover(compsProperty.id)}
              onMouseOut={() => handleMouseOut()}
              animation={
                hoveredProperty === compsProperty.id
                  ? google.maps.Animation.BOUNCE
                  : null
              }
              onClick={() => openGoogleSearch(compsProperty.address)}
            >
              {hoveredProperty === compsProperty.id && (
                <OverlayView
                  position={{
                    lat: compsProperty.latitude,
                    lng: compsProperty.longitude
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Fade in={hoveredProperty === compsProperty.id} timeout={500}>
                    <div
                      style={divStyle}
                      onMouseEnter={() => handleMouseHover(compsProperty.id)}
                      onMouseLeave={() => handleMouseOut()}
                    >
                      <PropertyMapCard property={compsProperty} />
                    </div>
                  </Fade>
                </OverlayView>
              )}
            </Marker>
          )
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default SoldPropertiesMarkers;
