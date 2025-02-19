import Deal from '@/models/deal';
import {
  distanceFormatter,
  percentFormatter,
  priceFormatter,
  validateValue
} from '@/utils/converters';
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
  Typography
} from '@mui/material';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import CompsProperty from '@/models/comps_property';
import { openGoogleSearch } from '@/utils/windowFunctions';
import PropertyPreview from '@/models/propertyPreview';
import Image from '@/components/Photos/Image';
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import WcIcon from '@mui/icons-material/Wc';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TodayIcon from '@mui/icons-material/Today';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { calculateArvPercentage } from '@/utils/calculationUtils';
import { readableDateDiff } from '@/utils/dateUtils';

const AddressLink = styled('h3')(({ theme }) => ({
  padding: 0,
  margin: 0,
  textAlign: 'center',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: '2px',
  cursor: 'pointer'
}));

type PropertyMapCardProps = {
  property: PropertyPreview;
};
const PropertyMapCard: React.FC<PropertyMapCardProps> = (
  props: PropertyMapCardProps
) => {
  const defaultImage =
    '/static/images/placeholders/covers/house_placeholder.jpg';
  const [cardImage, setCardImage] = useState(
    props.property?.image || defaultImage
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

  const stats = `${props.property?.beds} Beds ● ${props.property?.baths} Baths ● ${props.property?.area} Sqft`;

  const arvPercentage = calculateArvPercentage(
    props.property.arvPrice,
    props.property.price
  );
  const compsPercentage = calculateArvPercentage(
    props.property.arvPrice,
    props.property.price
  );
  const arvDiscount = `ARV ↓${arvPercentage.toFixed()}%`;
  const compsDiscount = `Comps ↓${compsPercentage.toFixed()}%`;
  const seperator = ' ● ';
  const discounts = `ARV ↓${arvPercentage.toFixed()}% ● Comps ↓${compsPercentage.toFixed()}%`;

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
          src={validateValue(cardImage, 'string', defaultImage)}
          alt={props.property?.address}
          defaultSrc={defaultImage}
          className="object-cover object-center w-full h-full rounded-l-xl"
        />
      </div>
      <div className="flex flex-col  w-2/3 px-4 gap-y-0">
        {/* import HotelIcon from '@mui/icons-material/Hotel'; */}
        {/* import BathtubIcon from '@mui/icons-material/Bathtub'; */}
        {/* import SquareFootIcon from '@mui/icons-material/SquareFoot'; */}
        <div className="flex w-full items-center justify-between mt-2">
          <Typography className="font-poppins font-semibold text-xs">
            {stats}
          </Typography>
        </div>
        <div className="flex items-center mt-2 w-full ">
          <PinDropOutlinedIcon fontSize="small" />
          <div className="flex flex-col w-full truncate">
            <Typography className="text-xs ml-2 font-poppins ">
              {props.property?.address}
            </Typography>
            <Typography className="text-xs ml-2 font-poppins"></Typography>
          </div>
        </div>

        <div className="flex items-center mt-2 w-full gap-x-2 ">
          <TodayIcon fontSize="small" />
          <Typography className="text-xs font-poppins text-center">
            {readableDateDiff(props.property.listDate)}
            {/* 3 Days Old */}
          </Typography>
        </div>

        <div className="flex items-center mt-2 w-full">
          <LocalOfferIcon fontSize="small" />
          <Typography className="text-xs ml-2 font-poppins text-center">
            {priceFormatter(props.property?.price)}
          </Typography>
        </div>

        <div className="flex items-center mt-2 w-full">
          {/* <AssessmentIcon fontSize="small" /> */}

          <Typography className="text-[0.7rem] font-poppins text-center flex bg-arv  text-white font-semibold rounded px-1">
            {arvDiscount}
          </Typography>

          {/* <Typography className="text-xs  font-poppins text-center mx-1"> */}
          {/*   {seperator} */}
          {/* </Typography> */}

          <Typography className="ml-2 text-[0.7rem]  font-poppins text-center bg-secondary text-white font-semibold rounded px-1">
            {compsDiscount}
          </Typography>
        </div>

        {/* <div className="flex items-center mt-2 w-full"> */}
        {/*   <LocalOfferIcon fontSize="small" /> */}
        {/**/}
        {/*   <Typography className="text-xs ml-1 font-poppins text-center"> */}
        {/*     3 Days Old */}
        {/*   </Typography> */}
        {/**/}
        {/*   <Typography className="text-xs ml-1 font-poppins text-center"> */}
        {/*     {priceFormatter(props.property?.sales_listing_price)} */}
        {/*   </Typography> */}
        {/* </div> */}

        {/* <div className="flex items-center justify-between"> */}
        {/*   <div className="flex flex-col"> */}
        {/*     <Typography className="font-poppins justify-center text-center"> */}
        {/*       Price */}
        {/*     </Typography> */}
        {/**/}
        {/*     <Typography className="font-poppins font-bold"> */}
        {/*       {priceFormatter(props.property?.sales_listing_price)} */}
        {/*     </Typography> */}
        {/*   </div> */}
        {/*   {typeof props.property?.arvPrice === "number" && ( */}
        {/*     <div className="flex flex-col"> */}
        {/*       <Typography className="font-poppins justify-center text-center"> */}
        {/*         ARV */}
        {/*       </Typography> */}
        {/**/}
        {/*       <Typography className="font-poppins font-bold"> */}
        {/*         {priceFormatter(props.property?.arvPrice)} */}
        {/*       </Typography> */}
        {/*     </div> */}
        {/*   )} */}
        {/**/}
        {/* </div> */}
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
              '/static/images/placeholders/illustrations/unknown-house.png'
            )
          }
        />
        <CardContent sx={{ paddingTop: '1em' }}>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            <List
              disablePadding
              sx={{
                width: '100%'
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
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {priceFormatter(props.property.listing_price)}
                  </Typography>
                </Box>
              </ListItem>

              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Sqft"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
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
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
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
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
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
