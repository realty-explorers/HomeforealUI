import { useState } from "react";
import PropertyPreview from "@/models/propertyPreview";
import PropertyMarker from "./PropertyMarker";

type PropertiesMarkersProps = {
  properties: PropertyPreview[];
  setSelectedProperty: (property: PropertyPreview) => void;
  clusterer: any;
};
const PropertiesMarkers = (props: PropertiesMarkersProps) => {
  return (
    <>
      {props.properties &&
        props.properties.map((property: PropertyPreview, index: number) => (
          <PropertyMarker
            key={index}
            property={property}
            clusterer={props.clusterer}
            setSelectedProperty={props.setSelectedProperty}
          />
        ))}
    </>
  );
};

export default PropertiesMarkers;
