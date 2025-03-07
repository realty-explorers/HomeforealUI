import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { PropertyWeights } from '@/utils/propertyUtils';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, ArrowRight, Wand2 } from 'lucide-react';

interface WeightPreset {
  name: string;
  description: string;
  weights: PropertyWeights;
  icon: React.ReactNode;
}

interface WeightPresetsProps {
  onApplyPreset: (weights: PropertyWeights) => void;
}

const WeightPresets: React.FC<WeightPresetsProps> = ({ onApplyPreset }) => {
  const presets: WeightPreset[] = [
    {
      name: 'Standard Comparison',
      description: 'Balanced weights across all attributes',
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
      weights: {
        bedrooms: 70,
        bathrooms: 65,
        squareFootage: 85,
        lotSize: 50,
        yearBuilt: 40,
        distance: 75,
        listingAge: 30
      }
    },
    {
      name: 'Location Priority',
      description: 'Emphasizes location and proximity',
      icon: (
        <svg
          className="h-4 w-4 text-fuchsia-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
      weights: {
        bedrooms: 50,
        bathrooms: 50,
        squareFootage: 70,
        lotSize: 40,
        yearBuilt: 30,
        distance: 100,
        listingAge: 20
      }
    },
    {
      name: 'Size Focus',
      description: 'Prioritizes property size and layout',
      icon: (
        <svg
          className="h-4 w-4 text-indigo-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 15h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm-4 12h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zM9 17h2v2H9zm0-4h2v2H9zm0-4h2v2H9zm0-4h2v2H9zM5 3h2v18H5z" />
        </svg>
      ),
      weights: {
        bedrooms: 90,
        bathrooms: 85,
        squareFootage: 100,
        lotSize: 70,
        yearBuilt: 20,
        distance: 40,
        listingAge: 10
      }
    },
    {
      name: 'Recent Comps',
      description: 'Emphasizes newer listings',
      icon: (
        <svg
          className="h-4 w-4 text-emerald-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      ),
      weights: {
        bedrooms: 60,
        bathrooms: 60,
        squareFootage: 75,
        lotSize: 40,
        yearBuilt: 50,
        distance: 70,
        listingAge: 90
      }
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-fuchsia-50 to-violet-50 border-violet-200 hover:border-violet-300 hover:from-fuchsia-100 hover:to-violet-100 text-violet-700"
        >
          <BookOpen className="h-4 w-4 mr-1.5" />
          Presets
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 glass-card rounded-xl border-violet-200/50 shadow-xl"
        align="end"
        style={{ zIndex: 2000 }}
      >
        <div className="grid gap-px">
          {presets.map((preset, index) => (
            <button
              key={index}
              className={cn(
                'p-4 text-left rounded-lg transition-all duration-300 group hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40'
              )}
              onClick={() => onApplyPreset(preset.weights)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100/80 group-hover:bg-violet-200/80 transition-colors">
                    {preset.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-violet-700 transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 max-w-[180px]">
                      {preset.description}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-violet-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-violet-500 hover:text-violet-700 hover:bg-violet-50"
          >
            <Wand2 className="h-3 w-3 mr-2" />
            Create custom preset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WeightPresets;
