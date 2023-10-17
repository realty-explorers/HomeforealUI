import { useState } from "react";
import { createPortal } from "react-dom";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import PropertyMapCard from "./PropertyMapCard";
import { Fade } from "@mui/material";
import AnalyzedProperty, { CompData } from "@/models/analyzedProperty";
import { current } from "@reduxjs/toolkit";
import { currencyFormatter } from "@/utils/converters";
import clsx from "clsx";

type PropertiesMarkersProps = {
  properties: AnalyzedProperty[];
  setSelectedProperty: (property: AnalyzedProperty) => void;
  clusterer: any;
  setAnchorEl: (value: any) => void;
  setHoveredProperty: (value: AnalyzedProperty) => void;
  hoveredProperty: AnalyzedProperty;
};
const PropertiesMarkers = (props: PropertiesMarkersProps) => {
  const [showOverlayTimeout, setShowOverlayTimeout] = useState<any>();

  const handleMouseHover = (property: AnalyzedProperty, e: EventTarget) => {
    // setHoveredProperty(houseId);
    // clearTimeout(showOverlayTimeout);
    props.setHoveredProperty(property);
    props.setAnchorEl(e);
  };
  const handleMouseOut = (property: AnalyzedProperty) => {
    props.setHoveredProperty(null);
    // const showTimeout = setTimeout(() => setHoveredProperty(""), 100);
    // setShowOverlayTimeout(showTimeout);
    props.setAnchorEl(null);
  };

  const divStyle = {
    cursor: "default",
  };

  return (
    <>
      {props.properties &&
        props.properties.map((property: AnalyzedProperty, index: number) => (
          <Marker
            key={index}
            position={{
              lat: property.latitude,
              lng: property.longitude,
            }}
            label={{
              // text: typeof property.arv_percentage === "number"
              //   ? (property.arv_percentage.toFixed(2) + "%")
              //   : " ",
              text: currencyFormatter(property.listing_price),
              className: clsx([
                "font-poppins text-white py-[2px] px-0 rounded-2xl   w-[50px] h-[20px] border-primary",
                props.hoveredProperty?.source_id === property.source_id
                  ? "bg-white custom-marker-hovered"
                  : "bg-primary custom-marker",
                // "ring ring-secondary",
              ]),
              // color: "#fff",
              color: clsx([
                props.hoveredProperty?.source_id === property.source_id
                  ? "black"
                  : "white",
              ]),
              fontSize: "12px",
              fontFamily: "Poppins",
              fontWeight: "bold",
            }}
            clusterer={props.clusterer}
            icon={{
              url: "/static/images/pins/homePin.png",
              scaledSize: new google.maps.Size(50, 20),
              // scaledSize: new google.maps.Size(60, 60),
            }}
            onMouseOver={(e) =>
              handleMouseHover(property, e.domEvent.currentTarget)}
            onMouseOut={() => handleMouseOut(property)}
            onClick={() => {
              props.setSelectedProperty(property);
              props.setAnchorEl(null);
              props.setHoveredProperty(null);
            }}
          >
            {/* {hoveredProperty === property.source_id && ( */}
            {/*   <OverlayView */}
            {/*     position={{ */}
            {/*       lat: property.latitude, */}
            {/*       lng: property.longitude, */}
            {/*     }} */}
            {/*     mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} */}
            {/*   > */}
            {/*     <Fade in={hoveredProperty === property.source_id} timeout={500}> */}
            {/*       <div */}
            {/*         style={divStyle} */}
            {/*         onMouseEnter={() => handleMouseHover(property.source_id)} */}
            {/*         onMouseLeave={() => handleMouseOut()} */}
            {/*       > */}
            {/*         <PropertyMapCard property={property} /> */}
            {/*       </div> */}
            {/*     </Fade> */}
            {/*   </OverlayView> */}
            {/* )} */}
          </Marker>
        ))}
    </>
  );
};

export default PropertiesMarkers;
