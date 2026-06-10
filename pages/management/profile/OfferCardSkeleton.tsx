import { Card } from '@/components/ui/card';

const Bar = ({ className = '' }: { className?: string }) => (
  <div className={`rounded bg-slate-100 ${className}`} />
);

const OfferCardSkeleton = () => (
  <Card className="overflow-hidden border-slate-200 bg-white h-full flex flex-col">
    {/* Hero */}
    <div className="relative h-48 bg-slate-100">
      <Bar className="absolute top-3 left-3 h-6 w-24 !bg-slate-200" />
      <Bar className="absolute top-3 right-3 h-5 w-16 !bg-slate-200" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <Bar className="h-7 w-32 !bg-slate-200" />
        <Bar className="h-3 w-3/4 !bg-slate-200" />
      </div>
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col gap-3 flex-1">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-slate-50 border border-slate-100"
          />
        ))}
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Bar className="h-3 w-16" />
            <Bar className="h-3 w-20" />
          </div>
        ))}
      </div>

      <Bar className="h-9 w-full mt-auto !bg-slate-200" />
    </div>
  </Card>
);

export default OfferCardSkeleton;
