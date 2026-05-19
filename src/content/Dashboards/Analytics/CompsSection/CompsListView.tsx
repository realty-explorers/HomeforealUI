import { useState } from 'react';
import {
  Home,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CalendarDays,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/utils/converters';
import AnalyzedProperty, {
  CompData,
  FilteredComp
} from '@/models/analyzedProperty';
import { setMapFlyTarget } from '@/store/slices/propertiesSlice';

const DEFAULT_IMAGE =
  '/static/images/placeholders/covers/house_placeholder.jpg';

const similarityMap: Record<string, { label: string; classes: string }> = {
  red: { label: 'Very Low', classes: 'bg-red-100 text-red-700 border-red-200' },
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

const Thumb = ({ src, alt }: { src?: string; alt: string }) => {
  const [img, setImg] = useState(src || DEFAULT_IMAGE);
  return (
    <img
      src={img}
      alt={alt}
      onError={() => setImg(DEFAULT_IMAGE)}
      className="h-20 w-28 shrink-0 rounded-md object-cover object-center"
    />
  );
};

const Delta = ({
  subject,
  value
}: {
  subject?: number;
  value?: number;
}) => {
  if (!subject || !value || subject === 0) return null;
  const pct = ((value - subject) / subject) * 100;
  if (!isFinite(pct) || Math.abs(pct) < 0.5) return null;
  const up = pct > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center text-[0.65rem] font-medium',
        up ? 'text-rose-600' : 'text-emerald-600'
      )}
    >
      {up ? (
        <ArrowUp className="size-2.5" />
      ) : (
        <ArrowDown className="size-2.5" />
      )}
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
};

const StatChip = ({
  icon: Icon,
  value,
  unit,
  delta
}: {
  icon: any;
  value: React.ReactNode;
  unit?: string;
  delta?: React.ReactNode;
}) => (
  <div className="flex items-center gap-1 text-xs text-slate-700">
    <Icon className="size-3.5 text-slate-400" />
    <span className="font-medium">{value}</span>
    {unit && <span className="text-slate-400">{unit}</span>}
    {delta}
  </div>
);

type CompsListViewProps = {
  subject: AnalyzedProperty;
  comps: CompData[];
  selectedIndexes: number[];
  onToggle: (index: number) => void;
};

const CompsListView = ({
  subject,
  comps,
  selectedIndexes,
  onToggle
}: CompsListViewProps) => {
  const dispatch = useDispatch();
  const subjPrice = subject?.price;
  const subjArea = subject?.area;

  const handleLocate = (item: { location?: any }) => {
    const coords = item.location?.geometry?.coordinates;
    if (!coords) return;
    dispatch(
      setMapFlyTarget({
        coordinates: [Number(coords[0]), Number(coords[1])],
        zoom: 17
      })
    );
  };

  return (
    <div className="flex flex-col w-full max-w-3xl max-h-[60vh] overflow-y-auto pr-1">
      {/* Subject row — sticky at top inside the scroll area */}
      <Card className="flex items-center gap-3 p-3 mb-3 bg-slate-50 border-slate-200 sticky top-0 z-[1] shadow-sm">
        <Thumb src={subject?.photos?.primary} alt="Subject" />
        <div className="flex flex-col min-w-0 flex-1 gap-1">
          <div className="flex items-center gap-2">
            <Home className="size-3.5 text-slate-500" />
            <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-slate-500">
              Subject Property
            </span>
            <button
              type="button"
              aria-label="Show subject on map"
              title="Show on map"
              onClick={(e) => {
                e.stopPropagation();
                handleLocate(subject);
              }}
              className="ml-auto inline-flex items-center justify-center size-5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10 outline-none focus:outline-none border-0 bg-transparent"
            >
              <MapPin className="size-3.5" />
            </button>
          </div>
          <div className="text-sm font-poppins font-medium text-slate-900 truncate">
            {subject?.location?.address}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-base font-poppins font-semibold text-slate-900">
              {priceFormatter(subjPrice)}
            </span>
            <StatChip icon={Bed} value={subject?.beds} unit="bd" />
            <StatChip icon={Bath} value={subject?.baths} unit="ba" />
            <StatChip
              icon={Maximize2}
              value={subjArea?.toLocaleString()}
              unit="sqft"
            />
            {subject?.yearBuilt && (
              <StatChip
                icon={CalendarDays}
                value={String(subject.yearBuilt).slice(0, 4)}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Comp rows */}
      <div className="flex flex-col gap-3">
      {comps?.map((comp, index) => {
        const selected = selectedIndexes?.includes(index);
        const sim = similarityMap[comp.similarityColor];
        return (
          <Card
            key={index}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer transition-all border-slate-200 hover:border-primary/50 hover:shadow-md',
              selected && 'ring-1 ring-inset ring-primary/40 border-primary/40 bg-primary/[0.03]'
            )}
            onClick={() => onToggle(index)}
          >
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggle(index)}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
            />
            <Thumb src={comp.photos?.primary} alt={`Comp ${index + 1}`} />
            <div className="flex flex-col min-w-0 flex-1 gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-slate-500">
                  Comp {index + 1}
                </span>
                {comp.isArv25 && (
                  <Badge className="bg-arv text-white border-transparent hover:bg-arv text-[0.6rem] px-1.5 py-0">
                    25th ARV
                  </Badge>
                )}
                {sim && (
                  <Badge
                    variant="outline"
                    className={cn('text-[0.6rem] px-1.5 py-0', sim.classes)}
                  >
                    {sim.label}
                  </Badge>
                )}
                {comp.distance !== undefined && (
                  <span className="inline-flex items-center gap-0.5 text-[0.65rem] text-slate-500">
                    <MapPin className="size-2.5" />
                    {comp.distance.toFixed(2)} mi
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Show on map"
                  title="Show on map"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLocate(comp);
                  }}
                  className="ml-auto inline-flex items-center justify-center size-5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10 outline-none focus:outline-none border-0 bg-transparent"
                >
                  <MapPin className="size-3.5" />
                </button>
              </div>
              <div className="text-sm font-poppins font-medium text-slate-900 truncate">
                {comp.location?.address}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-base font-poppins font-semibold text-slate-900 inline-flex items-center gap-1">
                  {priceFormatter(comp.price)}
                  <Delta subject={subjPrice} value={comp.price} />
                </span>
                <StatChip icon={Bed} value={comp.beds} unit="bd" />
                <StatChip icon={Bath} value={comp.baths} unit="ba" />
                <StatChip
                  icon={Maximize2}
                  value={comp.area?.toLocaleString()}
                  unit="sqft"
                  delta={<Delta subject={subjArea} value={comp.area} />}
                />
                {comp.yearBuilt && (
                  <StatChip
                    icon={CalendarDays}
                    value={String(comp.yearBuilt).slice(0, 4)}
                  />
                )}
              </div>
            </div>
          </Card>
        );
      })}
      </div>
    </div>
  );
};

export default CompsListView;
