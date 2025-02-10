import AnalyzedProperty from '@/models/analyzedProperty';
import { Chip } from '@mui/material';

type PropertyTagsProps = {
  property: AnalyzedProperty;
};
const PropertyTags = ({ property }: PropertyTagsProps) => {
  return (
    property && (
      <div className="flex gap-x-2 mb-2 mt-1">
        {property.flags.is_coming_soon !== undefined ? (
          <div className="flex bg-yellow-400 px-2 py-[0.2rem] rounded-3xl font-poppins text-black text-xs ">
            Coming Soon
          </div>
        ) : (
          <div className="flex bg-green-400 px-2 py-[0.2rem] rounded-3xl font-poppins text-black text-xs ">
            Active
          </div>
        )}

        {property.flags.is_foreclosure === true && (
          <div className="flex bg-red-400 px-2 py-[0.2rem] rounded-3xl font-poppins text-black text-xs ">
            Foreclosure
          </div>
        )}
      </div>
    )
  );
};

export default PropertyTags;
