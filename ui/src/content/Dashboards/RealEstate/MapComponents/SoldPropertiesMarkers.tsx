import { useState } from "react";
import CompsProperty from "@/models/comps_property";
import Deal from "@/models/deal";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import PropertyMapCard from "./PropertyMapCard";
import { openGoogleSearch } from "@/utils/windowFunctions";
import { Fade } from "@mui/material";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";

const divStyle = {
  cursor: "default",
};
const CompsMarker = (props: {
  compsProperty: Property;
  handleMouseHover: any;
  handleMouseOut: any;
  hovered: boolean;
  iconUrl: string;
}) => {
  return (
    <Marker
      position={{
        lat: props.compsProperty.latitude,
        lng: props.compsProperty.longitude,
      }}
      icon={{
        url: props.iconUrl,
        scaledSize: new google.maps.Size(40, 40),
        strokeWeight: 10,
        strokeColor: "white",
      }}
      onMouseOver={() => props.handleMouseHover(props.compsProperty.address)}
      onMouseOut={() => props.handleMouseOut()}
      animation={props.hovered ? google.maps.Animation.BOUNCE : null}
      onClick={() => openGoogleSearch(props.compsProperty.address)}
    >
      {props.hovered && (
        <OverlayView
          position={{
            lat: props.compsProperty.latitude,
            lng: props.compsProperty.longitude,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <Fade in={props.hovered} timeout={500}>
            <div
              style={divStyle}
              onMouseEnter={() =>
                props.handleMouseHover(props.compsProperty.market_id)}
              onMouseLeave={() => props.handleMouseOut()}
            >
              <PropertyMapCard property={props.compsProperty} />
            </div>
          </Fade>
        </OverlayView>
      )}
    </Marker>
  );
};

type SoldPropertiesMarkersProps = {
  selectedComps?: Property[];
};

const SoldPropertiesMarkers = (props: SoldPropertiesMarkersProps) => {
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

  const renderCompsMarkers = () => {
    // const compsProperties = false
    //   ? props.selectedDeal.trueArvProperties
    //   : props.selectedDeal.soldProperties;
    return props.selectedComps.map(
      (compsProperty: Property, index: number) => (
        <CompsMarker
          compsProperty={compsProperty}
          key={index}
          handleMouseHover={handleMouseHover}
          handleMouseOut={handleMouseOut}
          hovered={hoveredProperty === compsProperty.address}
          iconUrl={false
            ? "/static/images/pins/greenPin.png"
            : "/static/images/pins/yellowPin.png"}
        />
      ),
    );
  };

  return <>{props.selectedComps ? renderCompsMarkers() : <></>}</>;
};

export default SoldPropertiesMarkers;
