import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useMemo, useState } from 'react';
import { useLazyGetOffersQuery } from '@/store/services/offersApi';
import { useSession } from 'next-auth/react';
import OfferCard from './OfferCard';
import OfferCardSkeleton from './OfferCardSkeleton';
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Hourglass,
  Inbox,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FullOffer from 'types/offers/full-offer';

type FilterKey = 'all' | 'active' | 'accepted' | 'rejected';

const FILTERS: { key: FilterKey; label: string; statuses?: string[] }[] = [
  { key: 'all', label: 'All' },
  {
    key: 'active',
    label: 'In Progress',
    statuses: [
      'PENDING',
      'IN_REVIEW',
      'REALTOR_CONTACTED',
      'REALTOR_REVIEW',
      'FINAL_SIGN_OFF'
    ]
  },
  { key: 'accepted', label: 'Accepted', statuses: ['ACCEPTED'] },
  { key: 'rejected', label: 'Rejected', statuses: ['REJECTED'] }
];

const StatTile = ({
  icon: Icon,
  label,
  value,
  accent
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  accent: string;
}) => (
  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3 transition-shadow hover:shadow-md">
    <div
      className={cn(
        'flex items-center justify-center size-10 rounded-lg shrink-0',
        accent
      )}
    >
      <Icon className="size-5" />
    </div>
    <div className="flex flex-col min-w-0">
      <div className="text-[0.65rem] uppercase tracking-wider font-semibold text-slate-500">
        {label}
      </div>
      <div className="font-poppins font-bold text-2xl text-slate-900 tabular-nums leading-none mt-1">
        {value}
      </div>
    </div>
  </div>
);

const ManagementUserProfile = () => {
  const session = useSession();
  const [getOffers, offersState] = useLazyGetOffersQuery();
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    const userId = session.data?.user?.id;
    if (userId) {
      getOffers({ userId });
    }
  }, [session.data?.user?.id, getOffers]);

  const allOffers: FullOffer[] = useMemo(
    () =>
      (offersState.data?.offers || []).filter(
        (o: FullOffer) => o.propertyDetails
      ),
    [offersState.data]
  );

  const counts = useMemo(() => {
    const total = allOffers.length;
    const accepted = allOffers.filter((o) => o.status === 'ACCEPTED').length;
    const rejected = allOffers.filter((o) => o.status === 'REJECTED').length;
    const active = total - accepted - rejected;
    return { total, active, accepted, rejected };
  }, [allOffers]);

  const filtered = useMemo(() => {
    const current = FILTERS.find((f) => f.key === filter);
    if (!current?.statuses) return allOffers;
    return allOffers.filter((o) => current.statuses!.includes(o.status));
  }, [allOffers, filter]);

  const isLoading = offersState.isLoading || offersState.isUninitialized;
  const isEmpty = !isLoading && allOffers.length === 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.18em] font-bold text-violet-600">
            <Sparkles className="size-3" />
            Your Activity
          </div>
          <h1 className="font-poppins font-bold text-3xl lg:text-4xl text-slate-900 tracking-tight">
            Your Offers
          </h1>
          <p className="text-slate-500 font-poppins max-w-xl">
            Track the status of every offer you've submitted, from initial
            review to final sign-off.
          </p>
        </div>

        {/* Stats row */}
        {!isEmpty && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatTile
              icon={Receipt}
              label="Total Offers"
              value={counts.total}
              accent="bg-violet-100 text-violet-700"
            />
            <StatTile
              icon={Hourglass}
              label="In Progress"
              value={counts.active}
              accent="bg-amber-100 text-amber-700"
            />
            <StatTile
              icon={CheckCircle2}
              label="Accepted"
              value={counts.accepted}
              accent="bg-emerald-100 text-emerald-700"
            />
            <StatTile
              icon={XCircle}
              label="Rejected"
              value={counts.rejected}
              accent="bg-rose-100 text-rose-700"
            />
          </div>
        )}

        {/* Filter chips */}
        {!isEmpty && !isLoading && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {FILTERS.map((f) => {
              const count =
                f.key === 'all'
                  ? counts.total
                  : f.statuses!.reduce(
                      (acc, s) =>
                        acc + allOffers.filter((o) => o.status === s).length,
                      0
                    );
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-poppins font-semibold transition-all outline-none border',
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      'inline-flex items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold tabular-nums',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <SkeletonGrid />
        ) : isEmpty ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoMatchState onReset={() => setFilter('all')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((offer, i) => (
              <OfferCard key={offer.id || i} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: 6 }).map((_, i) => (
      <OfferCardSkeleton key={i} />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-6 flex flex-col items-center text-center gap-3">
    <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center ring-1 ring-violet-200">
      <Inbox className="size-7 text-violet-600" />
    </div>
    <div>
      <h3 className="font-poppins font-bold text-xl text-slate-900">
        No offers yet
      </h3>
      <p className="text-sm text-slate-500 font-poppins mt-1 max-w-md mx-auto">
        Once you submit an offer on a property, you'll see it here with live
        status updates.
      </p>
    </div>
  </div>
);

const NoMatchState = ({ onReset }: { onReset: () => void }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 px-6 flex flex-col items-center text-center gap-2">
    <Inbox className="size-8 text-slate-400" />
    <div className="font-poppins font-semibold text-slate-900">
      No offers match this filter
    </div>
    <button
      type="button"
      onClick={onReset}
      className="text-sm font-poppins font-semibold text-violet-600 hover:text-violet-700 mt-1"
    >
      Show all offers
    </button>
  </div>
);

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
