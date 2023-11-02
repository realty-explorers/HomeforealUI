import React, { memo, useEffect, useState } from "react";
import PropertyPreview from "@/models/propertyPreview";
import { openGoogleSearch } from "@/utils/windowFunctions";
import { Button, CardProps, Chip, Grid, Typography } from "@mui/material";
import {
  numberStringUtil,
  percentFormatter,
  priceFormatter,
  validateValue,
} from "@/utils/converters";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles.module.scss";
import Image from "@/components/Photos/Image";
import clsx from "clsx";
import { selectFilter } from "@/store/slices/filterSlice";

const defaultImage =
  "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=";

type PropertyCardProps = {
  property: PropertyPreview;
  selectProperty: (property: PropertyPreview) => void;
  deselectProperty: (property: PropertyPreview) => void;
  setOpenMoreDetails: (open: boolean) => void;
  selected: boolean;
  // setHoveredProperty: (property: PropertyPreview) => void;
  className?: string;
};
const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps,
) => {
  const dispatch = useDispatch();
  const [cardImage, setCardImage] = useState(
    validateValue(props.property?.primary_image, "string", defaultImage),
  );
  const { strategyMode } = useSelector(selectFilter);
  const handlePropertySelected = async () => {
    if (props.selected) {
      props.deselectProperty(props.property);
    } else {
      props.selectProperty(props.property);
    }
  };

  const handleOpenDetails = () => {
    // props.setSelectedproperty(props.deal);
    // dispatch(setSearchAnalyzedProperty(props.property));
    // props.setOpenMoreDetails(true);
  };

  const showFixedValue = (value: number) => {
    try {
      return percentFormatter(value);
    } catch (e) {
      return value;
    }
  };

  useEffect(() => {
    setCardImage(
      validateValue(props.property?.primary_image, "string", defaultImage),
    );
    console.log("rerender property card");
  }, [props.property]);

  const arvPercentage =
    props.property?.arv_price && props.property.arv_price > 0
      ? Math.round(
        props.property.arv_price -
          props.property.sales_listing_price,
      ) / props.property.arv_price * 100
      : 0;

  const compsPercentage =
    props.property?.sales_comps_price && props.property.sales_comps_price > 0
      ? Math.round(
        props.property.sales_comps_price -
          props.property.sales_listing_price,
      ) / props.property.sales_comps_price * 100
      : 0;

  // const profit = arvPercentage.toFixed(100);
  const profit = 3;

  const getStrategyValue = () => {
    switch (strategyMode) {
      case "ARV":
        return arvPercentage;
      case "Comps":
        return compsPercentage;
      default:
        return 0;
    }
  };

  return (
    <Button
      className={clsx([
        "w-full h-full flex flex-col p-0 rounded-xl relative",
        props.selected &&
        "ring ring-black",
      ])}
      onClick={handlePropertySelected}
      // onMouseOver={() => props.setHoveredProperty(props.property)}
    >
      {typeof props.property.arv_price === "number" && (
        <Grid className={styles.cardDiscountChip} container>
          <Grid item xs={12}>
            <Typography className={styles.cardDiscountValue}>
              {getStrategyValue().toFixed()}%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={styles.cardDiscountText}>
              {strategyMode}
            </Typography>
          </Grid>
        </Grid>
      )}
      <div className="flex w-full h-1/3 relative">
        {/* <Image */}
        {/*   src={validateValue(cardImage, "string", defaultImage)} */}
        {/*   alt={props.property?.address || ""} */}
        {/*   // onError={() => */}
        {/*   //   setCardImage( */}
        {/*   //     "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=", */}
        {/*   //   )} */}
        {/*   fill */}
        {/*   className="object-cover object-center rounded-t-xl opacity-0 transition-opacity duration-1000" */}
        {/*   onLoadingComplete={(image) => image.classList.remove("opacity-0")} */}
        {/* /> */}
        {/* <img */}
        {/*   src={validateValue(cardImage, "string", defaultImage)} */}
        {/*   className="w-full h-full rounded-t-xl object-cover object-center" */}
        {/* /> */}
        <Image
          src={validateValue(cardImage, "string", "")}
          alt=""
          defaultSrc={defaultImage}
          className="w-full h-full rounded-t-xl object-cover object-center"
        />
      </div>
      <div className="flex flex-col h-2/3 w-full px-4">
        <Chip
          label={props.property?.address}
          clickable
          size="small"
          className=" my-2 h-5"
          onClick={() => openGoogleSearch(props.property.address)}
        />
        <div className={styles.cardInfoRow}>
          <Typography>Price</Typography>
          <Typography>
            {priceFormatter(props.property?.sales_listing_price)}
          </Typography>
        </div>
        <div className={styles.cardInfoRow}>
          <Typography>Comps Sale</Typography>
          <Typography>
            {priceFormatter(props.property?.sales_comps_price)}
          </Typography>
        </div>
        <div className={styles.cardInfoRow}>
          <Typography>ARV</Typography>
          <Typography>{priceFormatter(props.property?.arv_price)}</Typography>
        </div>
        <div className={styles.cardInfoRow}>
          <Typography>Cap Rate</Typography>
          <Typography>
            {(numberStringUtil(props.property?.cap_rate) * 100).toFixed(2)} %
          </Typography>
        </div>
      </div>
    </Button>
  );
};

export default memo(PropertyCard);
