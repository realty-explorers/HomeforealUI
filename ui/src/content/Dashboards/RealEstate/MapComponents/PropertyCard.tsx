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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
import { useDispatch } from 'react-redux';
import IconListItem from '../DetailsPanel/IconListItem';
import IconSwitch from '../FormFields/IconSwitch';
import styles from './styles.module.scss';
import { setSelectedDeal } from '@/store/slices/propertiesSlice';
interface StyledCardProps extends CardProps {
  selected?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<StyledCardProps>(({ selected, theme }) => ({
  ...(selected && {
    boxShadow:
      // '0px 0px 30px rgba(0, 24, 255, 0.8),0px 2px 20px rgba(159, 162, 191, 0.7)'
      ' rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px'
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
  className?: string;
};
const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps
) => {
  const dispatch = useDispatch();
  const [cardImage, setCardImage] = useState(props.deal.property.primaryImage);
  const handleDealSelected = () => {
    if (props.selectedDeal === props.deal) {
      dispatch(setSelectedDeal(null));
      props.setSelectedDeal(null);
    } else {
      props.setSelectedDeal(props.deal);
      dispatch(setSelectedDeal(props.deal));
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
      className={props.className}
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
        <Grid className={styles.cardDiscountChip} container>
          <Grid item xs={12}>
            <Typography className={styles.cardDiscountValue}>
              {props.deal.profit.toFixed(0)}%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={styles.cardDiscountText}>
              Under ARV
            </Typography>
          </Grid>
        </Grid>
        {/* <Chip label="25%" size="small" className={styles.cardDiscountChip} /> */}

        <IconButton
          aria-label="add to favorites"
          className={styles.cardSaveIcon}
          onClick={(e) => {
            alert('hi');
            e.stopPropagation();
          }}
          sx={{ padding: 0 }}
        >
          <FavoriteOutlinedIcon sx={{ color: 'white' }} />
        </IconButton>
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
                icon={<PriceChangeIcon color="success" />}
                title="Comps Sold"
                value={priceFormatter(props.deal.property.price)}
              />

              <IconListItem
                icon={<InsightsIcon color="inherit" />}
                title={'ARV'}
                value={priceFormatter(`${props.deal.estimatedArv?.toFixed(0)}`)}
              />

              <IconListItem
                icon={<BarChartIcon color="primary" />}
                title={'Rent/Cap Rate'}
                value={priceFormatter(`${props.deal.estimatedArv?.toFixed(0)}`)}
              />
            </List>
          </Grid>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default PropertyCard;
