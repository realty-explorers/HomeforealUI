import { Card, Divider, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";
import Image from "@/components/Photos/Image";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";
import clsx from "clsx";

const gridRows = (property: Property) => [
  {
    label: "AskedPrice",
    value: priceFormatter(property.sales_listing_price),
    averageProperty: "sales_listing_price",
    averageFormatter: priceFormatter,
  },
  {
    label: "Bedrooms",
    value: property["bedrooms"],
    averageProperty: "bedrooms",
  },
  {
    label: "Bathrooms",
    value: property["full_bathrooms"],
    averageProperty: "full_bathrooms",
  },
  {
    label: "Lot Sqft",
    value: property["lot_size"],
    averageProperty: "lot_size",
  },
  {
    label: "Building Sqft",
    value: property["building_area"],
    averageProperty: "building_area",
  },
  {
    label: "Floors",
    value: property["floors"],
    averageProperty: "floors",
  },
  {
    label: "Garages",
    value: property["garages"],
    averageProperty: "garages",
  },
  {
    label: "Year Built",
    value: property["year_built"].slice(0, 4),
  },
  // {
  //   label: "Neighborhood",
  //   value: "neighborhood",
  // },
  {
    label: "Location",
    value: `${property["neighborhood"]}`,
  },
  {
    label: "Price/Sqft",
    value: `${
      (property["sales_listing_price"] / property["building_area"]).toFixed()
    }`,
  },
];

type PropertyCardProps = {
  property: AnalyzedProperty;
  compsProperties: Property[];
};

const PropertyCard = (props: PropertyCardProps) => {
  const calcCompsAverage = (propertyName: string) => {
    if (props.compsProperties.length < 1) return "";
    const propertyType = typeof props.compsProperties[0][propertyName];
    if (propertyType === "number") {
      return (props.compsProperties.reduce((acc, comps) => ({
        [propertyName]: acc[propertyName] + comps[propertyName],
      }))[propertyName] / props.compsProperties.length).toFixed();
    }
    if (propertyName === "year_built") {
      return props.compsProperties[0][propertyName].slice(0, 4);
    }
    return props.compsProperties[0][propertyName];
    if (typeof (props.compsProperties[0][propertyName] !== "Number")) {
      return "not number";
      // return props.compsProperties[0][propertyName];
    }
    return "mew";
    // return props.compsProperties.reduce((acc, comps) => ({
    //   [propertyName]: acc[propertyName] + comps[propertyName],
    // }))[propertyName] / props.compsProperties.length;
    return 0;
  };

  return (
    <Card className={styles.propertyCard}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "4rem" }}
      >
        <Typography className={styles.propertyHeader}>
          Target Property
        </Typography>
      </Grid>
      <Grid
        container
        justifyContent="center"
        padding={"0.5rem 1rem"}
        marginBottom={"2rem"}
      >
        <img
          src={props.property.images[0] || ""}
          className="h-44 rounded-lg aspect-video"
        />
      </Grid>
      <div className="grid grid-cols-3 gap-y-4">
        <div>
          <Typography className={styles.propertyTableHeader}>
            Feature
          </Typography>
        </div>
        <div>
          <Typography className={styles.propertyTableHeader}>
            Subject
          </Typography>
        </div>
        <div>
          <Typography className={styles.propertyTableHeader}>
            Comps AVG.
          </Typography>
        </div>
        {gridRows(props.property.property).map((property, index) => {
          const averageLabel = property.averageProperty
            ? property.averageFormatter
              ? property.averageFormatter(
                calcCompsAverage(property.averageProperty),
              )
              : calcCompsAverage(property.averageProperty)
            : "";
          return (
            <>
              <div>
                <Typography className={styles.propertyRowHeader}>
                  {property.label}
                </Typography>
              </div>

              <div>
                <Typography className={clsx([styles.propertyText, "truncate"])}>
                  {property.value}
                </Typography>
              </div>

              <div>
                <Typography className={styles.propertyText}>
                  {averageLabel}
                </Typography>
              </div>
            </>
          );
        })}
      </div>
      {/* <Grid container justifyContent="center" rowGap={2}> */}
      {/*     size={12} */}
      {/*     fields={[ */}
      {/*       { className: styles.propertyTableHeader, label: "Feature" }, */}
      {/*       { className: styles.propertyTableHeader, label: "Subject" }, */}
      {/*       { */}
      {/*         className: styles.propertyTableHeader, */}
      {/*         label: "Comps AVG.", */}
      {/*       }, */}
      {/*     ]} */}
      {/*   /> */}
      {/*   {gridRows(props.property.property).map((property, index) => { */}
      {/*     const averageLabel = property.averageProperty */}
      {/*       ? property.averageFormatter */}
      {/*         ? property.averageFormatter( */}
      {/*           calcCompsAverage(property.averageProperty), */}
      {/*         ) */}
      {/*         : calcCompsAverage(property.averageProperty) */}
      {/*       : ""; */}
      {/*     return ( */}
      {/*       <GridTableField */}
      {/*         key={index} */}
      {/*         size={12} */}
      {/*         fields={[ */}
      {/*           { className: styles.propertyRowHeader, label: property.label }, */}
      {/*           { */}
      {/*             className: styles.propertyText, */}
      {/*             label: `${property.value}`, */}
      {/*           }, */}
      {/*           { */}
      {/*             className: styles.propertyText, */}
      {/*             label: `${averageLabel}`, */}
      {/*             // label: "meow", */}
      {/*           }, */}
      {/*         ]} */}
      {/*       /> */}
      {/*     ); */}
      {/*   })} */}
      {/* </Grid> */}
    </Card>
  );
};

export default PropertyCard;
