import AnalyzedProperty from "@/models/analyzedProperty";
import { Chip } from "@mui/material";

type PropertyTagsProps = {
  property: AnalyzedProperty;
};
const PropertyTags = ({ property }: PropertyTagsProps) => {
  return property && (
    <div className="flex gap-x-2 mb-2 mt-1">
      <div className="flex bg-green-400 px-2 py-[0.2rem] rounded-3xl font-poppins text-black text-xs ">
        Active
      </div>
    </div>
  );
};

export default PropertyTags;
