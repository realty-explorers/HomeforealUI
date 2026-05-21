import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Scale = {
  scale: (n: number) => number;
  reverseScale: (n: number) => number;
};

type RangeProps = {
  mode: 'range';
  value: number[];
  onChange: (next: number[]) => void;
};

type SingleProps = {
  mode: 'single';
  value: number;
  onChange: (next: number) => void;
};

type FilterSliderProps = (RangeProps | SingleProps) & {
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  scale?: Scale;
  className?: string;
};

const defaultFormat = (value: number) => `${value}`;

const FilterSlider: React.FC<FilterSliderProps> = (props) => {
  const { min, max, step = 1, format = defaultFormat, scale, className } = props;
  const isRange = props.mode === 'range';

  const toRaw = (actual: number) =>
    scale ? scale.reverseScale(actual) : actual;
  const fromRaw = (raw: number) => (scale ? scale.scale(raw) : raw);

  const rawValue = isRange
    ? [toRaw(props.value[0]), toRaw(props.value[1])]
    : [toRaw(props.value)];

  const handleSlider = (next: number[]) => {
    if (isRange) {
      const a = next[0];
      const b = next[1] ?? next[0];
      props.onChange([fromRaw(Math.min(a, b)), fromRaw(Math.max(a, b))]);
    } else {
      (props as SingleProps).onChange(fromRaw(next[0]));
    }
  };

  // Tracks which thumb is being actively dragged (0 = first, 1 = second
  // in range mode). Radix Tooltip closes on pointerdown by default, so
  // we override `open` while a drag is in progress and let Radix manage
  // hover/focus the rest of the time.
  const [draggingThumb, setDraggingThumb] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (draggingThumb === null) return;
    const onUp = () => setDraggingThumb(null);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [draggingThumb]);

  return (
    <TooltipProvider delayDuration={0}>
      <SliderPrimitive.Root
        value={rawValue}
        onValueChange={handleSlider}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={isRange ? 1 : 0}
        className={cn(
          'relative flex h-5 w-full touch-none select-none items-center',
          className
        )}
      >
        <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-zinc-200/80">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <Thumb
          ariaLabel={isRange ? 'Minimum' : 'Value'}
          label={format(isRange ? props.value[0] : (props as SingleProps).value)}
          forceOpen={draggingThumb === 0}
          onPointerDown={() => setDraggingThumb(0)}
        />
        {isRange && (
          <Thumb
            ariaLabel="Maximum"
            label={format(props.value[1])}
            forceOpen={draggingThumb === 1}
            onPointerDown={() => setDraggingThumb(1)}
          />
        )}
      </SliderPrimitive.Root>
    </TooltipProvider>
  );
};

type ThumbProps = {
  ariaLabel: string;
  label: string;
  // While true, the tooltip is forced open regardless of hover/focus —
  // used during an active drag where Radix would otherwise close on
  // pointerdown. When false, falls back to undefined (uncontrolled).
  forceOpen: boolean;
  onPointerDown: () => void;
};

const Thumb: React.FC<ThumbProps> = ({
  ariaLabel,
  label,
  forceOpen,
  onPointerDown
}) => (
  <Tooltip open={forceOpen || undefined}>
    <TooltipTrigger asChild>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        className="block size-3.5 cursor-pointer rounded-full border border-primary/40 bg-white shadow-[0_1px_2px_rgba(89,13,130,0.18)] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
      />
    </TooltipTrigger>
    <TooltipContent
      side="top"
      sideOffset={8}
      className="bg-slate-900 text-white font-semibold tabular-nums px-2 py-1"
    >
      {label}
      {/* Down-pointing arrow rendered via the Radix primitive (shadcn's
          TooltipContent wrapper doesn't include it). Fill matches the
          tooltip background. */}
      <TooltipPrimitive.Arrow className="fill-slate-900" width={10} height={5} />
    </TooltipContent>
  </Tooltip>
);

export default FilterSlider;
