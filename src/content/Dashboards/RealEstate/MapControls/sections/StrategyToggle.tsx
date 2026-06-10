import { TrendingUp, BarChart3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type StrategyMode = 'ARV' | 'Comps';

type StrategyToggleProps = {
  value: StrategyMode;
  onChange: (next: StrategyMode) => void;
};

const OPTIONS: Array<{
  value: StrategyMode;
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  // Tailwind classes applied when this option is selected. ARV uses
  // green (matches the original MUI #22c55e), Comps uses the primary
  // purple so the two strategies are visually distinct at a glance.
  activeClass: string;
}> = [
  {
    value: 'ARV',
    label: 'ARV',
    tooltip: 'Filter margin against estimated ARV',
    icon: TrendingUp,
    activeClass: 'bg-green-500 text-white shadow-sm'
  },
  {
    value: 'Comps',
    label: 'Comps',
    tooltip: 'Filter margin against sales comps',
    icon: BarChart3,
    activeClass: 'bg-primary text-white shadow-sm'
  }
];

const StrategyToggle = ({ value, onChange }: StrategyToggleProps) => {
  return (
    <div className="mb-4 flex w-full justify-center">
      <TooltipProvider delayDuration={500}>
        <div
          role="radiogroup"
          aria-label="Margin filter strategy"
          className="grid w-full max-w-[240px] grid-cols-2 gap-1 rounded-md bg-slate-100 p-1"
        >
          {OPTIONS.map((opt) => {
            const selected = value === opt.value;
            const Icon = opt.icon;
            return (
              <Tooltip key={opt.value}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(opt.value)}
                    className={cn(
                      'inline-flex h-7 items-center justify-center gap-1.5 rounded text-xs font-semibold transition-colors',
                      selected
                        ? opt.activeClass
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <Icon className="size-3.5" />
                    {opt.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{opt.tooltip}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default StrategyToggle;
