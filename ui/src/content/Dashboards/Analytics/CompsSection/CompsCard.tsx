import { Card, Checkbox, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";
import Image from "@/components/Photos/Image";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import { Property } from "@/models/analyzedProperty";
import styled from "@emotion/styled";
import { priceFormatter } from "@/utils/converters";

const CheckBoxWhite = styled(Checkbox)(({ theme }) => ({
  color: "white",
}));

const gridRows = (property: Property) => [
  {
    label: "AskedPrice",
    value: priceFormatter(property.sales_listing_price),
  },
  {
    label: "Bedrooms",
    value: property.bedrooms,
  },
  {
    label: "Bathrooms",
    value: property.full_bathrooms,
  },
  {
    label: "Lot Sqft",
    value: property.lot_size,
  },
  {
    label: "Building Sqft",
    value: property.building_area,
  },
  {
    label: "Floors",
    value: property.floors,
  },
  {
    label: "Garages",
    value: property.garages,
  },
  {
    label: "Year Built",
    value: property.year_built,
  },
  {
    label: "Neighborhodd",
    value: property.neighborhood,
  },
  {
    label: "Price/Sqft",
    value: priceFormatter(
      property.building_area && property.building_area > 0
        ? (property.sales_listing_price / property.building_area).toFixed()
        : 0,
    ),
  },
];

type CompsCardProps = {
  index: number;
  compsProperty: Property;
  selected: boolean;
  toggle: () => void;
};
const CompsCard = (props: CompsCardProps) => {
  return (
    <Card className={styles.compsCard}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "4rem" }}
      >
        <CheckBoxWhite
          title="Select this property"
          checked={props.selected}
          onClick={props.toggle}
        />
        <Typography className={styles.propertyHeader}>
          Comp {props.index}
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
            { className: styles.propertyTableHeader, label: "Comps" },
          ]}
        />
        {gridRows(props.compsProperty).map((gridValues, index) => (
          <GridTableField
            key={index}
            size={12}
            fields={[
              { className: styles.propertyRowHeader, label: gridValues.label },
              {
                className: styles.propertyText,
                label: `${gridValues.value}`,
              },
            ]}
          />
        ))}
      </Grid>
    </Card>
  );
};

export default CompsCard;
