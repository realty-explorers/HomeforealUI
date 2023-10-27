import { CompData } from "@/models/analyzedProperty";
import { Fade, Popper } from "@mui/material";
import { Marker } from "@react-google-maps/api";
import clsx from "clsx";
import { useState } from "react";
import CompsMapCard from "./CompsMapCard";

type CompMarkerProps = {
  compsProperty: CompData;
  text?: string;
  colorClass?: string;
};
const CompMarker = ({ compsProperty, text, colorClass }: CompMarkerProps) => {
  const [hovering, setHovering] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleMouseOver = (e: google.maps.MapMouseEvent) => {
    const element = e.domEvent.currentTarget;
    setHovering(true);
    setAnchorEl(element);
  };

  const handleMouseOut = (e: google.maps.MapMouseEvent) => {
    setHovering(false);
    setAnchorEl(null);
  };

  // const handleClick = () => {
  //   setSelectedProperty(property);
  // };
  return (
    <Marker
      position={{
        lat: compsProperty.latitude,
        lng: compsProperty.longitude,
      }}
      zIndex={hovering ? 1000 : 1}
      label={{
        text: text ?? "",
        className: clsx([
          " font-poppins text-white py-[6px] px-0 rounded-2xl  w-[25px] h-[25px]",
          colorClass,
        ]),
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
      }}
      icon={{
        url: "/static/images/pins/homePin.png",
        scaledSize: new google.maps.Size(25, 25),
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {hovering && (
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
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
              <CompsMapCard
                // property={hoveredProperty as PropertyPreview}
                property={compsProperty}
              />
            </div>
          </Fade>
        </Popper>
      )}
    </Marker>
  );
};

export default CompMarker;
