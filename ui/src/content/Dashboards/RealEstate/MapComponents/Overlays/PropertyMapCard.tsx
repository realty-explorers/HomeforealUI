import Deal from "@/models/deal";
import {
  distanceFormatter,
  percentFormatter,
  priceFormatter,
  validateValue,
} from "@/utils/converters";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Grow,
  Link,
  List,
  ListItem,
  ListItemText,
  Pagination,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import CompsProperty from "@/models/comps_property";
import { openGoogleSearch } from "@/utils/windowFunctions";
import PropertyPreview from "@/models/propertyPreview";
import Image from "@/components/Photos/Image";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import WcIcon from "@mui/icons-material/Wc";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";

const AddressLink = styled("h3")(({ theme }) => ({
  padding: 0,
  margin: 0,
  textAlign: "center",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  paddingBottom: "2px",
  cursor: "pointer",
}));

type PropertyMapCardProps = {
  property: PropertyPreview;
};
const PropertyMapCard: React.FC<PropertyMapCardProps> = (
  props: PropertyMapCardProps,
) => {
  const defaultImage =
    "/static/images/placeholders/covers/house_placeholder.jpg";
  const [cardImage, setCardImage] = useState(
    props.property?.primary_image || defaultImage,
  );

  const showDistance = () => {
    try {
      // return distanceFormatter(props.property.distance);
      return distanceFormatter(1);
    } catch (e) {
      console.log(e);
      return 0;
    }
  };
  return (
    <div className="flex rounded-xl bg-white w-80 h-40">
      <div className="w-1/3 h-full relative">
        {/* <Image */}
        {/*   src={typeof cardImage === "string" ? cardImage : defaultImage} */}
        {/*   alt={props.property.address} */}
        {/*   // onError={() => */}
        {/*   //   setCardImage( */}
        {/*   //     "https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=", */}
        {/*   //   )} */}
        {/*   fill */}
        {/*   className="object-cover object-center w-full h-full rounded-l-xl" */}
        {/* /> */}
        {/* <img */}
        {/*   src={cardImage} */}
        {/*   className="w-full h-full rounded-l-xl object-cover object-center" */}
        {/* /> */}

        <Image
          src={validateValue(cardImage, "string", defaultImage)}
          alt={props.property?.address}
          defaultSrc={defaultImage}
          className="object-cover object-center w-full h-full rounded-l-xl"
        />
      </div>
      <div className="flex flex-col justify-around w-2/3 px-4 gap-y-2">
        {/* import HotelIcon from '@mui/icons-material/Hotel'; */}
        {/* import BathtubIcon from '@mui/icons-material/Bathtub'; */}
        {/* import SquareFootIcon from '@mui/icons-material/SquareFoot'; */}
        <div className="flex w-full items-center justify-between mt-2">
          <div className="flex">
            <BedOutlinedIcon />
            <Typography>{props.property?.bedrooms}</Typography>
          </div>
          <div className="flex">
            <WcIcon />
            <Typography>{props.property?.total_bathrooms}</Typography>
          </div>
          <div className="flex">
            <SquareFootIcon />
            <Typography>{props.property?.building_area}</Typography>
          </div>
        </div>
        <div className="flex items-center">
          <PinDropOutlinedIcon />
          <Typography className="text-[0.7rem] ml-2 font-poppins">
            {props.property?.address}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography className="font-poppins justify-center text-center">
              Price
            </Typography>

            <Typography className="font-poppins font-bold">
              {priceFormatter(props.property?.sales_listing_price)}
            </Typography>
          </div>
          {typeof props.property?.arv_price === "number" && (
            <div className="flex flex-col">
              <Typography className="font-poppins justify-center text-center">
                ARV
              </Typography>

              <Typography className="font-poppins font-bold">
                {priceFormatter(props.property?.arv_price)}
              </Typography>
            </div>
          )}

          {/* <Typography className="font-poppins font-bold text-lg"> */}
          {/*   {props.property.arv_price} */}
          {/* </Typography> */}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card sx={{ width: 200 }}>
        <CardMedia
          component="img"
          height="8rem"
          className="aspect-video"
          image={cardImage}
          alt={props.property.address}
          onError={() =>
            setCardImage(
              "/static/images/placeholders/illustrations/unknown-house.png",
            )}
        />
        <CardContent sx={{ paddingTop: "1em" }}>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            <List
              disablePadding
              sx={{
                width: "100%",
              }}
            >
              <AddressLink
                onClick={() => openGoogleSearch(props.property.address)}
              >
                {props.property.address}
              </AddressLink>
              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Price"
                  primaryTypographyProps={{ variant: "h5", noWrap: true }}
                  secondaryTypographyProps={{
                    variant: "subtitle2",
                    noWrap: true,
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {priceFormatter(
                      props.property.listing_price,
                    )}
                  </Typography>
                </Box>
              </ListItem>

              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Sqft"
                  primaryTypographyProps={{ variant: "h5", noWrap: true }}
                  secondaryTypographyProps={{
                    variant: "subtitle2",
                    noWrap: true,
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {props.property.building_area}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Beds"
                  primaryTypographyProps={{ variant: "h5", noWrap: true }}
                  secondaryTypographyProps={{
                    variant: "subtitle2",
                    noWrap: true,
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {props.property.bedrooms}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Baths"
                  primaryTypographyProps={{ variant: "h5", noWrap: true }}
                  secondaryTypographyProps={{
                    variant: "subtitle2",
                    noWrap: true,
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {props.property.full_bathrooms}
                  </Typography>
                </Box>
              </ListItem>

              {/* <ListItem disableGutters sx={{ padding: 0 }}> */}
              {/*   <ListItemText */}
              {/*     primary="Distance" */}
              {/*     primaryTypographyProps={{ variant: "h5", noWrap: true }} */}
              {/*     secondaryTypographyProps={{ */}
              {/*       variant: "subtitle2", */}
              {/*       noWrap: true, */}
              {/*     }} */}
              {/*   /> */}
              {/*   <Box> */}
              {/*     <Typography align="right" noWrap> */}
              {/*       {showDistance()} */}
              {/*     </Typography> */}
              {/*   </Box> */}
              {/* </ListItem> */}
            </List>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default PropertyMapCard;
