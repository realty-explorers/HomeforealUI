import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { numberFormatter } from '@/utils/converters';

type RangeFilterFieldProps = {
  min: number;
  max: number;
  step?: number;
  fieldName: string;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  prefix?: string;
  postfix?: string;
  formatLabelAsNumber?: boolean;
  disabled?: boolean;
  className?: string;
  mode?: 'range' | 'single';
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const safeNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const RangeFilterField: React.FC<RangeFilterFieldProps> = ({
  min,
  max,
  step = 1,
  fieldName,
  control,
  setValue,
  prefix,
  postfix,
  formatLabelAsNumber,
  disabled,
  className,
  mode = 'range'
}) => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : safeMin + 1;
  const hasRange = safeMax > safeMin;
  const effectiveMax = hasRange ? safeMax : safeMin + 1;
  const isDisabled = disabled || !hasRange;
  const isRangeMode = mode === 'range';

  const watched = useWatch({ control, name: fieldName });

  const values: number | number[] = React.useMemo(() => {
    if (isRangeMode) {
      if (Array.isArray(watched)) {
        return [
          safeNumber(watched[0], safeMin),
          safeNumber(watched[1], effectiveMax)
        ];
      }
      return [safeMin, effectiveMax];
    }
    if (typeof watched === 'number' && Number.isFinite(watched)) return watched;
    if (Array.isArray(watched)) return safeNumber(watched[0], effectiveMax);
    return effectiveMax;
  }, [watched, safeMin, effectiveMax, isRangeMode]);

  const commit = (next: number | number[]) => {
    setValue(fieldName, next, { shouldDirty: true });
  };

  const handleSlider = (next: number[]) => {
    if (Array.isArray(values)) {
      const a = next[0];
      const b = next[1] ?? next[0];
      commit([Math.min(a, b), Math.max(a, b)]);
    } else {
      commit(next[0]);
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: 'min' | 'max' | 'single'
  ) => {
    const cleaned = e.target.value.replace(/[^0-9.-]/g, '');
    const raw = Number(cleaned);
    if (!Number.isFinite(raw)) return;

    if (Array.isArray(values)) {
      if (position === 'min') {
        commit([clamp(raw, safeMin, values[1]), values[1]]);
      } else if (position === 'max') {
        commit([values[0], clamp(raw, values[0], effectiveMax)]);
      }
    } else {
      commit(clamp(raw, safeMin, effectiveMax));
    }
  };

  const isDual = isRangeMode && Array.isArray(values);
  const sliderValue = Array.isArray(values) ? values : [values as number];

  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      <SliderPrimitive.Root
        value={sliderValue}
        onValueChange={handleSlider}
        min={safeMin}
        max={effectiveMax}
        step={step}
        minStepsBetweenThumbs={isDual ? 1 : 0}
        disabled={isDisabled}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-zinc-200/80">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={`${fieldName} ${isDual ? 'minimum' : 'value'}`}
          className="block size-3.5 cursor-pointer rounded-full border border-primary/40 bg-white shadow-[0_1px_2px_rgba(89,13,130,0.18)] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isDual && (
          <SliderPrimitive.Thumb
            aria-label={`${fieldName} maximum`}
            className="block size-3.5 cursor-pointer rounded-full border border-primary/40 bg-white shadow-[0_1px_2px_rgba(89,13,130,0.18)] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      </SliderPrimitive.Root>

      <div className="flex items-center gap-2">
        <NumberInput
          label={isDual ? 'Min' : 'Max'}
          value={Array.isArray(values) ? values[0] : (values as number)}
          onChange={(e) =>
            handleInput(e, Array.isArray(values) ? 'min' : 'single')
          }
          prefix={prefix}
          postfix={postfix}
          formatLabelAsNumber={formatLabelAsNumber}
          disabled={isDisabled}
          ariaLabel={`${fieldName} minimum`}
        />
        {isDual && (
          <>
            <span
              aria-hidden
              className="h-px w-3 shrink-0 bg-zinc-200"
            />
            <NumberInput
              label="Max"
              value={(values as number[])[1]}
              onChange={(e) => handleInput(e, 'max')}
              prefix={prefix}
              postfix={postfix}
              formatLabelAsNumber={formatLabelAsNumber}
              disabled={isDisabled}
              ariaLabel={`${fieldName} maximum`}
            />
          </>
        )}
      </div>
    </div>
  );
};

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  postfix?: string;
  formatLabelAsNumber?: boolean;
  disabled?: boolean;
  ariaLabel: string;
};

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  prefix,
  postfix,
  formatLabelAsNumber,
  disabled,
  ariaLabel
}) => {
  const display = Number.isFinite(value)
    ? formatLabelAsNumber
      ? numberFormatter(value)
      : `${value}`
    : '—';

  return (
    <label
      className={cn(
        'group inline-flex h-8 flex-1 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-end gap-0.5">
        {prefix && (
          <span className="text-[11px] font-medium text-zinc-400">
            {prefix}
          </span>
        )}
        <input
          aria-label={ariaLabel}
          value={display}
          onChange={onChange}
          disabled={disabled}
          inputMode="decimal"
          className="w-full min-w-0 bg-transparent text-right text-xs font-semibold tabular-nums text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
        />
        {postfix && (
          <span className="text-[10px] font-medium text-zinc-400">
            {postfix}
          </span>
        )}
      </div>
    </label>
  );
};

export default RangeFilterField;
