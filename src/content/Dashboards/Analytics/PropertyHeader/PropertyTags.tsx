import { CircleDot, Clock, AlertTriangle } from 'lucide-react';
import AnalyzedProperty from '@/models/analyzedProperty';
import { Badge } from '@/components/ui/badge';

type PropertyTagsProps = {
  property: AnalyzedProperty;
};

const PropertyTags = ({ property }: PropertyTagsProps) => {
  if (!property) return null;

  const tags: React.ReactNode[] = [];

  if (property.flags?.isComingSoon !== undefined) {
    tags.push(
      <Badge
        key="coming-soon"
        className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-poppins gap-1"
      >
        <Clock className="size-3" />
        Coming Soon
      </Badge>
    );
  } else {
    tags.push(
      <Badge
        key="active"
        className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-poppins gap-1"
      >
        <CircleDot className="size-3" />
        Active
      </Badge>
    );
  }

  if (property.flags?.isForeclosure) {
    tags.push(
      <Badge
        key="foreclosure"
        className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100 font-poppins gap-1"
      >
        <AlertTriangle className="size-3" />
        Foreclosure
      </Badge>
    );
  }

  return <div className="flex flex-wrap gap-2">{tags}</div>;
};

export default PropertyTags;
