import React, { memo, useEffect, useState } from 'react';
import PropertyPreview from '@/models/propertyPreview';
import { openGoogleSearch } from '@/utils/windowFunctions';
import {
  Button,
  CardProps,
  Chip,
  Grid,
  SvgIcon,
  Tooltip,
  Typography
} from '@mui/material';
import {
  numberStringUtil,
  percentFormatter,
  priceFormatter,
  validateValue
} from '@/utils/converters';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles.module.scss';
import Image from '@/components/Photos/Image';
import clsx from 'clsx';
import { selectFilter } from '@/store/slices/filterSlice';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const defaultImage =
  'https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=';

const BathIcon = () => {
  return (
    <SvgIcon>
      <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.875 5H9.75C9.75 4.90054 9.71049 4.80516 9.64017 4.73484C9.56984 4.66451 9.47446 4.625 9.375 4.625H6.375C6.27554 4.625 6.18016 4.66451 6.10983 4.73484C6.03951 4.80516 6 4.90054 6 5H3V2.9375C3 2.78832 3.05926 2.64524 3.16475 2.53975C3.27024 2.43426 3.41332 2.375 3.5625 2.375C3.71168 2.375 3.85476 2.43426 3.96025 2.53975C4.06574 2.64524 4.125 2.78832 4.125 2.9375C4.125 3.03696 4.16451 3.13234 4.23484 3.20266C4.30516 3.27299 4.40054 3.3125 4.5 3.3125C4.59946 3.3125 4.69484 3.27299 4.76516 3.20266C4.83549 3.13234 4.875 3.03696 4.875 2.9375C4.875 2.5894 4.73672 2.25556 4.49058 2.00942C4.24444 1.76328 3.9106 1.625 3.5625 1.625C3.2144 1.625 2.88056 1.76328 2.63442 2.00942C2.38828 2.25556 2.25 2.5894 2.25 2.9375V5H1.125C0.926088 5 0.735322 5.07902 0.59467 5.21967C0.454018 5.36032 0.375 5.55109 0.375 5.75V7.25C0.375 7.94619 0.651562 8.61387 1.14384 9.10616C1.63613 9.59844 2.30381 9.875 3 9.875V10.625C3 10.7245 3.03951 10.8198 3.10984 10.8902C3.18016 10.9605 3.27554 11 3.375 11C3.47446 11 3.56984 10.9605 3.64016 10.8902C3.71049 10.8198 3.75 10.7245 3.75 10.625V9.875H8.25V10.625C8.25 10.7245 8.28951 10.8198 8.35983 10.8902C8.43016 10.9605 8.52554 11 8.625 11C8.72446 11 8.81984 10.9605 8.89017 10.8902C8.96049 10.8198 9 10.7245 9 10.625V9.875C9.69619 9.875 10.3639 9.59844 10.8562 9.10616C11.3484 8.61387 11.625 7.94619 11.625 7.25V5.75C11.625 5.55109 11.546 5.36032 11.4053 5.21967C11.2647 5.07902 11.0739 5 10.875 5ZM9 5.375V6.875H6.75V5.375H9ZM10.875 7.25C10.875 7.49623 10.8265 7.74005 10.7323 7.96753C10.638 8.19502 10.4999 8.40172 10.3258 8.57583C10.1517 8.74994 9.94502 8.88805 9.71753 8.98227C9.49005 9.0765 9.24623 9.125 9 9.125H3C2.50272 9.125 2.02581 8.92746 1.67417 8.57583C1.32254 8.22419 1.125 7.74728 1.125 7.25V5.75H6V7.25C6 7.34946 6.03951 7.44484 6.10983 7.51517C6.18016 7.58549 6.27554 7.625 6.375 7.625H9.375C9.47446 7.625 9.56984 7.58549 9.64017 7.51517C9.71049 7.44484 9.75 7.34946 9.75 7.25V5.75H10.875V7.25Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

const SizeIcon = () => {
  return (
    <SvgIcon>
      <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 3.125C0 2.82663 0.118526 2.54048 0.329505 2.3295C0.540483 2.11853 0.826631 2 1.125 2H10.875C11.1734 2 11.4595 2.11853 11.6705 2.3295C11.8815 2.54048 12 2.82663 12 3.125V9.875C12 10.1734 11.8815 10.4595 11.6705 10.6705C11.4595 10.8815 11.1734 11 10.875 11H1.125C0.826631 11 0.540483 10.8815 0.329505 10.6705C0.118526 10.4595 0 10.1734 0 9.875L0 3.125ZM1.125 2.75C1.02554 2.75 0.930161 2.78951 0.859835 2.85984C0.789509 2.93016 0.75 3.02554 0.75 3.125V9.875C0.75 9.97446 0.789509 10.0698 0.859835 10.1402C0.930161 10.2105 1.02554 10.25 1.125 10.25H10.875C10.9745 10.25 11.0698 10.2105 11.1402 10.1402C11.2105 10.0698 11.25 9.97446 11.25 9.875V3.125C11.25 3.02554 11.2105 2.93016 11.1402 2.85984C11.0698 2.78951 10.9745 2.75 10.875 2.75H1.125Z"
          fill="currentColor"
        />
        <path
          d="M1.5 3.875C1.5 3.77554 1.53951 3.68016 1.60984 3.60984C1.68016 3.53951 1.77554 3.5 1.875 3.5H4.125C4.22446 3.5 4.31984 3.53951 4.39016 3.60984C4.46049 3.68016 4.5 3.77554 4.5 3.875C4.5 3.97446 4.46049 4.06984 4.39016 4.14016C4.31984 4.21049 4.22446 4.25 4.125 4.25H2.25V6.125C2.25 6.22446 2.21049 6.31984 2.14016 6.39016C2.06984 6.46049 1.97446 6.5 1.875 6.5C1.77554 6.5 1.68016 6.46049 1.60984 6.39016C1.53951 6.31984 1.5 6.22446 1.5 6.125V3.875ZM10.5 9.125C10.5 9.22446 10.4605 9.31984 10.3902 9.39017C10.3198 9.46049 10.2245 9.5 10.125 9.5H7.875C7.77554 9.5 7.68016 9.46049 7.60983 9.39017C7.53951 9.31984 7.5 9.22446 7.5 9.125C7.5 9.02554 7.53951 8.93016 7.60983 8.85983C7.68016 8.78951 7.77554 8.75 7.875 8.75H9.75V6.875C9.75 6.77554 9.78951 6.68016 9.85983 6.60983C9.93016 6.53951 10.0255 6.5 10.125 6.5C10.2245 6.5 10.3198 6.53951 10.3902 6.60983C10.4605 6.68016 10.5 6.77554 10.5 6.875V9.125Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

const BedIcon = () => {
  return (
    <SvgIcon>
      <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.375 2.5H8.625C8.97514 2.49998 9.3121 2.63355 9.56715 2.87345C9.82219 3.11335 9.97611 3.44151 9.9975 3.791L10 3.875V5.552C10.2725 5.62937 10.5146 5.78898 10.693 6.00903C10.8714 6.22908 10.9776 6.49885 10.997 6.7815L11 6.875V10.625C11 10.72 10.9639 10.8115 10.899 10.8809C10.8341 10.9503 10.7454 10.9925 10.6506 10.999C10.5558 11.0055 10.4621 10.9757 10.3884 10.9158C10.3146 10.8558 10.2665 10.7701 10.2535 10.676L10.25 10.625V9.5H1.75V10.625C1.75 10.7156 1.71718 10.8032 1.65762 10.8715C1.59805 10.9398 1.51578 10.9842 1.426 10.9965L1.375 11C1.28438 11 1.19683 10.9672 1.12853 10.9076C1.06024 10.8481 1.01582 10.7658 1.0035 10.676L1 10.625V6.875C1 6.2455 1.423 5.715 2 5.5515V3.875C1.99998 3.52486 2.13355 3.1879 2.37345 2.93285C2.61335 2.67781 2.94151 2.52389 3.291 2.5025L3.375 2.5ZM9.625 6.25H2.375C2.22027 6.24993 2.07102 6.30726 1.95612 6.41089C1.84122 6.51452 1.76884 6.65708 1.753 6.811L1.75 6.875V8.75H10.25V6.875C10.2499 6.72036 10.1926 6.57122 10.0889 6.45643C9.98533 6.34164 9.84283 6.26934 9.689 6.2535L9.625 6.25ZM8.625 3.25H3.375C3.22027 3.24993 3.07102 3.30726 2.95612 3.41089C2.84122 3.51452 2.76884 3.65708 2.753 3.811L2.75 3.875V5.5H3.5C3.5 5.36739 3.55268 5.24021 3.64645 5.14645C3.74021 5.05268 3.86739 5 4 5H5C5.12247 5.00002 5.24067 5.04498 5.33219 5.12636C5.4237 5.20774 5.48217 5.31987 5.4965 5.4415L5.5 5.5H6.5C6.5 5.36739 6.55268 5.24021 6.64645 5.14645C6.74021 5.05268 6.86739 5 7 5H8C8.12247 5.00002 8.24067 5.04498 8.33219 5.12636C8.4237 5.20774 8.48217 5.31987 8.4965 5.4415L8.5 5.5H9.25V3.875C9.25007 3.72027 9.19274 3.57102 9.08911 3.45612C8.98548 3.34122 8.84292 3.26884 8.689 3.253L8.625 3.25Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
};

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
  props: PropertyCardProps
) => {
  const dispatch = useDispatch();
  const [cardImage, setCardImage] = useState(
    validateValue(props.property?.image, 'string', defaultImage)
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
    setCardImage(validateValue(props.property?.image, 'string', defaultImage));
    // console.log("rerender property card");
  }, [props.property]);

  const arvPercentage =
    props.property?.arv25Price && props.property.arv25Price > 0
      ? (Math.round(props.property.arv25Price - props.property.price) /
          props.property.arv25Price) *
        100
      : 0;

  const compsPercentage =
    props.property?.arvPrice && props.property.arvPrice > 0
      ? (Math.round(props.property.arvPrice - props.property.price) /
          props.property.arvPrice) *
        100
      : 0;

  // const profit = arvPercentage.toFixed(100);
  const profit = 3;

  const getStrategyValue = () => {
    switch (strategyMode) {
      case 'ARV':
        return arvPercentage;
      case 'Comps':
        return compsPercentage;
      default:
        return 0;
    }
  };

  const handleClickAddress = (e) => {
    e.stopPropagation();
    openGoogleSearch(props.property.address);
  };

  return (
    <Button
      className={clsx([
        'w-full h-full flex flex-col p-0 rounded-xl relative shadow-lg',
        props.selected && 'ring ring-black'
      ])}
      onClick={handlePropertySelected}
      // onMouseOver={() => props.setHoveredProperty(props.property)}
    >
      {typeof props.property.arv25Price === 'number' && (
        <Tooltip
          title={`Under ${strategyMode} by ${getStrategyValue().toFixed(2)}%`}
          placement="top"
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10]
                }
              }
            ]
          }}
        >
          <div
            className={clsx([
              'flex absolute top-1 left-1 z-[1] rounded-lg px-2 py-0.5 items-center',
              strategyMode === 'ARV' ? 'bg-arv' : 'bg-secondary'
            ])}
          >
            <ArrowCircleDownIcon className="text-white text-[1rem]" />
            <Typography className="font-poppins font-semibold text-white">
              {getStrategyValue().toFixed()}%
            </Typography>
          </div>
        </Tooltip>
      )}
      <div className="flex w-full h-1/3 md:h-1/3 rounded-t-x">
        <Image
          src={validateValue(cardImage, 'string', '')}
          alt=""
          defaultSrc={defaultImage}
          className="w-full h-full rounded-t-xl object-cover object-center aspect-[2] sm:aspect-[5/2] md:aspect-[auto]"
        />
      </div>
      <div className="flex flex-col h-2/3 md:h-2/3  w-full px-4 pb-2 pt-2 md:pt-0 gap-y-2 md:gap-y-0">
        <Chip
          label={props.property?.address}
          clickable
          size="small"
          className=" my-2 h-5 hidden  md:flex"
          onClick={handleClickAddress}
        />
        <div className="w-full flex flex-col md:hidden">
          <div className="font-poppins text-2xl text-secondary font-[900] text-left">
            {priceFormatter(props.property?.price)}
          </div>
          <div className="mt-2">
            <Typography className="font-poppins text-[1rem] text-gray-800 text-left">
              {props.property?.address}
            </Typography>
          </div>
          <div className="grid grid-cols-[auto_1fr] mt-2 gap-x-6">
            <Typography className="text-black text-lg    font-poppins">
              Sales Comps:
            </Typography>
            <Typography className="text-black text-lg  text-left font-poppins">
              {priceFormatter(props.property?.arvPrice)}
            </Typography>

            <Typography className="text-left text-black text-lg  font-poppins">
              ARV:
            </Typography>
            <Typography className="text-black text-lg  text-left font-poppins">
              {priceFormatter(props.property?.arv25Price)}
            </Typography>

            <Typography className="text-left text-black text-lg  font-poppins">
              Cap Rate:
            </Typography>
            <Typography className="text-black text-lg  text-left font-poppins">
              {numberStringUtil(props.property?.cap_rate).toFixed(2)} %
            </Typography>
          </div>
          <div className="w-full flex justify-center gap-x-6 xs:gap-x-12 mt-2">
            <div className="flex text-gray-500 items-center">
              <BedIcon />
              <Typography className="text-gray-500">
                {props.property?.beds} Beds
              </Typography>
            </div>

            <div className="flex gap-x-2 text-gray-500 items-center">
              {/* <BathtubIcon className="text-gray-500" /> */}
              <BathIcon />
              <Typography className="text-gray-500">
                {props.property?.baths} Baths
              </Typography>
            </div>
            <div className="flex text-gray-500 items-center gap-x-2">
              {/* <AspectRatioIcon className="text-gray-500" /> */}
              <SizeIcon />
              <Typography className="text-gray-500">
                {props.property?.area} Sqft
              </Typography>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col">
          <div className={styles.cardInfoRow}>
            <Typography>Price</Typography>
            <Typography>{priceFormatter(props.property?.price)}</Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>Comps Sale</Typography>
            <Typography>{priceFormatter(props.property?.arvPrice)}</Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>ARV</Typography>
            <Typography>
              {priceFormatter(props.property?.arv25Price)}
            </Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>Cap Rate</Typography>
            <Typography>
              {numberStringUtil(props.property?.cap_rate).toFixed(2)} %
            </Typography>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default memo(PropertyCard);
