import { useState } from "react";
import { CompData } from "@/models/analyzedProperty";
import CompMarker from "./CompMarker";

type SoldPropertiesMarkersProps = {
  selectedComps?: CompData[];
};

const SoldPropertiesMarkers = (props: SoldPropertiesMarkersProps) => {
  return (
    <>
      {props.selectedComps.map(
        (compsProperty: CompData, index: number) => (
          <CompMarker
            key={index}
            compsProperty={compsProperty}
            text={`${index + 1}`}
            colorClass="bg-[#590D82]"
          />
        ),
      )}
    </>
  );
};

export default SoldPropertiesMarkers;
