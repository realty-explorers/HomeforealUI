import { Card, Checkbox, Divider, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";
import Image from "@/components/Photos/Image";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import { Property } from "@/models/analyzedProperty";
import styled from "@emotion/styled";
import { priceFormatter } from "@/utils/converters";
import clsx from "clsx";

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
    value: property.year_built.slice(0, 4),
  },
  {
    label: "Hood",
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
          Comp {props.index + 1}
        </Typography>
      </Grid>
      <Grid
        container
        justifyContent="center"
        padding={"0.5rem 1rem"}
        marginBottom={"2rem"}
      >
        <img
          // src={props.compsProperty.images?.[0] || ""}
          src="https://img.freepik.com/free-vector/house-icon_23-2147510119.jpg"
          className="h-44 rounded-lg aspect-video"
        />
      </Grid>
      <div className="grid grid-cols-2 gap-y-4">
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
        {gridRows(props.compsProperty).map((property, index) => {
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
            </>
          );
        })}

        <div className="col-span-2">
          <Divider variant="middle" className="bg-white w-full m-0" />
        </div>
        <>
          <div>
            <Typography
              className={clsx([styles.propertyRowHeader, "truncate"])}
            >
              Distance
            </Typography>
          </div>
          <div>
            <Typography className={clsx([styles.propertyText, "truncate"])}>
              0
            </Typography>
          </div>
        </>

        <>
          <div>
            <Typography
              className={clsx([styles.propertyRowHeader, "truncate"])}
            >
              Similarity
            </Typography>
          </div>
          <div>
            <Typography className={clsx([styles.propertyText, "truncate"])}>
              0
            </Typography>
          </div>
        </>

        <>
          <div>
            <Typography
              className={clsx([styles.propertyRowHeader, "truncate"])}
            >
              Closed Price
            </Typography>
          </div>
          <div>
            <Typography className={clsx([styles.propertyText, "truncate"])}>
              {priceFormatter(props.compsProperty.sales_listing_price)}
            </Typography>
          </div>
        </>
      </div>
    </Card>
  );
};

export default CompsCard;
