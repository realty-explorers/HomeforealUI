import { Bed, Home, Ruler, type LucideIcon } from 'lucide-react';
import AnalyzedProperty from '@/models/analyzedProperty';
import { numberFormatter } from '@/utils/converters';
import { readableDateDiff } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

const titleCase = (s?: string) =>
  s
    ? s
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : '';

type Fact = { label: string; value: React.ReactNode };

type Theme = {
  accent: string;
  iconBg: string;
  tileBg: string;
  border: string;
  labelText: string;
  valueText: string;
  glow: string;
  blob: string;
};

const themes: Record<string, Theme> = {
  purple: {
    accent: 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500',
    iconBg: 'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500',
    tileBg:
      'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/70',
    border: 'border-violet-200/70',
    labelText: 'text-violet-500',
    valueText:
      'bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent',
    glow: 'group-hover:shadow-[0_8px_28px_-8px_rgba(168,85,247,0.45)]',
    blob: 'bg-fuchsia-400/30'
  },
  blue: {
    accent: 'bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500',
    iconBg: 'bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500',
    tileBg: 'bg-gradient-to-br from-sky-50 via-white to-cyan-50/70',
    border: 'border-sky-200/70',
    labelText: 'text-sky-600',
    valueText:
      'bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent',
    glow: 'group-hover:shadow-[0_8px_28px_-8px_rgba(14,165,233,0.45)]',
    blob: 'bg-cyan-400/30'
  },
  emerald: {
    accent: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500',
    iconBg: 'bg-gradient-to-br from-emerald-500 via-teal-400 to-green-500',
    tileBg:
      'bg-gradient-to-br from-emerald-50 via-white to-teal-50/70',
    border: 'border-emerald-200/70',
    labelText: 'text-emerald-600',
    valueText:
      'bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent',
    glow: 'group-hover:shadow-[0_8px_28px_-8px_rgba(16,185,129,0.45)]',
    blob: 'bg-teal-400/30'
  }
};

type FactTileProps = {
  icon: LucideIcon;
  theme: Theme;
  facts: Fact[];
};

const FactTile = ({ icon: Icon, theme, facts }: FactTileProps) => (
  <div
    className={cn(
      'group relative rounded-xl border overflow-hidden p-3 pt-4 transition-all duration-300 hover:-translate-y-1',
      theme.border,
      theme.tileBg,
      theme.glow
    )}
  >
    {/* top accent strip */}
    <div
      className={cn(
        'absolute inset-x-0 top-0 h-[3px] transition-all duration-300',
        theme.accent
      )}
    />

    {/* decorative blurred blob in top-right */}
    <div
      className={cn(
        'pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100',
        theme.blob
      )}
    />

    <div
      className={cn(
        'relative flex items-center justify-center size-10 rounded-xl mb-3 shadow-lg shadow-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]',
        theme.iconBg
      )}
    >
      <Icon className="size-5 text-white drop-shadow-sm" />
    </div>

    <div className="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
      {facts.map((fact, i) => (
        <div key={i} className="contents">
          <span
            className={cn(
              'text-[0.6rem] uppercase tracking-[0.08em] font-bold self-center whitespace-nowrap',
              theme.labelText
            )}
          >
            {fact.label}
          </span>
          <span
            className={cn(
              'text-sm font-poppins font-extrabold text-right truncate',
              theme.valueText
            )}
          >
            {fact.value ?? '—'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

type PropertyFactsProps = {
  property: AnalyzedProperty;
};

const PropertyFacts = ({ property }: PropertyFactsProps) => {
  if (!property) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
      <FactTile
        icon={Bed}
        theme={themes.purple}
        facts={[
          { label: 'Beds', value: property.beds },
          { label: 'Baths', value: property.baths }
        ]}
      />
      <FactTile
        icon={Home}
        theme={themes.blue}
        facts={[
          { label: 'Type', value: titleCase(property.type) || '—' },
          { label: 'Built', value: property.yearBuilt },
          { label: 'DOM', value: readableDateDiff(property?.listDate) }
        ]}
      />
      <FactTile
        icon={Ruler}
        theme={themes.emerald}
        facts={[
          {
            label: 'Building',
            value: property.area
              ? `${numberFormatter(property.area)} sqft`
              : '—'
          },
          {
            label: 'Lot',
            value: property.lotArea
              ? `${numberFormatter(property.lotArea)} sqft`
              : '—'
          },
          { label: 'Floors', value: property.floors }
        ]}
      />
    </div>
  );
};

export default PropertyFacts;
