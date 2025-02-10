import { numberFormatter } from '@/utils/converters';
import {
  InputAdornment,
  Slider,
  SliderProps,
  styled,
  TextField
} from '@mui/material';
import { Control, Controller, Path } from 'react-hook-form';
import NumericField from './NumericField';

const StyledSlider = styled(Slider)({
  '& .MuiSlider-valueLabel': {
    borderRadius: '2rem',
    backgroundColor: '#223354',
    fontFamily: 'var(--font-poppins)',
    fontWeight: 600
  }
});

type SingleRangeFieldProps<T> = {
  min: number;
  max: number;
  fieldName: Path<T>;
  control: Control<T>;
  prefix?: string;
  postfix?: string;
  disabled?: boolean;
  formatLabelAsNumber?: boolean;
  className?: string;
} & SliderProps;
const SingleRangeField = <T extends Record<string, any>>({
  min,
  max,
  fieldName,
  control, // Replace setValue/getValues with control
  prefix,
  postfix,
  disabled,
  formatLabelAsNumber,
  className,
  ...props
}: SingleRangeFieldProps<T>) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="grid grid-cols-[1fr_3fr_1fr] w-full gap-x-4 items-center">
          <TextField
            label="Min"
            size="small"
            value={value.value}
            onChange={(e) => {
              const newValue = Math.max(min, Number(e.target.value));
              onChange({ ...value, value: newValue });
            }}
            error={!!error}
            InputProps={{
              inputComponent: NumericField as any,
              inputProps: { min, max, formatLabelAsNumber },
              startAdornment: prefix && (
                <InputAdornment position="start">{prefix}</InputAdornment>
              )
            }}
            disabled={disabled}
          />

          <StyledSlider
            valueLabelDisplay="auto"
            value={value.value}
            onChange={(_, newValue) => {
              onChange({
                ...value,
                value: newValue as number
              });
            }}
            min={min}
            max={max}
            disabled={disabled}
            className={className}
            valueLabelFormat={(v) =>
              formatLabelAsNumber
                ? numberFormatter(`${prefix || ''}${v}${postfix || ''}`)
                : `${prefix || ''}${v}${postfix || ''}`
            }
            {...props}
          />
        </div>
      )}
    />
  );
};

export default SingleRangeField;
