import { useState } from "react";
import CompsProperty from "@/models/comps_property";
import Deal from "@/models/deal";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import PropertyMapCard from "./PropertyMapCard";
import { openGoogleSearch } from "@/utils/windowFunctions";
import { Fade } from "@mui/material";
import AnalyzedProperty from "@/models/analyzedProperty";
import { CompData } from "@/models/analyzedProperty";
import CompsMapCard from "./CompsMapCard";

const divStyle = {
  cursor: "default",
};
const CompsMarker = (props: {
  compsProperty: CompData;
  handleMouseHover: any;
  handleMouseOut: any;
  hovered: boolean;
  iconUrl: string;
  text?: string;
}) => {
  return (
    <Marker
      position={{
        lat: props.compsProperty.latitude,
        lng: props.compsProperty.longitude,
      }}
      // icon={{
      //   url: props.iconUrl,
      //   // url: 'https://cdn.imgbin.com/19/23/15/icon-font-map-yellow-circle-aYzBs1QL.jpg'
      //   scaledSize: new google.maps.Size(60, 60),
      //   strokeWeight: 10,
      //   strokeColor: "white",
      // }}

      label={{
        text: props.text ?? "",
        className:
          "bg-[#002278] font-poppins text-white py-[4px] px-0 rounded-2xl  w-[25px] h-[25px]",
        color: "#fff",
        fontSize: "12px",
        fontFamily: "Poppins",
        fontWeight: "bold",
      }}
      icon={{
        url: "/static/images/pins/homePin.png",
        scaledSize: new google.maps.Size(25, 25),
        // scaledSize: new google.maps.Size(60, 60),
      }}
      onMouseOver={() => props.handleMouseHover(props.compsProperty.address)}
      onMouseOut={() => props.handleMouseOut()}
      // animation={props.hovered ? google.maps.Animation.BOUNCE : null}
      onClick={() => openGoogleSearch(props.compsProperty.address)}
    >
      <span>hi</span>
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
                props.handleMouseHover(props.compsProperty.source_id)}
              onMouseLeave={() => props.handleMouseOut()}
            >
              <CompsMapCard property={props.compsProperty} />
            </div>
          </Fade>
        </OverlayView>
      )}
    </Marker>
  );
};

type RentPropertiesMarkersProps = {
  selectedComps?: CompData[];
};

const RentPropertiesMarkers = (props: RentPropertiesMarkersProps) => {
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
      (compsProperty: CompData, index: number) => (
        <CompsMarker
          compsProperty={compsProperty}
          key={index}
          handleMouseHover={handleMouseHover}
          handleMouseOut={handleMouseOut}
          hovered={hoveredProperty === compsProperty.address}
          text={`${index + 1}`}
          // iconUrl="https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Star_Gold_Dark-512.png"
          iconUrl={false
            ? "/static/images/pins/greenPin.png"
            : "/static/images/pins/yellowPin.png"}
        />
      ),
    );
  };

  return <>{props.selectedComps ? renderCompsMarkers() : <></>}</>;
};

export default RentPropertiesMarkers;
