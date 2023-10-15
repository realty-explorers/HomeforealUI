import { useState } from "react";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import PropertyMapCard from "./PropertyMapCard";
import { Fade } from "@mui/material";
import AnalyzedProperty from "@/models/analyzedProperty";

type PropertiesMarkersProps = {
  properties: AnalyzedProperty[];
  setSelectedProperty: (property: AnalyzedProperty) => void;
  clusterer: any;
};
const PropertiesMarkers = (props: PropertiesMarkersProps) => {
  const [hoveredProperty, setHoveredProperty] = useState<string>("");
  const [showOverlayTimeout, setShowOverlayTimeout] = useState<any>();

  const handleMouseHover = (houseId: string) => {
    setHoveredProperty(houseId);
    clearTimeout(showOverlayTimeout);
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
            clusterer={props.clusterer}
            icon={{
              url: "/static/images/pins/homePin.png",
              scaledSize: new google.maps.Size(60, 60),
            }}
            onMouseOver={() => handleMouseHover(property.source_id)}
            onMouseOut={() => handleMouseOut()}
            onClick={() => {
              props.setSelectedProperty(property);
              setHoveredProperty("");
            }}
          >
            <div>
              meow
            </div>
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
