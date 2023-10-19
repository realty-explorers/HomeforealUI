import { Card, Checkbox, Divider, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";
import Image from "next/image";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import styled from "@emotion/styled";
import { priceFormatter } from "@/utils/converters";
import clsx from "clsx";
import React, { useState } from "react";
import { CompData } from "@/models/analyzedProperty";

const CheckBoxWhite = styled(Checkbox)(({ theme }) => ({
  color: "white",
}));

const gridRows = (property: CompData) => [
  {
    label: "Rent Price",
    value: priceFormatter(property.rents_closing_price),
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
    label: "Rent/Sqft",
    value: priceFormatter(
      property.building_area && property.building_area > 0
        ? (property.rents_closing_price / property.building_area).toFixed()
        : 0,
    ),
  },
];

const getSimilarityValues = (color?: string) => {
  switch (color) {
    case "red":
      return {
        label: "Very Low",
        class: "text-red-500",
      };
    case "orange":
      return {
        label: "Low",
        class: "text-orange-500",
      };
    case "yellow":
      return {
        label: "Medium",
        class: "text-yellow-500",
      };
    case "green":
      return {
        label: "High",
        class: "text-green-500",
      };
    default:
      return {
        label: "N/A",
        class: "text-gray-500",
      };
  }
};

const defaultImage =
  "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=";

type RentsCardProps = {
  index: number;
  compsProperty: CompData;
  selected: boolean;
  toggle: () => void;
  className?: string;
};
const RentsCard = (props: RentsCardProps) => {
  const [cardImage, setCardImage] = useState(
    props.compsProperty.primary_image || defaultImage,
  );
  return (
    <Card className={props.className}>
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
        <div className="h-44 w-full relative">
          {/* <Image */}
          {/*   src={cardImage} */}
          {/*   alt={props.compsProperty.address} */}
          {/*   placeholder="blur" */}
          {/*   blurDataURL={defaultImage} */}
          {/*   onError={() => setCardImage(defaultImage)} */}
          {/*   fill */}
          {/*   className="h-44 ascpect-ratio object-cover object-center  rounded-xl" */}
          {/* /> */}

          <img
            src={cardImage}
            className="h-44 ascpect-ratio object-cover object-center  rounded-xl"
            onError={() => setCardImage(defaultImage)}
          />
        </div>
        {/* <img */}
        {/*   // src={props.compsProperty.images?.[0] || ""} */}
        {/*   src={props.compsProperty.primary_image || */}
        {/*     "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q="} */}
        {/*   className="h-44 rounded-lg aspect-video object-cover" */}
        {/* /> */}
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
            <React.Fragment key={index}>
              <div className="text-white">
                <Typography className={styles.propertyRowHeader}>
                  {property.label}
                </Typography>
              </div>

              <div className="text-white">
                <Typography className={clsx([styles.propertyText, "truncate"])}>
                  {property.value}
                </Typography>
              </div>
            </React.Fragment>
          );
        })}

        <div className="col-span-2">
          <Divider variant="middle" className="bg-white w-full m-0" />
        </div>
        <>
          <div className="text-white">
            <Typography
              className={clsx([styles.propertyRowHeader, "truncate"])}
            >
              Distance
            </Typography>
          </div>
          <div className="text-white">
            <Typography className={clsx([styles.propertyText, "truncate"])}>
              {props.compsProperty.distance?.toFixed(2)} Miles
            </Typography>
          </div>
        </>

        <>
          <div className="text-white">
            <Typography
              className={clsx([styles.propertyRowHeader, "truncate"])}
            >
              Similarity
            </Typography>
          </div>
          <div>
            <Typography
              className={clsx([
                styles.propertyText,
                "font-semibold",
                getSimilarityValues(props.compsProperty.similarity_color).class,
              ])}
            >
              {getSimilarityValues(props.compsProperty.similarity_color).label}
            </Typography>
          </div>
        </>
      </div>
    </Card>
  );
};

export default RentsCard;
