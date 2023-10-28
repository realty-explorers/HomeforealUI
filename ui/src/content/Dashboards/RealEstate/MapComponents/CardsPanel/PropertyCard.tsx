import React, { memo, useEffect, useState } from "react";
import PropertyPreview from "@/models/propertyPreview";
import { openGoogleSearch } from "@/utils/windowFunctions";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CardProps,
  Chip,
  Container,
  Divider,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Switch,
  Tooltip,
  Typography,
  withStyles,
} from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import InsightsIcon from "@mui/icons-material/Insights";
import ExpandIcon from "@mui/icons-material/Expand";
import BarChartIcon from "@mui/icons-material/BarChart";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  numberStringUtil,
  percentFormatter,
  priceFormatter,
  validateValue,
} from "@/utils/converters";
import { useDispatch } from "react-redux";
import styles from "../styles.module.scss";
import { setSelectedPropertyPreview } from "@/store/slices/propertiesSlice";
import Image from "@/components/Photos/Image";
import clsx from "clsx";
interface StyledCardProps extends CardProps {
  selected?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "selected",
})<StyledCardProps>(({ selected, theme }) => ({
  ...(selected && {
    boxShadow:
      // '0px 0px 30px rgba(0, 24, 255, 0.8),0px 2px 20px rgba(159, 162, 191, 0.7)'
      " rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px",
  }),
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  width: "15rem",
  height: "19rem",
  // flexShrink: 0,
  margin: "0 0.5rem",
  pointerEvents: "all",
}));

const defaultImage =
  "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=";

type PropertyCardProps = {
  property: PropertyPreview;
  setSelectedProperty: (property: PropertyPreview) => void;
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
  const handlePropertySelected = async () => {
    if (props.selected) {
      dispatch(setSelectedPropertyPreview(null));
      props.setSelectedProperty(null);
    } else {
      props.setSelectedProperty(props.property);
      dispatch(setSelectedPropertyPreview(props.property));
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

  // const profit = arvPercentage.toFixed(100);
  const profit = 3;

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
              {arvPercentage.toFixed()}%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={styles.cardDiscountText}>
              Under ARV
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

  return (
    <StyledCard
      selected={props.selectedProperty &&
        props.selectedProperty.source_id === props.property.source_id}
      className={props.className}
      id={props.property.source_id}
    >
      <CardActionArea onClick={handlepropertySelected}>
        <CardMedia
          component="img"
          sx={{
            // height: 0,
            // paddingTop: '56.25%' // 16:9
            aspectRatio: "16/9",
            backgroundColor: "black",
            height: "7em",
          }}
          image={cardImage}
          // image={props.property.house.imgSrc}
          alt={props.property.address}
          title={props.property.address}
          onError={() =>
            setCardImage(
              "/static/images/placeholders/illustrations/unknown-house.png",
            )}
        />
        {numberStringUtil(profit) >= 0 && (
          <Grid className={styles.cardDiscountChip} container>
            <Grid item xs={12}>
              <Typography className={styles.cardDiscountValue}>
                {numberStringUtil(props.property.arv_percentage).toFixed()}%
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={styles.cardDiscountText}>
                Under ARV
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* <Chip label="25%" size="small" className={styles.cardDiscountChip} /> */}

        <IconButton
          aria-label="add to favorites"
          className={styles.cardSaveIcon}
          onClick={(e) => {
            alert("hi");
            e.stopPropagation();
          }}
          sx={{ padding: 0 }}
        >
          <FavoriteOutlinedIcon sx={{ color: "white" }} />
        </IconButton>
        <CardContent sx={{ paddingBottom: 0, paddingTop: "0em" }}>
          {/* <AddressLink>{props.property.address}</AddressLink> */}
          <Grid
            container
            justifyContent={"center"}
            sx={{ margin: "0.5rem 0 0.2rem 0" }}
          >
            <Chip
              label={props.property.address}
              clickable
              size="small"
              onClick={() => openGoogleSearch(props.property.address)}
            />
          </Grid>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            {/* <h4>{props.property.address}</h4> */}
            <List
              disablePadding
              sx={{
                width: "100%",
              }}
            >
              <IconListItem
                icon={<LocalOfferIcon color="warning" />}
                title="Price"
                value={priceFormatter(props.property.listing_price)}
              />

              <IconListItem
                icon={<PriceChangeIcon color="success" />}
                title="Comps Sold"
                value={priceFormatter(
                  numberStringUtil(props.property.sales_comps_price).toFixed(),
                )}
              />

              <IconListItem
                icon={<InsightsIcon color="inherit" />}
                title={"ARV"}
                value={priceFormatter(
                  numberStringUtil(props.property.arv_price).toFixed(),
                )}
              />

              <IconListItem
                icon={<BarChartIcon color="primary" />}
                title={"Cap Rate"}
                value={`${
                  (numberStringUtil(props.property.cap_rate) * 100).toFixed(2)
                } %`}
              />
            </List>
          </Grid>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default memo(PropertyCard);
