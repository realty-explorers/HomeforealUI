import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { CompData } from '@/models/analyzedProperty';
import { priceFormatter } from '@/utils/converters';
import { cn } from '@/lib/utils';

const DEFAULT_IMAGE =
  '/static/images/placeholders/covers/house_placeholder.jpg';

const SIMILARITY: Record<string, { label: string; classes: string }> = {
  red: {
    label: 'Very Low',
    classes: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  orange: {
    label: 'Low',
    classes: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  yellow: {
    label: 'Medium',
    classes: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  green: {
    label: 'High',
    classes: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }
};

const buildRows = (property: CompData) => [
  { label: 'Asking', value: priceFormatter(property.price) },
  { label: 'Beds', value: property.beds },
  { label: 'Baths', value: property.baths },
  { label: 'Lot Sqft', value: property.lotArea?.toLocaleString() },
  { label: 'Building Sqft', value: property.area?.toLocaleString() },
  { label: 'Floors', value: property.floors },
  { label: 'Garages', value: property.garages },
  {
    label: 'Year Built',
    value:
      typeof property.yearBuilt === 'string'
        ? property.yearBuilt.slice(0, 4)
        : property.yearBuilt
  },
  { label: 'Location', value: property.location?.neighborhood },
  {
    label: 'Price / Sqft',
    value:
      property.area && property.area > 0
        ? priceFormatter((property.price / property.area).toFixed())
        : '—'
  }
];

type CompsCardProps = {
  index: number;
  compsProperty: CompData;
  selected: boolean;
  toggle: () => void;
  className?: string;
};

const CompsCard = ({
  index,
  compsProperty,
  selected,
  toggle
}: CompsCardProps) => {
  const [cardImage, setCardImage] = useState(
    compsProperty.photos?.primary || DEFAULT_IMAGE
  );

  useEffect(() => {
    setCardImage(compsProperty.photos?.primary || DEFAULT_IMAGE);
  }, [compsProperty.photos?.primary]);

  const sim = SIMILARITY[compsProperty.similarityColor];
  const rows = buildRows(compsProperty);

  return (
    <Card className="w-[22.5rem] shrink-0 overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* Header — same height as PropertyCard header */}
      <div className="flex items-center gap-2 px-3 h-12 border-b border-slate-100">
        <Checkbox
          checked={selected}
          onCheckedChange={toggle}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        />
        <span className="font-poppins font-bold text-sm text-slate-900">
          Comp {index + 1}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {sim && (
            <Badge
              variant="outline"
              className={cn(
                'text-[0.6rem] px-1.5 py-0 font-poppins font-semibold',
                sim.classes
              )}
            >
              {sim.label}
            </Badge>
          )}
          {compsProperty.isArv25 && (
            <Badge
              className="text-[0.6rem] px-1.5 py-0 bg-arv text-white border-transparent hover:bg-arv font-poppins font-semibold"
              title="Included in 25th ARV calculation"
            >
              25th ARV
            </Badge>
          )}
        </div>
      </div>

      {/* Photo */}
      <img
        src={cardImage}
        alt={compsProperty.location?.address || 'Property'}
        onError={() => setCardImage(DEFAULT_IMAGE)}
        className="h-40 w-full object-cover object-center"
      />

      {/* Highlight row — parallels PropertyCard's "List Price" row */}
      <div className="px-3 h-14 flex items-center justify-between border-b border-slate-100">
        <div className="flex flex-col leading-tight">
          <span className="text-[0.55rem] uppercase tracking-wider font-bold text-slate-500">
            Closed Price
          </span>
          <span className="font-poppins font-bold text-base text-slate-900 tabular-nums">
            {priceFormatter(compsProperty.price)}
          </span>
        </div>
        {compsProperty.distance !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-poppins">
            <MapPin className="size-3" />
            {compsProperty.distance.toFixed(2)} mi
          </span>
        )}
      </div>

      {/* Column header — same height as data rows so card heights match */}
      <div className="px-3 grid grid-cols-[1fr_5rem] gap-x-2 h-7 items-center text-[0.55rem] uppercase tracking-wider font-bold border-b border-slate-100">
        <span />
        <span className="text-slate-500 text-right">Comp {index + 1}</span>
      </div>

      {/* Data rows */}
      <div className="px-3 py-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_5rem] gap-x-2 h-7 items-center text-xs"
          >
            <span className="font-poppins text-slate-500 text-[0.7rem] uppercase tracking-wider truncate">
              {row.label}
            </span>
            <span className="font-poppins font-semibold text-slate-900 tabular-nums text-right truncate">
              {row.value ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CompsCard;
