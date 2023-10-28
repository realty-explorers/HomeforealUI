import Property from "@/models/property";
import { Button, Grid, Typography } from "@mui/material";
import GridField from "@/components/Grid/GridField";
import analyticsStyles from "./Analytics.module.scss";
import ThemedButton from "@/components/Buttons/ThemedButton";
import ModalComponent from "@/components/Modals/ModalComponent";
import { useState } from "react";
import AnalyzedProperty from "@/models/analyzedProperty";

type PropertyFactsProps = {
  property: AnalyzedProperty;
};
const PropertyFacts = (props: PropertyFactsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Grid
      className={`${analyticsStyles.yellowSection} ${analyticsStyles.sectionContainer}`}
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
        <GridField label="Bedrooms" value={props.property.bedrooms} />
        <GridField
          label="YearBuilt"
          value={typeof props.property?.year_built === "string"
            ? props.property.year_built.slice(0, 4)
            : props.property.year_built}
        />
        <GridField
          label="Half Bathrooms"
          value={props.property.half_bathrooms}
        />
        <GridField label="Lot Size" value={props.property.lot_size} />
        <GridField label="Mls" value="" />
        <GridField
          label="Building Size"
          value={props.property.building_area}
        />
        <GridField label="Zoning" value="" />
        <GridField label="Floors" value={props.property.floors} />
      </Grid>
      {/* <Grid container justifyContent="flex-end"> */}
      {/*   <ThemedButton text="More" onClick={() => setOpen(!open)} /> */}
      {/* </Grid> */}
    </Grid>
  );
};

export default PropertyFacts;
