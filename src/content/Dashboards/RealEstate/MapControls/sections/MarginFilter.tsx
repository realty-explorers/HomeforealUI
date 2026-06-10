import SliderField from '../SliderField';
import FilterSlider from './FilterSlider';
import type { StrategyMode } from './StrategyToggle';

type MarginFilterProps = {
  mode: StrategyMode;
  value: number;
  onChange: (value: number) => void;
};

// Min-margin filter — ARV vs sales-comps differ only in label/tooltip.
const MarginFilter = ({ mode, value, onChange }: MarginFilterProps) => {
  const isArv = mode === 'ARV';
  return (
    <SliderField
      fieldName={isArv ? 'Min ARV Margin %' : 'Min Sales Comps Margin %'}
      tooltip={
        isArv
          ? 'Percentage under estimated market ARV'
          : 'Percentage under market sales comps'
      }
    >
      <FilterSlider
        mode="single"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
        format={(v) => `${v}%`}
      />
    </SliderField>
  );
};

export default MarginFilter;
