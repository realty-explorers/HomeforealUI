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

type RangeFieldProps<T> = {
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
const RangeFieldV3 = <T extends Record<string, any>>({
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
}: RangeFieldProps<T>) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="w-full">
          {/* <TextField */}
          {/*   label="Min" */}
          {/*   size="small" */}
          {/*   value={value} */}
          {/*   onChange={(e) => { */}
          {/*     // const newMin = Math.max(min, Number(e.target.value)); */}
          {/*     onChange({ ...value }); */}
          {/*   }} */}
          {/*   error={!!error} */}
          {/*   InputProps={{ */}
          {/*     inputComponent: NumericField as any, */}
          {/*     inputProps: { min, max, formatLabelAsNumber }, */}
          {/*     startAdornment: prefix && ( */}
          {/*       <InputAdornment position="start">{prefix}</InputAdornment> */}
          {/*     ) */}
          {/*   }} */}
          {/*   disabled={disabled} */}
          {/* /> */}

          <StyledSlider
            valueLabelDisplay="auto"
            value={value}
            onChange={(_, newValue) => {
              // const [newMin, newMax] = newValue as [number, number];
              onChange({ ...value });
            }}
            min={min}
            max={max}
            disabled={disabled}
            className={className}
            // valueLabelFormat={(v) =>
            //   formatLabelAsNumber
            //     ? numberFormatter(`${prefix || ''}${v}${postfix || ''}`)
            //     : `${prefix || ''}${v}${postfix || ''}`
            // }
            {...props}
          />

          {/* <TextField */}
          {/*   label="Max" */}
          {/*   size="small" */}
          {/*   value={value.max} */}
          {/*   onChange={(e) => { */}
          {/*     const newMax = Math.min(max, Number(e.target.value)); */}
          {/*     onChange({ ...value, max: newMax }); */}
          {/*   }} */}
          {/*   error={!!error} */}
          {/*   InputProps={{ */}
          {/*     inputComponent: NumericField as any, */}
          {/*     inputProps: { min, max, formatLabelAsNumber }, */}
          {/*     endAdornment: postfix && ( */}
          {/*       <InputAdornment position="end">{postfix}</InputAdornment> */}
          {/*     ) */}
          {/*   }} */}
          {/*   disabled={disabled} */}
          {/* /> */}
        </div>
      )}
    />
  );
};

export default RangeFieldV3;
