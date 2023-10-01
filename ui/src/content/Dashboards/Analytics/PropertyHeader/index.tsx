import Property from "@/models/property";
import PropertyPhotos from "./PropertyPhotos";
import { Card, CardContent, Grid } from "@mui/material";
import PropertyMainInfo from "./PropertyMainInfo";
import PropertyDetails from "./PropertyDetails";
import analyticsStyles from "../Analytics.module.scss";
import Deal from "@/models/deal";
import clsx from "clsx";
import AnalyzedProperty from "@/models/analyzedProperty";
import MarginInfo from "./MarginInfo";

type PropertyHeaderProps = {
  property: AnalyzedProperty;
};
const PropertyHeader = (props: PropertyHeaderProps) => {
  return (
    <div
      className={clsx([
        analyticsStyles.sectionContainer,
        "flex flex-col w-full h-auto",
      ])}
    >
      <div className="flex">
        <PropertyPhotos photos={props.property?.images || []} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 mt-4">
        <div>
          <PropertyMainInfo
            property={props.property || ({} as AnalyzedProperty)}
          />
        </div>
        <div className="flex gap-1">
          <MarginInfo />
        </div>
      </div>
      <div className="flex">
        {/* <PropertyDetails */}
        {/*   property={props.property || ({} as AnalyzedProperty)} */}
        {/* /> */}
      </div>
    </div>
  );
};

export default PropertyHeader;
