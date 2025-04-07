import { CircleHelpIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const HelperIcon = ({ helperText }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CircleHelpIcon className="h-4 w-4 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs whitespace-normal break-words">
        <p>{helperText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HelperIcon;
