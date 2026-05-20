import React, { memo, useEffect, useRef, useState } from 'react';
import { IconButton } from '@mui/material';
import PropertyPreview from '@/models/propertyPreview';
import PropertyCard from './PropertyCard';
import MultifamilyDealCard from './MultifamilyDealCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSelector } from 'react-redux';
import {
  selectBuybox,
  selectFilteredProperties,
  selectStrategyMode
} from '@/store/slices/filterSlice';
import {
  selectSelectedProperty,
  selectSelectedPropertyPreview
} from '@/store/slices/propertiesSlice';
import useProperty from '@/hooks/useProperty';

type CardsPanelProps = {
  open: boolean;
};

const CardsPanel: React.FC<CardsPanelProps> = ({ open }: CardsPanelProps) => {
  const [cardsOpen, setCardsOpen] = useState(false);
  const listRef = useRef();
  // const scrollRef = useHorizontalScroll();
  // const [listRef] = useHookWithRefCallback();
  const [ref, setRef] = useState<Element | undefined>();

  const filteredProperties = useSelector(selectFilteredProperties);
  const strategyMode = useSelector(selectStrategyMode);
  const buybox = useSelector(selectBuybox);
  const isMultifamilyBuybox =
    buybox?.parameters?.strategy?.strategyType === 'MULTIFAMILY';

  const selectedProperty = useSelector(selectSelectedProperty);
  const selectedPropertyPreview = useSelector(selectSelectedPropertyPreview);
  const [selectedPropertyIndex, setSelectedIndex] = useState(-1);
  const { selectProperty, deselectProperty } = useProperty();

  const scrollLeft = () => {
    const element = document.querySelector('#list-container > div > div') as HTMLElement | null;
    if (!element) return;
    const width = element.scrollLeft - element.offsetWidth;
    element.scrollTo({
      left: width,
      behavior: 'smooth'
    });
  };
  //
  const scrollRight = () => {
    const element = document.querySelector('#list-container > div > div') as HTMLElement | null;
    if (!element) return;
    const width = element.scrollLeft + element.offsetWidth;
    element.scrollTo({
      left: width,
      behavior: 'smooth'
    });
  };

  const getPropertyPrice = (property: PropertyPreview) => {
    if (property.price !== undefined) {
      return property.price;
    }
    return property.priceGroup?.min ?? 0;
  };

  const getStrategyPercentage = (property: PropertyPreview) => {
    const fieldName = strategyMode === 'ARV' ? 'arv25Price' : 'arvPrice';
    const strategyValue = Number(property[fieldName]);
    const propertyPrice = getPropertyPrice(property);

    if (!Number.isFinite(strategyValue) || strategyValue <= 0 || propertyPrice <= 0) {
      return Number.NEGATIVE_INFINITY;
    }

    return ((strategyValue - propertyPrice) / strategyValue) * 100;
  };

  const getCapRate = (property: PropertyPreview) => {
    const capRate = Number(property.cap_rate);
    if (Number.isFinite(capRate) && capRate >= 0) {
      return capRate;
    }
    return Number.NEGATIVE_INFINITY;
  };

  const sortedProperties =
    filteredProperties &&
    [...filteredProperties].sort((a, b) => {
      if (isMultifamilyBuybox) {
        return getCapRate(b) - getCapRate(a);
      }

      const strategyPercentageA = getStrategyPercentage(a);
      const strategyPercentageB = getStrategyPercentage(b);

      return strategyPercentageB - strategyPercentageA;
    });

  const handleSelectProperty = (property?: PropertyPreview) => {
    selectProperty(property);
  };

  const handleDeselectProperty = () => {
    deselectProperty();
  };

  const [notSelected, setNotSelected] = useState(true);

  useEffect(() => {
    // console.log("rerender cards panel");
    if (selectedPropertyPreview) {
      const selectedPropertyIndex = filteredProperties?.findIndex(
        (property) => property.id === selectedPropertyPreview.id
      );
      setSelectedIndex(selectedPropertyIndex);
      if (notSelected) {
        setCardsOpen(false);
      }
      setNotSelected(false);
    } else {
      setNotSelected(true);
      setCardsOpen(true);
    }
  }, [filteredProperties, selectedPropertyPreview]);

  useEffect(() => {
    if (!listRef.current) {
      const element = document.querySelector('#list-container > div > div');
      if (element) {
        setRef(element);
        const onwheel = (e) => {
          console.log('wheel');
          if (e.deltaY == 0) return;
          element?.scrollTo({
            left: element?.scrollLeft + e.deltaY
          });
        };
        element.addEventListener('wheel', onwheel);
        return () => element?.removeEventListener('wheel', onwheel);
      }
    }
  }, [filteredProperties]);

  let cardsCache = {};

  const Column = ({ index, style }) => {
    const CardComponent = isMultifamilyBuybox
      ? MultifamilyDealCard
      : PropertyCard;

    return (
      <div style={{ ...style }} className="px-2 py-2">
        <div className="w-full h-full rounded-xl bg-white">
          <CardComponent
            key={index}
            property={sortedProperties[index]}
            selected={
              selectedPropertyPreview?.id === sortedProperties[index].id
            }
            selectProperty={(property) => handleSelectProperty(property)}
            deselectProperty={() => handleDeselectProperty()}
            setOpenMoreDetails={() => {}}
            strategy={isMultifamilyBuybox ? buybox?.parameters?.strategy : undefined}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div
        id="cards_panel"
        className={clsx([
          'absolute bottom-0 w-full h-52 transition-[margin] duration-300 hidden md:flex',
          !cardsOpen && '-mb-44'
        ])}
      >
        <div className={clsx(['relative flex w-full h-full group'])}>
          {filteredProperties?.length > 0 && (
            <IconButton
              className="absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 bg-white w-12 h-4 border border-black"
              style={{ border: '1px dashed black' }}
              onClick={() => setCardsOpen(!cardsOpen)}
            >
              <ExpandMoreIcon
                className={clsx([
                  'transition-all',
                  cardsOpen ? '' : 'rotate-180'
                ])}
              />
            </IconButton>
          )}

          <IconButton
            onClick={scrollLeft}
            className="opacity-0 group-hover:opacity-100 absolute left-4 top-0 translate-y-[150%] bg-white hover:bg-gray-300 transition-all rounded-[50%] z-[1]"
            style={{ boxShadow: '0px 0px 5px rgba(0,0,0,0.75)' }}
          >
            <ExpandMoreIcon className={clsx(['transition-all rotate-90'])} />
            {/* <ArrowCircleLeftSharpIcon /> */}
          </IconButton>
          <div className="w-full h-full" id="list-container">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  // ref={listRef}
                  className="List"
                  height={height}
                  itemCount={filteredProperties?.length ?? 0}
                  itemSize={230}
                  layout="horizontal"
                  width={width}
                >
                  {Column}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>

          <IconButton
            onClick={scrollRight}
            className="opacity-0 group-hover:opacity-100 absolute right-4 top-0 translate-y-[150%] bg-white hover:bg-gray-300 transition-all rounded-[50%] z-[1] "
            style={{ boxShadow: '0px 0px 5px rgba(0,0,0,0.75)' }}
          >
            {/* <ArrowCircleRightSharpIcon /> */}

            <ExpandMoreIcon className={clsx(['transition-all -rotate-90'])} />
          </IconButton>
        </div>
      </div>
      {/* <MobilePanel sortedProperties={sortedProperties} /> */}
    </div>
  );
};

export default memo(CardsPanel);
