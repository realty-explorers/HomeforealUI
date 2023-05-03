import Deal from '@/models/deal';
import Property from '@/models/property';
import {
  distanceFormatter,
  percentFormatter,
  priceFormatter
} from '@/utils/converters';
import {
  Grid,
  styled,
  Pagination,
  Grow,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import PropertyCard from './PropertyCard';
import CompsProperty from '@/models/comps_property';

type PropertyMapCardProps = {
  property: CompsProperty;
};
const PropertyMapCard: React.FC<PropertyMapCardProps> = (
  props: PropertyMapCardProps
) => {
  const [cardImage, setCardImage] = useState(props.property.primaryImage);

  const showDistance = () => {
    try {
      return distanceFormatter(props.property.distance);
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
          height="100"
          image={cardImage}
          alt={props.property.address}
          onError={() =>
            setCardImage(
              '/static/images/placeholders/illustrations/unknown-house.png'
            )
          }
        />
        <CardContent>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            <List
              disablePadding
              sx={{
                width: '100%'
              }}
            >
              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Add."
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {props.property.address}
                  </Typography>
                </Box>
              </ListItem>
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
                    {priceFormatter(props.property.price)}
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
                    {props.property.area}
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
                    {props.property.beds}
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
                    {props.property.baths}
                  </Typography>
                </Box>
              </ListItem>

              <ListItem disableGutters sx={{ padding: 0 }}>
                <ListItemText
                  primary="Distance"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" noWrap>
                    {showDistance()}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default PropertyMapCard;
