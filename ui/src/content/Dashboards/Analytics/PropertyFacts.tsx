import Property from "@/models/property";
import { Button, Grid, Typography } from "@mui/material";
import GridField from "@/components/Grid/GridField";
import analyticsStyles from "./Analytics.module.scss";
import ThemedButton from "@/components/Buttons/ThemedButton";
import ModalComponent from "@/components/Modals/ModalComponent";
import { useState } from "react";
import AnalyzedProperty from "@/models/analyzedProperty";
import { numberFormatter } from "@/utils/converters";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CropRoundedIcon from "@mui/icons-material/CropRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import { readableDateDiff } from "@/utils/dateUtils";
import clsx from "clsx";
import styles from "./PropertyFacts.module.scss";

type FactsCardProps = {
  facts: { label: string; value: any }[];
  icon: any;
};
const FactsCard = ({ facts, icon }: FactsCardProps) => {
  return (
    <div
      className={clsx([
        "flex bg-white h-20 rounded-lg shadow",
        styles.factsCard,
      ])}
    >
      <div className="grow flex items-center justify-around px-4 ">
        {facts.map((fact) => {
          return (
            <>
              <div className="flex flex-col">
                <Typography className=" font-semibold text-center text-[0.9rem]">
                  {fact.label}
                </Typography>
                <Typography className="text-sm  text-center">
                  {fact.value}
                </Typography>
              </div>
              {/* <Typography className="text-sm font-semibold text-center"> */}
              {/*   | */}
              {/* </Typography> */}
            </>
          );
        })}
      </div>
      <div
        className={clsx([
          "w-16 m-2  flex items-center justify-center rounded-lg",
          "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700",
        ])}
      >
        {icon}
      </div>
    </div>
  );
};

type PropertyFactsProps = {
  property: AnalyzedProperty;
};
const PropertyFacts = (props: PropertyFactsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-4 p-4">
      <FactsCard
        icon={<BedroomParentIcon htmlColor="white" />}
        facts={[
          { label: "Beds", value: props.property.bedrooms },
          { label: "Baths", value: props.property.full_bathrooms },
          { label: "1/2 Baths", value: props.property.half_bathrooms },
        ]}
      />
      <FactsCard
        icon={<HomeRoundedIcon htmlColor="white" />}
        facts={[
          {
            label: "Type",
            value: props.property.property_type.replace("-", " "),
          },
          { label: "Built", value: props.property.year_built },
          {
            label: "DOM",
            value: (props.property.sales_days_on_market),
          },
        ]}
      />
      <FactsCard
        icon={<CropRoundedIcon htmlColor="white" />}
        facts={[
          {
            label: "Building Size",
            value: numberFormatter(props.property.building_area),
          },
          {
            label: "Lot Size",
            value: numberFormatter(props.property.lot_size),
          },
          { label: "Floors", value: props.property.floors },
        ]}
      />
      <FactsCard
        icon={<WidgetsRoundedIcon htmlColor="white" />}
        facts={[
          { label: "MLS Number", value: "0" },
          { label: "Zoning", value: "R3" },
        ]}
      />
    </div>
  );
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
