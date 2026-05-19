import { MapPin } from 'lucide-react';
import AnalyzedProperty from '@/models/analyzedProperty';
import { priceGroupFormatter } from '@/utils/converters';

type PropertyMainInfoProps = {
  property: AnalyzedProperty;
};

const PropertyMainInfo = ({ property }: PropertyMainInfoProps) => {
  if (!property) return null;
  const loc = property.location;
  const cityLine = loc
    ? [loc.city, loc.state, loc.zipCode].filter(Boolean).join(', ')
    : '';

  return (
    <div className="flex flex-col gap-2">
      <div className="font-poppins font-bold text-3xl text-slate-900 leading-tight tracking-tight">
        {priceGroupFormatter(property.price, property.priceGroup)}
      </div>
      {loc?.address && (
        <div className="flex items-start gap-1.5 text-slate-600">
          <MapPin className="size-4 mt-0.5 shrink-0 text-slate-400" />
          <div className="font-poppins">
            <div className="text-sm font-medium text-slate-800">
              {loc.address}
            </div>
            {cityLine && (
              <div className="text-xs text-slate-500">{cityLine}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMainInfo;
