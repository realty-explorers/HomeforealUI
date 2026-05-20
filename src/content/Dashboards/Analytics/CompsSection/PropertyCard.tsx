import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Home } from 'lucide-react';
import AnalyzedProperty, { CompData } from '@/models/analyzedProperty';
import { priceFormatter } from '@/utils/converters';

const DEFAULT_IMAGE =
  '/static/images/placeholders/covers/house_placeholder.jpg';

type Row = {
  label: string;
  value: React.ReactNode;
  averageProperty?: string;
  averageFormatter?: (v: string) => string;
};

const buildRows = (property: AnalyzedProperty): Row[] => [
  {
    label: 'Asking',
    value: priceFormatter(property.price),
    averageProperty: 'price',
    averageFormatter: priceFormatter
  },
  { label: 'Beds', value: property.beds, averageProperty: 'beds' },
  { label: 'Baths', value: property.baths, averageProperty: 'baths' },
  {
    label: 'Lot Sqft',
    value: property.lotArea?.toLocaleString(),
    averageProperty: 'lotArea'
  },
  {
    label: 'Building Sqft',
    value: property.area?.toLocaleString(),
    averageProperty: 'area'
  },
  { label: 'Floors', value: property.floors, averageProperty: 'floors' },
  { label: 'Garages', value: property.garages, averageProperty: 'garages' },
  {
    label: 'Year Built',
    value:
      typeof property.yearBuilt === 'string'
        ? property.yearBuilt.slice(0, 4)
        : property.yearBuilt,
    averageProperty: 'yearBuilt'
  },
  {
    label: 'Location',
    value: property.location?.neighborhood
  },
  {
    label: 'Price / Sqft',
    value:
      property.area && property.area > 0
        ? priceFormatter((property.price / property.area).toFixed())
        : '—'
  }
];

type PropertyCardProps = {
  property: AnalyzedProperty;
  compsProperties: CompData[];
};

const PropertyCard = ({ property, compsProperties }: PropertyCardProps) => {
  const [cardImage, setCardImage] = useState(
    property.photos?.primary || DEFAULT_IMAGE
  );

  useEffect(() => {
    setCardImage(property.photos?.primary || DEFAULT_IMAGE);
  }, [property.photos?.primary]);

  const calcCompsAverage = (propertyName: string) => {
    if (!compsProperties || compsProperties.length < 1) return '';
    const values = compsProperties
      .map((c) => (c as any)[propertyName])
      .filter((v) => typeof v === 'number') as number[];
    if (values.length < 1) return '';
    return (
      values.reduce((acc, curr) => acc + curr, 0) / values.length
    ).toFixed();
  };

  const rows = buildRows(property);

  return (
    <Card className="w-[22.5rem] shrink-0 overflow-hidden border-transparent bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-violet-500/20">
      {/* Header — same height as CompsCard header */}
      <div className="flex items-center gap-2 px-3 h-12 bg-black/10 border-b border-white/15">
        <div className="flex items-center justify-center size-7 rounded-md bg-white/15 backdrop-blur-sm shrink-0">
          <Home className="size-3.5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[0.55rem] uppercase tracking-[0.18em] font-bold text-white/70">
            Subject
          </span>
          <span className="font-poppins font-bold text-sm text-white">
            Target Property
          </span>
        </div>
      </div>

      {/* Photo */}
      <img
        src={cardImage}
        alt={property.location?.address || 'Property'}
        onError={() => setCardImage(DEFAULT_IMAGE)}
        className="h-40 w-full object-cover object-center"
      />

      {/* Highlight row — parallels CompsCard's "Closed Price" row */}
      <div className="px-3 h-14 flex items-center justify-between border-b border-white/15">
        <div className="flex flex-col leading-tight">
          <span className="text-[0.55rem] uppercase tracking-wider font-bold text-white/70">
            List Price
          </span>
          <span className="font-poppins font-bold text-base text-white tabular-nums">
            {priceFormatter(property.price)}
          </span>
        </div>
      </div>

      {/* Column header — same height as the data rows */}
      <div className="px-3 grid grid-cols-[1fr_5rem_5rem] gap-x-2 h-7 items-center text-[0.55rem] uppercase tracking-wider font-bold border-b border-white/10">
        <span />
        <span className="text-white/80 text-right">Subject</span>
        <span className="text-white/60 text-right">Comps Avg</span>
      </div>

      {/* Data rows */}
      <div className="px-3 py-2">
        {rows.map((row, i) => {
          const avg = row.averageProperty
            ? row.averageFormatter
              ? row.averageFormatter(calcCompsAverage(row.averageProperty))
              : calcCompsAverage(row.averageProperty)
            : '';
          return (
            <div
              key={i}
              className="grid grid-cols-[1fr_5rem_5rem] gap-x-2 h-7 items-center text-xs"
            >
              <span className="font-poppins text-white/80 text-[0.7rem] uppercase tracking-wider truncate">
                {row.label}
              </span>
              <span className="font-poppins font-semibold text-white tabular-nums text-right truncate">
                {row.value ?? '—'}
              </span>
              <span className="font-poppins text-white/60 tabular-nums text-right truncate">
                {avg || '—'}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PropertyCard;
