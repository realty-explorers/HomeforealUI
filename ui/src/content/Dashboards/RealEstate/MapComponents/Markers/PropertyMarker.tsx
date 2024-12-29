import PropertyPreview from '@/models/propertyPreview';
import { currencyFormatter } from '@/utils/converters';
import { Fade, Popper } from '@mui/material';
import { Marker } from '@react-google-maps/api';
import clsx from 'clsx';
import { useState } from 'react';
import PropertyMapCard from './PropertyMapCard';

type PropertyMarkerProps = {
  property: PropertyPreview;
  clusterer: any;
  setSelectedProperty: (property: PropertyPreview) => void;
};
const PropertyMarker = ({
  property,
  clusterer,
  setSelectedProperty
}: PropertyMarkerProps) => {
  const [hovering, setHovering] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleMouseOver = (e: google.maps.MapMouseEvent) => {
    const element = e.domEvent.currentTarget;
    setHovering(true);
    setAnchorEl(element);
  };

  const handleMouseOut = (e: google.maps.MapMouseEvent) => {
    setHovering(false);
    setAnchorEl(null);
  };

  const handleClick = () => {
    setSelectedProperty(property);
  };

  return (
    <Marker
      position={{
        lng: property.coordinates[0],
        lat: property.coordinates[1]
      }}
      zIndex={hovering ? 1000 : 1}
      label={{
        // text: typeof property.arv_percentage === "number"
        //   ? (property.arv_percentage.toFixed(2) + "%")
        //   : " ",
        text: currencyFormatter(property.price),
        className: clsx([
          'font-poppins text-white py-[3px] px-0 rounded-2xl   w-[50px] h-[20px] border-primary',
          hovering
            ? 'bg-white custom-marker-hovered'
            : 'bg-primary custom-marker'
          // "ring ring-secondary",
        ]),
        // color: "#fff",
        color: clsx([hovering ? 'black' : 'white']),
        fontSize: '12px',
        // fontFamily: "Poppins",
        fontWeight: 'bold'
      }}
      clusterer={clusterer}
      icon={{
        url: '/static/images/pins/homePin.png',
        scaledSize: new google.maps.Size(50, 20)
        // scaledSize: new google.maps.Size(60, 60),
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
    >
      {hovering && (
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          modifiers={[
            {
              name: 'flip',
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: 'document',
                padding: 8
              }
            },
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: 'document',
                padding: 8
              }
            }
            // {
            //   name: "arrow",
            //   enabled: true,
            //   options: {
            //     element: arrowRef,
            //   },
            // },
          ]}
        >
          <Fade in={open} timeout={500}>
            <div
            // style={divStyle}
            // onMouseLeave={() => handleMouseOut()}
            >
              <PropertyMapCard
                // property={hoveredProperty as PropertyPreview}
                property={property}
              />
            </div>
          </Fade>
        </Popper>
      )}
    </Marker>
  );
};

export default PropertyMarker;
