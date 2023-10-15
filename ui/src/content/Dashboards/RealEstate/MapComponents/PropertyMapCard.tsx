import Deal from "@/models/deal";
import {
  distanceFormatter,
  percentFormatter,
  priceFormatter,
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
import PropertyCard from "./PropertyCard";
import CompsProperty from "@/models/comps_property";
import { openGoogleSearch } from "@/utils/windowFunctions";
import AnalyzedProperty from "@/models/analyzedProperty";

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
  property: AnalyzedProperty;
};
const PropertyMapCard: React.FC<PropertyMapCardProps> = (
  props: PropertyMapCardProps,
) => {
  const [cardImage, setCardImage] = useState(
    "https://img.freepik.com/free-vector/house-icon_23-2147510119.jpg",
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
