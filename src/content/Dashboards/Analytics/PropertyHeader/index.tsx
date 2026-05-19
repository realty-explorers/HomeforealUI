import AnalyzedProperty from '@/models/analyzedProperty';
import PropertyPhotos from './PropertyPhotos';
import PropertyMainInfo from './PropertyMainInfo';
import PropertyTags from './PropertyTags';

type PropertyHeaderProps = {
  property: AnalyzedProperty;
};

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  return (
    <div className="flex flex-col w-full h-auto">
      <PropertyPhotos photos={property.photos?.all || []} />
      <div className="px-4 pt-3 pb-1 flex flex-col gap-3">
        <PropertyTags property={property} />
        <PropertyMainInfo property={property} />
      </div>
    </div>
  );
};

export default PropertyHeader;
