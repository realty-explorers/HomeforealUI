import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type SliderFieldProps = {
  fieldName: string;
  tooltip?: string;
  children: React.ReactNode;
};

// Labeled wrapper for a single filter row. Pairs a field name (and
// optional info tooltip) with whatever slider control sits below.
const SliderField: React.FC<SliderFieldProps> = ({
  fieldName,
  tooltip,
  children
}) => {
  return (
    <div className="flex flex-col gap-y-2 px-2">
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          {fieldName}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${fieldName}`}
                  className="inline-flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex w-full">{children}</div>
    </div>
  );
};

export default SliderField;
