import Property from "@/models/property";
import { Button, Grid, Typography } from "@mui/material";
import GridField from "@/components/Grid/GridField";
import analyticsStyles from "./Analytics.module.scss";
import ThemedButton from "@/components/Buttons/ThemedButton";
import ModalComponent from "@/components/Modals/ModalComponent";
import { useState } from "react";
import AnalyzedProperty from "@/models/analyzedProperty";
import { numberFormatter } from "@/utils/converters";

type PropertyFactsProps = {
  property: AnalyzedProperty;
};
const PropertyFacts = (props: PropertyFactsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Grid
      className={`${analyticsStyles.yellowSection} ${analyticsStyles.sectionContainer} mt-4`}
    >
      <ModalComponent open={open} setOpen={setOpen} propertySection="facts" />
      <h1 className={analyticsStyles.sectionHeader}>Property Facts</h1>
      <Grid container justifyContent="center" rowGap={3}>
        <GridField
          label="PropertyType"
          value={props.property.property_type}
        />
        <GridField
          label="Bathrooms"
          value={props.property.full_bathrooms}
        />
        <GridField
          label="YearBuilt"
          value={typeof props.property?.year_built === "string"
            ? props.property.year_built.slice(0, 4)
            : props.property.year_built}
        />
        <GridField label="Bedrooms" value={props.property.bedrooms} />
        <GridField
          label="Half Bathrooms"
          value={props.property.half_bathrooms}
        />
        <GridField
          label="Lot Size"
          value={`${numberFormatter(props.property.lot_size)} Sqft`}
        />
        <GridField
          label="Floors"
          value={props.property.floors}
        />
        <GridField
          label="Building Size"
          value={`${numberFormatter(props.property.building_area)} Sqft`}
        />
      </Grid>
      {/* <Grid container justifyContent="flex-end"> */}
      {/*   <ThemedButton text="More" onClick={() => setOpen(!open)} /> */}
      {/* </Grid> */}
    </Grid>
  );
};

export default PropertyFacts;
