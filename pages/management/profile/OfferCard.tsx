import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Bath,
  BedDouble,
  Maximize2,
  CheckCircle2,
  XCircle,
  Clock,
  Hourglass,
  PhoneCall,
  Eye,
  FileSignature,
  MapPin,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FullOffer from 'types/offers/full-offer';

interface OfferCardProps {
  offer: FullOffer;
}

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  pill: string;
};

const STATUS_META: Record<string, StatusMeta> = {
  PENDING: {
    label: 'Pending',
    icon: Hourglass,
    pill: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  IN_REVIEW: {
    label: 'In Review',
    icon: Eye,
    pill: 'bg-sky-100 text-sky-700 border-sky-200'
  },
  REALTOR_CONTACTED: {
    label: 'Realtor Contacted',
    icon: PhoneCall,
    pill: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  REALTOR_REVIEW: {
    label: 'Realtor Review',
    icon: Eye,
    pill: 'bg-violet-100 text-violet-700 border-violet-200'
  },
  FINAL_SIGN_OFF: {
    label: 'Final Sign-off',
    icon: FileSignature,
    pill: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: CheckCircle2,
    pill: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    pill: 'bg-rose-100 text-rose-700 border-rose-200'
  }
};

const DEFAULT_PHOTO =
  '/static/images/placeholders/covers/house_placeholder.jpg';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (dateString: Date) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const titleCase = (s: string) =>
  s
    ? s
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : '';

const OfferCard = ({ offer }: OfferCardProps) => {
  const p = offer?.propertyDetails;
  if (!offer || !p) return null;

  const status = STATUS_META[offer.status] || STATUS_META.PENDING;
  const StatusIcon = status.icon;
  const purchasePrice = offer.offerData.financialDetails.purchasePrice;
  const financingType = offer.offerData.financialDetails.financingType;
  const buyer = offer.offerData.buyerDetails.name;
  const inspectionRequired = offer.offerData.propertyTerms.conductInspection;

  const cityLine = p.location
    ? [p.location.city, p.location.state, p.location.zipCode]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-slate-200 bg-white h-full flex flex-col',
        'shadow-sm transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-xl',
        'hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.20)]'
      )}
    >
      {/* Hero photo */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={p.photos?.primary || DEFAULT_PHOTO}
          alt={p.location?.address || 'Property'}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PHOTO;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom fade for legibility of price */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Status badge — top-left, floating */}
        <Badge
          className={cn(
            'absolute top-3 left-3 gap-1 px-2.5 py-1 border font-poppins font-semibold text-[0.7rem] shadow-sm backdrop-blur-sm',
            status.pill
          )}
        >
          <StatusIcon className="size-3" />
          {status.label}
        </Badge>

        {/* Type pill — top-right */}
        {p.type && (
          <Badge
            variant="outline"
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 border-white/80 font-poppins font-semibold text-[0.65rem] shadow-sm"
          >
            {titleCase(p.type)}
          </Badge>
        )}

        {/* Price + address overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="font-poppins font-bold text-2xl tracking-tight leading-none">
            {formatCurrency(purchasePrice)}
          </div>
          {p.location?.address && (
            <div className="flex items-start gap-1.5 mt-1.5 text-white/90">
              <MapPin className="size-3.5 mt-0.5 shrink-0" />
              <div className="text-xs font-poppins font-medium leading-tight line-clamp-2">
                {p.location.address}
                {cityLine && (
                  <span className="block text-white/70 text-[0.7rem] font-normal mt-0.5">
                    {cityLine}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={BedDouble} value={p.beds} unit="bd" />
          <Stat icon={Bath} value={p.baths} unit="ba" />
          <Stat icon={Maximize2} value={p.area?.toLocaleString()} unit="sqft" />
        </div>

        {/* Meta */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 flex flex-col gap-1.5 text-xs">
          <MetaRow
            label="Offered"
            value={formatDate(offer.createdAt)}
            icon={CalendarDays}
          />
          <MetaRow
            label="Financing"
            value={titleCase(financingType || '')}
            icon={FileSignature}
          />
          {buyer && <MetaRow label="Buyer" value={buyer} />}
          <MetaRow
            label="Inspection"
            value={inspectionRequired ? 'Required' : 'Waived'}
            valueClass={
              inspectionRequired ? 'text-amber-700' : 'text-emerald-700'
            }
          />
        </div>

        {/* Action */}
        <Button
          variant="secondary"
          className="mt-auto w-full gap-1.5 font-poppins font-semibold bg-slate-900 text-white hover:bg-slate-800 group/btn"
        >
          View Details
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </div>
    </Card>
  );
};

const Stat = ({
  icon: Icon,
  value,
  unit
}: {
  icon: LucideIcon;
  value: React.ReactNode;
  unit: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 border border-slate-100 py-2">
    <Icon className="size-4 text-slate-400 mb-0.5" />
    <div className="font-poppins text-sm font-bold text-slate-900 tabular-nums leading-none">
      {value ?? '—'}
    </div>
    <div className="text-[0.6rem] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
      {unit}
    </div>
  </div>
);

const MetaRow = ({
  label,
  value,
  icon: Icon,
  valueClass
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="inline-flex items-center gap-1 text-slate-500 text-[0.7rem] uppercase tracking-wider font-semibold">
      {Icon && <Icon className="size-3" />}
      {label}
    </span>
    <span
      className={cn(
        'font-poppins text-xs font-semibold text-slate-700 truncate text-right',
        valueClass
      )}
    >
      {value || '—'}
    </span>
  </div>
);

export default OfferCard;
