import { useState } from "react";
import { createPortal } from "react-dom";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import PropertyMapCard from "./PropertyMapCard";
import { Fade } from "@mui/material";
import AnalyzedProperty from "@/models/analyzedProperty";
import { current } from "@reduxjs/toolkit";
import { currencyFormatter } from "@/utils/converters";

type PropertiesMarkersProps = {
  properties: AnalyzedProperty[];
  setSelectedProperty: (property: AnalyzedProperty) => void;
  clusterer: any;
  setAnchorEl: (value: any) => void;
};
const PropertiesMarkers = (props: PropertiesMarkersProps) => {
  const [hoveredProperty, setHoveredProperty] = useState<string>("");
  const [showOverlayTimeout, setShowOverlayTimeout] = useState<any>();

  const handleMouseHover = (houseId: string, e) => {
    setHoveredProperty(houseId);
    clearTimeout(showOverlayTimeout);

    props.setAnchorEl(e);
  };
  const handleMouseOut = () => {
    const showTimeout = setTimeout(() => setHoveredProperty(""), 100);
    setShowOverlayTimeout(showTimeout);
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
              className:
                "bg-primary font-poppins text-white py-[2px] px-0 rounded-2xl custom-marker w-[50px] h-[20px]",
              color: "#fff",
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
              handleMouseHover(property.source_id, e.domEvent.currentTarget)}
            onMouseOut={() => handleMouseOut()}
            onClick={() => {
              props.setSelectedProperty(property);
              setHoveredProperty("");
            }}
          >
            {hoveredProperty === property.source_id && (
              <OverlayView
                position={{
                  lat: property.latitude,
                  lng: property.longitude,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Fade in={hoveredProperty === property.source_id} timeout={500}>
                  <div
                    style={divStyle}
                    onMouseEnter={() => handleMouseHover(property.source_id)}
                    onMouseLeave={() => handleMouseOut()}
                  >
                    <PropertyMapCard property={property} />
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
