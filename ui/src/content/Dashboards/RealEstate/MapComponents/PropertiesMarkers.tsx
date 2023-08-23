import { useState } from 'react';
import Deal from '@/models/deal';
import { InfoWindow, Marker, OverlayView } from '@react-google-maps/api';
import PropertyMapCard from './PropertyMapCard';
import { Fade } from '@mui/material';

type PropertiesMarkersProps = {
  deals: Deal[];
  setSelectedDeal: (deal: Deal) => void;
};
const PropertiesMarkers = (props: PropertiesMarkersProps) => {
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
      {props.deals &&
        props.deals.map((deal: Deal, index: number) => (
          <Marker
            key={index}
            position={{
              lat: deal.property.latitude,
              lng: deal.property.longitude
            }}
            icon={{
              url: '/static/images/pins/homePin.png',
              scaledSize: new google.maps.Size(60, 60)
            }}
            onMouseOver={() => handleMouseHover(deal.property.id)}
            onMouseOut={() => handleMouseOut()}
            onClick={() => {
              props.setSelectedDeal(deal);
              setHoveredProperty('');
            }}
          >
            {hoveredProperty === deal.property.id && (
              <OverlayView
                position={{
                  lat: deal.property.latitude,
                  lng: deal.property.longitude
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Fade in={hoveredProperty === deal.property.id} timeout={500}>
                  <div
                    style={divStyle}
                    onMouseEnter={() => handleMouseHover(deal.property.id)}
                    onMouseLeave={() => handleMouseOut()}
                  >
                    <PropertyMapCard property={deal.property} />
                  </div>
                </Fade>
              </OverlayView>
            )}
          </Marker>
        ))}
    </>
  );
};

export default PropertiesMarkers;
