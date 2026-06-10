import { useEffect, useState } from 'react';
import {
  MapPin,
  Tag,
  Ruler,
  Gauge,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { priceFormatter } from '@/utils/converters';
import Image from '@/components/Photos/Image';
import AnalyzedProperty, { CompData } from '@/models/analyzedProperty';
import { readableDateDiff } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { analyzeComp, type Analysis, type Finding } from '@/utils/compsAnalysis';

type CompsMapCardProps = {
  property: CompData;
  subject?: AnalyzedProperty;
};

const DEFAULT_IMAGE =
  '/static/images/placeholders/covers/house_placeholder.jpg';

const getColorClass = (color?: string) => {
  switch (color) {
    case 'red':
      return 'text-red-500';
    case 'orange':
      return 'text-orange-500';
    case 'yellow':
      return 'text-yellow-500';
    case 'green':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

const runAnalysis = async (
  subject: AnalyzedProperty | undefined,
  comp: CompData
): Promise<Analysis> => {
  // Simulate latency so the "analyzing" state is visible. Replace with a
  // real API call here when the AI service is wired up.
  await new Promise((r) => setTimeout(r, 1200));
  if (!subject) {
    return {
      summary: 'Subject property not available — showing similarity score only.',
      findings: []
    };
  }
  return analyzeComp(subject, comp);
};

const impactClasses = (impact: Finding['impact']) => {
  if (impact === 'positive')
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (impact === 'negative')
    return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const CompsMapCard: React.FC<CompsMapCardProps> = ({ property, subject }) => {
  const [cardImage, setCardImage] = useState(
    property?.photos?.primary || DEFAULT_IMAGE
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [open, setOpen] = useState(false);

  // Reset AI analysis when the hovered comp changes — otherwise the card
  // keeps showing the previous comp's findings.
  useEffect(() => {
    setAnalysis(null);
    setAnalyzing(false);
    setOpen(false);
    setCardImage(property?.photos?.primary || DEFAULT_IMAGE);
  }, [property?.index, property?.location?.address]);

  const handleOpenChange = async (next: boolean) => {
    setOpen(next);
    if (next && !analysis && !analyzing) {
      setAnalyzing(true);
      try {
        const result = await runAnalysis(subject, property);
        setAnalysis(result);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const stats = `${property?.beds} Beds ● ${property?.baths} Baths ● ${property?.area} Sqft`;
  const locationStats = `${property.distance.toFixed(2)} Miles ● ${readableDateDiff(property.listDate)}`;

  return (
    <Card className="relative flex w-80 min-h-40 overflow-hidden rounded-xl bg-white shadow">
      <div className="w-1/3 relative shrink-0">
        <Image
          src={cardImage}
          alt={property?.location.address}
          defaultSrc={DEFAULT_IMAGE}
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="flex flex-col w-2/3 min-w-0 px-4 py-2 gap-y-2">
        <p className="font-poppins font-semibold text-xs whitespace-nowrap truncate">
          {stats}
        </p>

        <div className="flex items-center gap-x-2 min-w-0">
          <MapPin className="size-4 shrink-0" />
          <p className="text-xs font-poppins truncate">
            {property?.location.address}
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Ruler className="size-4 shrink-0" />
          <p className="text-xs font-poppins whitespace-nowrap">
            {locationStats}
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Tag className="size-4 shrink-0" />
          <p className="text-xs font-poppins whitespace-nowrap">
            {priceFormatter(property?.price)}
          </p>
        </div>

        <div className="flex items-center gap-x-2 flex-wrap">
          <Gauge
            className={cn(
              'size-4 shrink-0',
              getColorClass(property.similarityColor)
            )}
          />
          <p
            className={cn(
              'text-xs font-poppins font-bold whitespace-nowrap',
              getColorClass(property.similarityColor)
            )}
          >
            {Math.round(property.similarityScore * 100)}% Similarity
          </p>
          {property.isArv25 && (
            <Badge className="bg-arv text-white border-transparent font-poppins text-[0.6rem] px-1.5 py-0 whitespace-nowrap hover:bg-arv">
              25th ARV
            </Badge>
          )}
        </div>

        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group relative self-start inline-flex items-center gap-1 overflow-hidden rounded-md bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-2 py-0.5 font-poppins text-[0.65rem] font-semibold text-white shadow-[0_2px_8px_rgba(217,70,239,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none border-0"
            >
              {analyzing ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Sparkles className="size-3" />
              )}
              <span className="relative z-10">AI Analysis</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            className="w-72 p-3 max-h-[60vh] overflow-y-auto space-y-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wider font-semibold text-slate-500">
              <Sparkles className="size-3 text-fuchsia-500" />
              AI analysis
            </div>
            {analyzing || !analysis ? (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-500 font-poppins">
                <Loader2 className="size-3.5 animate-spin" />
                Analyzing comp…
              </div>
            ) : (
              <>
                <p className="text-xs font-poppins text-slate-700 leading-snug">
                  {analysis.summary}
                </p>
                <ul className="space-y-1.5">
                  {analysis.findings.map((f, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[5.25rem_1fr] gap-2 items-start"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[0.6rem] font-poppins px-1 py-0 w-full justify-center',
                          impactClasses(f.impact)
                        )}
                      >
                        {f.label}
                      </Badge>
                      <span className="text-[0.7rem] font-poppins text-slate-700 leading-snug">
                        {f.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default CompsMapCard;
