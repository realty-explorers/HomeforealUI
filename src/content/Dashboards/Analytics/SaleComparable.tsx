import { useSelector } from 'react-redux';
import {
  DollarSign,
  Clock,
  Layers,
  ArrowUp,
  ArrowDown,
  type LucideIcon
} from 'lucide-react';
import AnalyzedProperty from '@/models/analyzedProperty';
import { numberStringUtil, priceFormatter } from '@/utils/converters';
import { selectSelectedComps } from '@/store/slices/propertiesSlice';
import { readableDateDiff } from '@/utils/dateUtils';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const calcDays = (date: string | number) => {
  if (date === undefined || date === null) return 0;
  const date1 = typeof date === 'number' ? new Date() : new Date(date);
  if (typeof date === 'number') {
    return date;
  }
  const diff = Math.abs(Date.now() - date1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

type Direction = 'up' | 'down' | null;

type RowProps = {
  icon: LucideIcon;
  label: string;
  subject: React.ReactNode;
  comps: React.ReactNode;
  delta?: { pct: number; good: boolean } | null;
};

const Row = ({ icon: Icon, label, subject, comps, delta }: RowProps) => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0">
    <div className="flex items-center gap-2 w-32 shrink-0 text-slate-700">
      <span className="flex items-center justify-center size-7 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 text-secondary">
        <Icon className="size-3.5" />
      </span>
      <span className="text-[0.7rem] uppercase tracking-wider font-bold text-slate-500">
        {label}
      </span>
    </div>

    <div className="flex-1 flex items-center gap-2 min-w-0">
      <span className="font-poppins font-bold text-base text-slate-900 tabular-nums whitespace-nowrap">
        {subject}
      </span>
      <span
        className="flex-1 border-t-2 border-dotted border-slate-200 mt-0.5"
        aria-hidden
      />
      <span className="font-poppins font-bold text-base text-slate-700 tabular-nums whitespace-nowrap">
        {comps}
      </span>
      {delta && (
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.65rem] font-poppins font-bold tabular-nums',
            delta.good
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          )}
        >
          {delta.pct >= 0 ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )}
          {Math.abs(delta.pct).toFixed(0)}%
        </span>
      )}
    </div>
  </div>
);

type SaleComparableProps = {
  property: AnalyzedProperty;
};

const SaleComparable = ({ property }: SaleComparableProps) => {
  const selectedComps = useSelector(selectSelectedComps);
  const soldComps = property.comps?.filter(
    (c) => c.status === 'sold' || c.status === 'off_market'
  );
  if (!soldComps || soldComps.length === 0) return null;

  const area = property.area;
  const priceToSqft = area && area > 0 ? property.price / area : 0;

  const compsPriceToSqft =
    selectedComps && selectedComps.length > 0
      ? selectedComps.reduce((acc, comp) => {
          const a = comp.area;
          const pps = a && a > 0 ? numberStringUtil(comp.price) / a : 0;
          return acc + pps;
        }, 0) / selectedComps.length
      : 0;

  const subjectDOM = calcDays(property.listDate);
  const avgCompsDOM =
    selectedComps && selectedComps.length > 0
      ? selectedComps.reduce((acc, c) => acc + calcDays(c.listDate), 0) /
        selectedComps.length
      : 0;

  // % diff helpers
  const pricePct =
    compsPriceToSqft > 0
      ? ((priceToSqft - compsPriceToSqft) / compsPriceToSqft) * 100
      : 0;
  const domPct =
    avgCompsDOM > 0 ? ((subjectDOM - avgCompsDOM) / avgCompsDOM) * 100 : 0;

  return (
    <div className="hidden md:block p-4 w-full">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500">
            Subject vs Comps
          </h3>
          <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-wider font-bold">
            <span className="text-slate-900">Subject</span>
            <span className="text-slate-400">Comps avg</span>
          </div>
        </div>
        <Row
          icon={DollarSign}
          label="Price / Sqft"
          subject={priceToSqft ? priceFormatter(priceToSqft.toFixed()) : '—'}
          comps={
            compsPriceToSqft
              ? priceFormatter(compsPriceToSqft.toFixed())
              : '—'
          }
          delta={
            compsPriceToSqft && priceToSqft
              ? { pct: pricePct, good: pricePct < 0 } // priced below comps avg is favorable
              : null
          }
        />
        <Row
          icon={Clock}
          label="Average DOM"
          subject={readableDateDiff(subjectDOM)}
          comps={avgCompsDOM ? readableDateDiff(avgCompsDOM) : '—'}
          delta={
            avgCompsDOM && subjectDOM
              ? { pct: domPct, good: domPct < 0 } // listed shorter than avg is favorable
              : null
          }
        />
        <Row
          icon={Layers}
          label="Total Comps"
          subject="—"
          comps={soldComps.length}
        />
      </Card>
    </div>
  );
};

export default SaleComparable;
