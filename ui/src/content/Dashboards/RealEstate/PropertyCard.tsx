import React, { useEffect, useState } from 'react';
import Deal from '@/models/deal';
import { openGoogleSearch } from '@/utils/windowFunctions';
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CardProps,
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
import LinkIcon from '@mui/icons-material/Link';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ExpandIcon from '@mui/icons-material/Expand';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { percentFormatter, priceFormatter } from '@/utils/converters';
interface StyledCardProps extends CardProps {
  selected?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<StyledCardProps>(({ selected, theme }) => ({
  ...(selected && {
    boxShadow:
      '0px 0px 30px rgba(0, 24, 255, 0.8),0px 2px 20px rgba(159, 162, 191, 0.7)'
  }),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: '15rem',
  height: '19rem',
  flexShrink: 0
}));

const StyledListItem = styled(ListItem)(
  ({ theme }) => `
  padding: 0;
  padding-bottom: ${theme.spacing(1)};
  `
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  // padding: ${theme.spacing(0.5)};
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

type PropertyCardProps = {
  deal: Deal;
  setSelectedDeal: (deal: Deal) => void;
  selectedDeal: Deal;
};
const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps
) => {
  const handleDealSelected = () => {
    if (props.selectedDeal === props.deal) props.setSelectedDeal(null);
    else props.setSelectedDeal(props.deal);
  };

  const [cardImage, setCardImage] = useState(props.deal.property.primaryImage);

  const showFixedValue = (value: number) => {
    try {
      return percentFormatter(value);
    } catch (e) {
      return value;
    }
  };

  useEffect(() => {
    setCardImage(props.deal.property.primaryImage);
    return () => {};
  }, [props.deal]);

  return (
    <StyledCard
      selected={
        props.selectedDeal &&
        props.selectedDeal.property.id === props.deal.property.id
      }
    >
      <CardActionArea onClick={handleDealSelected}>
        <CardMedia
          component="img"
          sx={{
            // height: 0,
            // paddingTop: '56.25%' // 16:9
            aspectRatio: '16/9',
            backgroundColor: 'black',
            height: '7em'
          }}
          image={cardImage}
          // image={props.deal.house.imgSrc}
          alt={props.deal.property.address}
          title={props.deal.property.address}
          onError={() =>
            setCardImage(
              '/static/images/placeholders/illustrations/unknown-house.png'
            )
          }
        />
        <CardContent sx={{ paddingBottom: 0 }}>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 1
            }}
          >
            {props.deal.property.address}
          </span>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            {/* <h4>{props.deal.property.address}</h4> */}
            <List
              disablePadding
              sx={{
                width: '100%'
              }}
            >
              <StyledListItem disableGutters>
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
                    {priceFormatter(props.deal.property.price)}
                  </Typography>
                </Box>
              </StyledListItem>

              <StyledListItem disableGutters>
                <ListItemAvatarWrapper>
                  <PriceChangeIcon color="success" />
                </ListItemAvatarWrapper>
                <ListItemText
                  primary="%⇩ARV"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" variant="h4" noWrap>
                    {showFixedValue(props.deal.profit)}
                  </Typography>
                </Box>
              </StyledListItem>

              <StyledListItem disableGutters>
                <ListItemAvatarWrapper>
                  <PriceCheckIcon color="success" />
                </ListItemAvatarWrapper>
                <ListItemText
                  primary="%⇩True-ARV"
                  primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    noWrap: true
                  }}
                />
                <Box>
                  <Typography align="right" variant="h4" noWrap>
                    {showFixedValue(props.deal.trueArv)}
                  </Typography>
                </Box>
              </StyledListItem>
              <StyledListItem disableGutters>
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
                    {props.deal.property.area}
                  </Typography>
                </Box>
              </StyledListItem>
            </List>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <Grid container justifyContent="center">
          <IconButton aria-label="add to favorites">
            <FavoriteOutlinedIcon />
          </IconButton>
          <IconButton
            aria-label="share"
            onClick={() => openGoogleSearch(props.deal.property.address)}
          >
            {/* <ShareIcon /> */}
            <LinkIcon />
          </IconButton>
          {/* <IconButton aria-label="share" onClick={handleLocationAction}>
            <LocationOnIcon />
          </IconButton> */}
        </Grid>
      </CardActions>
    </StyledCard>
  );
};

export default PropertyCard;
