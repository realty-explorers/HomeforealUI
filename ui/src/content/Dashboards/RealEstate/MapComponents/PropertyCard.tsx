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
  withStyles
} from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandIcon from '@mui/icons-material/Expand';
import BarChartIcon from '@mui/icons-material/BarChart';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { percentFormatter, priceFormatter } from '@/utils/converters';
import { setSearchAnalyzedProperty } from '@/store/searchSlice';
import { useDispatch } from 'react-redux';
import IconListItem from '../DetailsPanel/IconListItem';
import IconSwitch from '../FormFields/IconSwitch';
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
  // height: '19rem',
  // flexShrink: 0,
  margin: '0 0.5rem',
  pointerEvents: 'all'
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

const StyledTooltip = styled(Tooltip)({
  margin: '4px',
  tooltipPlacementRight: {
    margin: '4px'
  }
});

type PropertyCardProps = {
  deal: Deal;
  setSelectedDeal: (deal: Deal) => void;
  setOpenMoreDetails: (open: boolean) => void;
  selectedDeal: Deal;
  trueArv: boolean;
  setTrueArv: (trueArv: boolean) => void;
};
const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps
) => {
  const dispatch = useDispatch();
  const [cardImage, setCardImage] = useState(props.deal.property.primaryImage);
  const handleDealSelected = () => {
    if (props.selectedDeal === props.deal) {
      dispatch(setSearchAnalyzedProperty(null));
      props.setSelectedDeal(null);
    } else {
      props.setSelectedDeal(props.deal);
      dispatch(setSearchAnalyzedProperty(props.deal.property));
    }
  };

  const handleOpenDetails = () => {
    // props.setSelectedDeal(props.deal);
    // dispatch(setSearchAnalyzedProperty(props.deal.property));
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
        <CardContent sx={{ paddingBottom: 0, paddingTop: '0em' }}>
          {/* <AddressLink>{props.deal.property.address}</AddressLink> */}
          <Grid
            container
            justifyContent={'center'}
            sx={{ margin: '0.5rem 0 0.2rem 0' }}
          >
            <Chip
              label={props.deal.property.address}
              clickable
              size="small"
              onClick={() => openGoogleSearch(props.deal.property.address)}
            />
          </Grid>
          <Grid xs={12} sm={12} item display="flex" alignItems="center">
            {/* <h4>{props.deal.property.address}</h4> */}
            <List
              disablePadding
              sx={{
                width: '100%'
              }}
            >
              <IconListItem
                icon={<LocalOfferIcon color="warning" />}
                title="Price"
                value={priceFormatter(props.deal.property.price)}
              />

              <IconListItem
                icon={<InsightsIcon color="inherit" />}
                title={'≈ ARV'}
                value={priceFormatter(`${props.deal.estimatedArv?.toFixed(0)}`)}
              />

              <IconListItem
                icon={<PriceChangeIcon color="success" />}
                title="%⇩ARV"
                value={showFixedValue(props.deal.profit)}
              />

              <IconListItem
                icon={<PriceCheckIcon color="success" />}
                title="%⇩True-ARV"
                value={showFixedValue(props.deal.trueArv)}
              />

              <IconListItem
                icon={<ExpandIcon color="primary" />}
                title="Sqft"
                value={props.deal.property.area}
              />
            </List>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing sx={{ padding: 0 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <IconButton aria-label="add to favorites">
              <FavoriteOutlinedIcon />
            </IconButton>

            <IconButton aria-label="share" onClick={handleOpenDetails}>
              <ImportContactsIcon />
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            {props.selectedDeal &&
              props.selectedDeal.property.id === props.deal.property.id && (
                <StyledTooltip title="Toggle True-ARV" placement="right">
                  <Switch
                    checked={props.trueArv}
                    onChange={() => props.setTrueArv(!props.trueArv)}
                  />
                </StyledTooltip>
              )}
          </Grid>
          {/* <IconButton aria-label="share" onClick={handleLocationAction}>
            <LocationOnIcon />
          </IconButton> */}
        </Grid>
      </CardActions>
    </StyledCard>
  );
};

export default PropertyCard;
