import { Card, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";
import Image from "@/components/Photos/Image";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";

const gridRows = (property: Property) => [
  {
    label: "AskedPrice",
    value: "sales_listing_price",
  },
  {
    label: "Bedrooms",
    value: "bedrooms",
  },
  {
    label: "Bathrooms",
    value: "full_bathrooms",
  },
  {
    label: "Lot Sqft",
    value: "lot_size",
  },
  {
    label: "Building Sqft",
    value: "building_area",
  },
  {
    label: "Floors",
    value: "floors",
  },
  {
    label: "Garages",
    value: "garages",
  },
  {
    label: "Year Built",
    value: "year_built",
  },
  {
    label: "Neighborhood",
    value: "neighborhood",
  },
  {
    label: "Price/Sqft",
    value: "sales_listing_price",
  },
];

type PropertyCardProps = {
  property: AnalyzedProperty;
  compsProperties: Property[];
};

const PropertyCard = (props: PropertyCardProps) => {
  const calcCompsAverage = (propertyName: string) => {
    if (props.compsProperties.length < 1) return "";
    if (typeof (props.compsProperties[0][propertyName] !== "number")) {
      return props.compsProperties[0][propertyName];
    }
    return props.compsProperties.reduce((acc, comps) => ({
      [propertyName]: acc[propertyName] + comps[propertyName],
    }))[propertyName] / props.compsProperties.length;
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
        <Image />
      </Grid>
      <Grid container justifyContent="center" rowGap={2}>
        <GridTableField
          size={12}
          fields={[
            { className: styles.propertyTableHeader, label: "Feature" },
            { className: styles.propertyTableHeader, label: "Subject" },
            {
              className: styles.propertyTableHeader,
              label: "Comps AVG.",
            },
          ]}
        />
        {gridRows(props.property.property).map((property, index) => (
          <GridTableField
            key={index}
            size={12}
            fields={[
              { className: styles.propertyRowHeader, label: property.label },
              {
                className: styles.propertyText,
                label: `${props.property.property[property.value]}`,
              },
              {
                className: styles.propertyText,
                label: `${calcCompsAverage(property.value)}`,
              },
            ]}
          />
        ))}
      </Grid>
    </Card>
  );
};

export default PropertyCard;
