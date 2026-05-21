import SliderField from '../SliderField';
import FilterSlider from './FilterSlider';

type Scale = {
  scale: (value: number) => number;
  reverseScale: (value: number) => number;
};

type RangeFilterRowProps = {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number[];
  format?: (value: number) => string;
  scale?: Scale;
  tooltip?: string;
  onChange: (next: number[]) => void;
};

// Generic min/max range filter row — one component replaces four
// near-identical blocks. Wraps FilterSlider in a labeled SliderField.
const RangeFilterRow = ({
  label,
  min,
  max,
  step,
  value,
  format,
  scale,
  tooltip,
  onChange
}: RangeFilterRowProps) => {
  return (
    <SliderField fieldName={label} tooltip={tooltip}>
      <FilterSlider
        mode="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        format={format}
        scale={scale}
      />
    </SliderField>
  );
};

export default RangeFilterRow;
