import React, { memo, useEffect, useState } from 'react';
import PropertyPreview from '@/models/propertyPreview';
import { openGoogleSearch } from '@/utils/windowFunctions';
import { usePropertyOffers } from '@/utils/offerUtils';
import {
  numberStringUtil,
  percentFormatter,
  priceFormatter,
  validateValue
} from '@/utils/converters';
import { useSelector } from 'react-redux';
import Image from '@/components/Photos/Image';
import { selectFilter } from '@/store/slices/filterSlice';
import { calculateArvPercentage } from '@/utils/calculationUtils';
import {
  ArrowDown,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ClipboardCheck,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultImage =
  '/static/images/placeholders/covers/house_placeholder.jpg';

type PropertyCardProps = {
  property: PropertyPreview;
  selectProperty: (property: PropertyPreview) => void;
  deselectProperty: (property: PropertyPreview) => void;
  setOpenMoreDetails: (open: boolean) => void;
  selected: boolean;
  className?: string;
};

const PropertyCard: React.FC<PropertyCardProps> = (
  props: PropertyCardProps
) => {
  const { property, selected, selectProperty, deselectProperty } = props;
  const [cardImage, setCardImage] = useState(
    validateValue(property?.image, 'string', defaultImage)
  );
  const { strategyMode } = useSelector(selectFilter);
  const { hasOffer } = usePropertyOffers();

  useEffect(() => {
    setCardImage(validateValue(property?.image, 'string', defaultImage));
  }, [property]);

  const handleClick = () => {
    if (selected) {
      deselectProperty(property);
    } else {
      selectProperty(property);
    }
  };

  const handleClickAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    openGoogleSearch(property.address);
  };

  const getStrategyPercent = (digits: number) => {
    const arvPct = property?.masked
      ? `up to ${calculateArvPercentage(
          property.arv25Price,
          property?.priceGroup?.min
        ).toFixed(digits)}`
      : `${calculateArvPercentage(
          property.arv25Price,
          property.price
        ).toFixed(digits)}`;

    const compsPct = property?.masked
      ? `up to ${calculateArvPercentage(
          property.arvPrice,
          property?.priceGroup?.min
        ).toFixed(digits)}`
      : `${calculateArvPercentage(
          property.arvPrice,
          property.price
        ).toFixed(digits)}`;

    switch (strategyMode) {
      case 'ARV':
        return arvPct;
      case 'Comps':
        return compsPct;
      default:
        return '0';
    }
  };

  const priceDisplay =
    property?.price !== undefined
      ? priceFormatter(property?.price)
      : property?.priceGroup
      ? `${priceFormatter(property.priceGroup.min)} – ${priceFormatter(
          property.priceGroup.max
        )}`
      : '—';

  const hasStrategyBadge = typeof property.arv25Price === 'number';
  const hasOfferBadge = hasOffer(property.propertyId);

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        hasStrategyBadge
          ? `Under ${strategyMode} by ${getStrategyPercent(2)}%`
          : undefined
      }
      className={cn(
        'group/card relative flex flex-col w-full h-full overflow-hidden rounded-xl text-left',
        'bg-white border border-slate-200 shadow-sm',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300',
        selected && 'ring-2 ring-black border-black'
      )}
    >
      {/* Image */}
      <div className="relative w-full h-1/3 md:h-[38%] shrink-0 overflow-hidden">
        <Image
          src={validateValue(cardImage, 'string', '')}
          alt={property?.address || 'Property'}
          defaultSrc={defaultImage}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
        />

        {/* Strategy badge — top-left */}
        {hasStrategyBadge && (
          <div
            className={cn(
              'absolute top-2 left-2 z-[1] inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5',
              'font-poppins font-semibold text-white text-xs shadow-md backdrop-blur-sm',
              strategyMode === 'ARV' ? 'bg-arv/95' : 'bg-secondary/95'
            )}
          >
            <ArrowDown className="size-3" />
            <span className="tabular-nums">{getStrategyPercent(0)}%</span>
          </div>
        )}

        {/* Offer indicator — top-right */}
        {hasOfferBadge && (
          <div
            title="You have an offer for this property"
            className="absolute top-2 right-2 z-[1] inline-flex items-center justify-center size-6 rounded-full bg-amber-500 shadow-md ring-2 ring-white"
          >
            <ClipboardCheck className="size-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 w-full px-3 py-2 gap-1.5 min-h-0">
        {/* Price + address */}
        <div className="flex flex-col gap-0.5">
          <div className="font-poppins font-bold text-lg md:text-base text-slate-900 leading-tight tabular-nums truncate">
            {priceDisplay}
          </div>
          <button
            type="button"
            onClick={handleClickAddress}
            className="inline-flex items-start gap-1 text-left text-xs font-poppins text-slate-500 hover:text-slate-700 leading-tight"
          >
            <MapPin className="size-3 mt-0.5 shrink-0 text-slate-400" />
            <span className="truncate">{property?.address}</span>
          </button>
        </div>

        {/* Compact value rows: Comps / ARV / Cap */}
        <div className="flex flex-col gap-0.5 mt-0.5">
          <ValueRow
            label="Comps"
            value={priceFormatter(property?.arvPrice)}
            accent="text-secondary"
          />
          <ValueRow
            label="25th ARV"
            value={priceFormatter(property?.arv25Price)}
            accent="text-arv"
          />
          <ValueRow
            label="Cap"
            value={`${numberStringUtil(property?.cap_rate).toFixed(2)}%`}
            accent="text-slate-700"
          />
        </div>

        {/* Stat icons row */}
        <div className="flex items-center gap-3 mt-auto pt-1 border-t border-slate-100">
          <Stat icon={Bed} value={property?.beds} unit="bd" />
          <Stat icon={Bath} value={property?.baths} unit="ba" />
          <Stat icon={Maximize2} value={property?.area} unit="sqft" />
        </div>
      </div>
    </button>
  );
};

const ValueRow = ({
  label,
  value,
  accent
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}) => (
  <div className="flex items-center justify-between gap-2 text-xs">
    <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-slate-400">
      {label}
    </span>
    <span
      className={cn(
        'font-poppins font-bold tabular-nums truncate',
        accent || 'text-slate-700'
      )}
    >
      {value}
    </span>
  </div>
);

const Stat = ({
  icon: Icon,
  value,
  unit
}: {
  icon: LucideIcon;
  value: React.ReactNode;
  unit: string;
}) => (
  <div className="inline-flex items-center gap-1 text-[0.7rem] text-slate-500 font-medium">
    <Icon className="size-3 text-slate-400" />
    <span className="tabular-nums text-slate-700 font-semibold">
      {value ?? '—'}
    </span>
    <span className="text-slate-400">{unit}</span>
  </div>
);

export default memo(PropertyCard);
