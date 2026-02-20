import React, { memo, useEffect, useMemo, useState } from 'react';
import PropertyPreview from '@/models/propertyPreview';
import { openGoogleSearch } from '@/utils/windowFunctions';
import { Button, Chip, Typography } from '@mui/material';
import {
  currencyFormatter,
  numberFormatter,
  priceFormatter,
  validateValue
} from '@/utils/converters';
import Image from '@/components/Photos/Image';
import clsx from 'clsx';
import styles from '../styles.module.scss';

const defaultImage =
  'https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=';

type MultifamilyDealCardProps = {
  property: PropertyPreview;
  selectProperty: (property: PropertyPreview) => void;
  deselectProperty: (property: PropertyPreview) => void;
  setOpenMoreDetails: (open: boolean) => void;
  selected: boolean;
  className?: string;
};

const getPrice = (property: PropertyPreview) => {
  if (property.price !== undefined) {
    return property.price;
  }
  return property.priceGroup?.min ?? 0;
};

const getPriceLabel = (property: PropertyPreview) => {
  if (property.price !== undefined) {
    return priceFormatter(property.price);
  }

  if (property.priceGroup) {
    return `${priceFormatter(property.priceGroup.min)} - ${priceFormatter(
      property.priceGroup.max
    )}`;
  }

  return priceFormatter(0);
};

const getUnitsCount = (property: PropertyPreview) => {
  const dynamicProperty = property as PropertyPreview & Record<string, unknown>;
  const unitFields = [
    dynamicProperty.units,
    dynamicProperty.unitCount,
    dynamicProperty.unitsCount,
    dynamicProperty.totalUnits,
    dynamicProperty.numberOfUnits,
    dynamicProperty.number_of_units
  ];

  for (const rawValue of unitFields) {
    const units = Number(rawValue);
    if (Number.isFinite(units) && units > 0) {
      return units;
    }
  }

  return undefined;
};

const getCapRate = (property: PropertyPreview) => {
  const capRate = Number(property.cap_rate);
  if (Number.isFinite(capRate) && capRate >= 0) {
    return capRate;
  }
  return undefined;
};

const MultifamilyDealCard: React.FC<MultifamilyDealCardProps> = (
  props: MultifamilyDealCardProps
) => {
  const [cardImage, setCardImage] = useState(
    validateValue(props.property?.image, 'string', defaultImage)
  );

  const unitsCount = useMemo(() => getUnitsCount(props.property), [props.property]);
  const capRate = useMemo(() => getCapRate(props.property), [props.property]);

  const pricePerUnit = useMemo(() => {
    const price = getPrice(props.property);
    if (!unitsCount || price <= 0) {
      return undefined;
    }
    return Math.round(price / unitsCount);
  }, [props.property, unitsCount]);

  const handlePropertySelected = async () => {
    if (props.selected) {
      props.deselectProperty(props.property);
    } else {
      props.selectProperty(props.property);
    }
  };

  const handleClickAddress = (e) => {
    e.stopPropagation();
    openGoogleSearch(props.property.address);
  };

  useEffect(() => {
    setCardImage(validateValue(props.property?.image, 'string', defaultImage));
  }, [props.property]);

  return (
    <Button
      className={clsx([
        'w-full h-full flex flex-col p-0 rounded-xl relative shadow-lg',
        props.selected && 'ring ring-black'
      ])}
      onClick={handlePropertySelected}
    >
      <div className="absolute top-1 left-1 z-[1] rounded-lg bg-emerald-600 px-2 py-0.5">
        <Typography className="font-poppins font-semibold text-white text-xs">
          Multifamily
        </Typography>
      </div>

      <div className="absolute top-1 right-1 z-[1] rounded-lg bg-black/70 px-2 py-0.5">
        <Typography className="font-poppins font-semibold text-white text-xs">
          {capRate !== undefined ? `${capRate.toFixed(1)}% Cap` : 'Cap N/A'}
        </Typography>
      </div>

      <div className="flex w-full h-1/3 md:h-1/3 rounded-t-x">
        <Image
          src={validateValue(cardImage, 'string', '')}
          alt=""
          defaultSrc={defaultImage}
          className="w-full h-full rounded-t-xl object-cover object-center aspect-[2] sm:aspect-[5/2] md:aspect-[auto]"
        />
      </div>

      <div className="flex flex-col h-2/3 md:h-2/3 w-full px-4 pb-2 pt-2 md:pt-0 gap-y-2 md:gap-y-0">
        <Chip
          label={props.property?.address}
          clickable
          size="small"
          className="my-2 h-5 hidden md:flex"
          onClick={handleClickAddress}
        />

        <div className="w-full flex flex-col md:hidden">
          <div className="font-poppins text-2xl text-secondary font-[900] text-left">
            {getPriceLabel(props.property)}
          </div>

          <div className="mt-2">
            <Typography className="font-poppins text-[1rem] text-gray-800 text-left">
              {props.property?.address}
            </Typography>
          </div>

          <div className="grid grid-cols-[auto_1fr] mt-2 gap-x-6">
            <Typography className="text-left text-black text-lg font-poppins">
              Units:
            </Typography>
            <Typography className="text-black text-lg text-left font-poppins">
              {unitsCount ? numberFormatter(unitsCount) : 'N/A'}
            </Typography>

            <Typography className="text-left text-black text-lg font-poppins">
              Price / Unit:
            </Typography>
            <Typography className="text-black text-lg text-left font-poppins">
              {pricePerUnit ? currencyFormatter(pricePerUnit) : 'N/A'}
            </Typography>

            <Typography className="text-left text-black text-lg font-poppins">
              Cap Rate:
            </Typography>
            <Typography className="text-black text-lg text-left font-poppins">
              {capRate !== undefined ? `${capRate.toFixed(2)} %` : 'N/A'}
            </Typography>
          </div>
        </div>

        <div className="hidden md:flex flex-col">
          <div className={styles.cardInfoRow}>
            <Typography>Price</Typography>
            <Typography>{getPriceLabel(props.property)}</Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>Units</Typography>
            <Typography>
              {unitsCount ? numberFormatter(unitsCount) : 'N/A'}
            </Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>Price / Unit</Typography>
            <Typography>
              {pricePerUnit ? currencyFormatter(pricePerUnit) : 'N/A'}
            </Typography>
          </div>
          <div className={styles.cardInfoRow}>
            <Typography>Cap Rate</Typography>
            <Typography>
              {capRate !== undefined ? `${capRate.toFixed(2)} %` : 'N/A'}
            </Typography>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default memo(MultifamilyDealCard);
