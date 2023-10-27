import { CompData } from "@/models/analyzedProperty";
import CompMarker from "./CompMarker";

type RentPropertiesMarkersProps = {
  selectedComps?: CompData[];
};

const RentPropertiesMarkers = (props: RentPropertiesMarkersProps) => {
  return (
    <>
      {props.selectedComps?.map(
        (compsProperty: CompData, index: number) => (
          <CompMarker
            key={index}
            compsProperty={compsProperty}
            text={`${index + 1}`}
            colorClass="bg-[#002278]"
          />
        ),
      )}
    </>
  );
};

export default RentPropertiesMarkers;
