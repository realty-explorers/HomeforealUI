import React, { useState } from 'react';
import Deal from '@/models/deal';
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Typography
} from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShareIcon from '@mui/icons-material/Share';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ExpandIcon from '@mui/icons-material/Expand';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
    height: ${theme.spacing(4.5)};
    width: ${theme.spacing(4.5)};
  }
`
);

const priceFormatter = (value: number) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value.toFixed(2)}`;

type PropertyCardProps = {
  deal: Deal;
  setSelectedDeal: (deal: Deal) => void;
};
const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps
) => {
  const handleDealSelected = () => {
    props.setSelectedDeal(props.deal);
  };

  return (
    <Card sx={{}}>
      <CardActionArea onClick={handleDealSelected}>
        <CardMedia
          sx={{
            height: 0,
            paddingTop: '56.25%' // 16:9
          }}
          image={props.deal.house.imgSrc}
          title={props.deal.house.address}
        />
        <CardContent>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            <List
              disablePadding
              sx={{
                width: '100%'
              }}
            >
              <ListItem disableGutters>
                <ListItemAvatarWrapper>
                  <LocalOfferIcon color="warning" />
                </ListItemAvatarWrapper>
                <ListItemText
                  primary="Price"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" variant="h4" noWrap>
                    {priceFormatter(props.deal.house.price)}
                  </Typography>
                </Box>
              </ListItem>

              <ListItem disableGutters>
                <ListItemAvatarWrapper>
                  <PriceCheckIcon color="success" />
                </ListItemAvatarWrapper>
                <ListItemText
                  primary="Comps"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" variant="h4" noWrap>
                    {percentFormatter(props.deal.profit)}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disableGutters>
                <ListItemAvatarWrapper>
                  <ExpandIcon color="primary" />
                </ListItemAvatarWrapper>
                <ListItemText
                  primary="Sqft"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" variant="h4" noWrap>
                    {props.deal.house.area}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <Grid container justifyContent="center">
          <IconButton aria-label="add to favorites">
            <FavoriteOutlinedIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          {/* <IconButton aria-label="share" onClick={handleLocationAction}>
            <LocationOnIcon />
          </IconButton> */}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
