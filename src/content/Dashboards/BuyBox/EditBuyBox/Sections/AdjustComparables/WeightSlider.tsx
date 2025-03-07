import React, { useState, useCallback, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Info, Zap } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';
import RangeFieldV2 from '@/components/Form/RangeFieldV2';
import RangeFieldV3 from '@/components/Form/RangeFieldV3';

interface WeightSliderProps {
  id: string;
  name: string;
  description: string;
  unit?: string;
}

// Moved outside component to prevent recreation on each render
const strengthCategories = [
  { threshold: 80, label: 'Critical', color: 'text-fuchsia-600' },
  { threshold: 60, label: 'Important', color: 'text-violet-600' },
  { threshold: 40, label: 'Moderate', color: 'text-violet-500' },
  { threshold: 20, label: 'Minor', color: 'text-violet-400' },
  { threshold: 0, label: 'Minimal', color: 'text-slate-400' }
];

const WeightSlider: React.FC<WeightSliderProps> = React.memo(
  ({ id, name, description, unit }) => {
    const { control, watch } = useFormContext();
    const [isHovered, setIsHovered] = useState(false);

    // Use specific field watch instead of watching all fields
    const value = watch(`weights.${id}`, 0);

    // Memoize strength category calculation
    const strength = useMemo(() => {
      for (const category of strengthCategories) {
        if (value >= category.threshold) {
          return category;
        }
      }
      return strengthCategories[strengthCategories.length - 1];
    }, [value]);
    //
    // // Memoize background style
    const backgroundStyle = useMemo(
      () => ({
        background: `linear-gradient(to right,
      rgba(124, 58, 237, 0.9) 0%,
      rgba(196, 69, 252, 0.9) ${value}%,
      rgba(226, 232, 240, 0.6) ${value}%,
      rgba(226, 232, 240, 0.6) 100%)`
      }),
      [value]
    );

    // Memoize hover handlers
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    // Memoize input change handler
    const handleInputChange = useCallback((e, onChange) => {
      const newValue = parseInt(e.target.value);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
        onChange(newValue);
      }
    }, []);

    return (
      <div
        className="p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-violet-200/50 shadow-sm hover:shadow-md hover:border-violet-300/50 transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col xs:flex-row justify-between items-center mb-4 gap-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                value > 50
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                  : 'bg-slate-100'
              } transition-all duration-500`}
            >
              <Zap
                className={`h-4 w-4 ${
                  value > 50 ? 'text-white' : 'text-slate-400'
                } ${isHovered ? 'animate-pulse-subtle' : ''}`}
              />
            </div>
            <div>
              <label
                htmlFor={id}
                className="text-base font-medium text-foreground hover:text-violet-700 transition-colors flex items-center"
              >
                {name}{' '}
                {unit && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({unit})
                  </span>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-1.5 text-violet-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-gradient-to-br from-violet-600/95 to-fuchsia-600/95 text-white max-w-xs border-none shadow-xl"
                    >
                      <p>{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <div
                className={`text-xs ${strength.color} font-medium transition-all duration-300`}
              >
                {strength.label} impact
              </div>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-md shadow-sm border border-violet-100 overflow-hidden">
            <Controller
              name={`weights.${id}`}
              control={control}
              render={({ field }) => (
                <Input
                  id={id}
                  type="number"
                  min={0}
                  max={100}
                  value={field.value || 0}
                  onChange={(e) => handleInputChange(e, field.onChange)}
                  className="w-14 h-8 text-center text-sm border-0 focus-visible:ring-violet-300/30"
                />
              )}
            />
            <span className="pr-2 text-xs text-violet-500 font-medium">%</span>
          </div>
        </div>
        <div
          className="w-full rounded-full mb-4 shadow-inner shadow-violet-100"
          // style={backgroundStyle}
        >
          <Controller
            name={`weights.${id}`}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Slider
                  id={`${id}-slider`}
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value || 0]}
                  onValueChange={(values) => field.onChange(values[0])}
                  className="slider-thumb slider-track"
                />
              </div>
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Not Important</span>
          <span>Very Important</span>
        </div>
      </div>
    );
  }
);

WeightSlider.displayName = 'WeightSlider';

export default WeightSlider;
