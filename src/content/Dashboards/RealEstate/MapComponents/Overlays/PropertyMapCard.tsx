import { useState } from 'react';
import { MapPin, Calendar, Tag, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { priceGroupFormatter } from '@/utils/converters';
import Image from '@/components/Photos/Image';
import PropertyPreview from '@/models/propertyPreview';
import { calculateArvPercentage } from '@/utils/calculationUtils';
import { readableDateDiff } from '@/utils/dateUtils';

type PropertyMapCardProps = {
  property: PropertyPreview;
};

const DEFAULT_IMAGE =
  '/static/images/placeholders/covers/house_placeholder.jpg';

const PropertyMapCard: React.FC<PropertyMapCardProps> = ({ property }) => {
  const [cardImage, setCardImage] = useState(property?.image || DEFAULT_IMAGE);

  const stats = `${property?.beds} Beds ● ${property?.baths} Baths ● ${property?.area} Sqft`;
  const priceForPct = property.price ?? property.priceGroup.min;
  const compsPct = calculateArvPercentage(property.arvPrice, priceForPct);
  const arvPct = calculateArvPercentage(property.arv25Price, priceForPct);

  return (
    <Card className="flex w-80 min-h-40 overflow-hidden rounded-xl bg-white shadow">
      <div className="w-1/3 relative shrink-0">
        <Image
          src={cardImage}
          alt={property?.address}
          defaultSrc={DEFAULT_IMAGE}
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="flex flex-col w-2/3 min-w-0 px-4 py-2 gap-y-2">
        <p className="font-poppins font-semibold text-xs truncate">{stats}</p>

        <div className="flex items-center gap-x-2 min-w-0">
          <MapPin className="size-4 shrink-0" />
          <p className="text-xs font-poppins truncate">{property?.address}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Calendar className="size-4 shrink-0" />
          <p className="text-xs font-poppins">
            {readableDateDiff(property.listDate)}
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Tag className="size-4 shrink-0" />
          <p className="text-xs font-poppins">
            {priceGroupFormatter(property.price, property.priceGroup)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-secondary text-white border-transparent font-poppins text-[0.7rem] px-1 py-0 whitespace-nowrap gap-0.5 hover:bg-secondary">
            Comps <ArrowDown className="size-3" />
            {compsPct.toFixed()}%
          </Badge>
          <Badge className="bg-arv text-white border-transparent font-poppins text-[0.7rem] px-1 py-0 whitespace-nowrap gap-0.5 hover:bg-arv">
            ARV <ArrowDown className="size-3" />
            {arvPct.toFixed()}%
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default PropertyMapCard;
