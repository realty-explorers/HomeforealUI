import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';
import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller, Path } from 'react-hook-form';

type AutocompleteFieldProps<T> = {
  label: string;
  options: string[];
  multiple: boolean;
  control: Control<T>;
  fieldName: Path<T>;
  disabled?: boolean;
  className?: string;
};

const AutocompleteField = <T extends Record<string, any>>({
  label,
  options,
  multiple,
  control,
  fieldName,
  disabled,
  className
}: AutocompleteFieldProps<T>) => {
  const getUniqueOptions = (options: string[]) => {
    const optionLabels = new Set();
    const uniqueOptions: string[] = [];
    for (const option of options) {
      if (!optionLabels.has(option)) {
        optionLabels.add(option);
        uniqueOptions.push(option);
      }
    }
    return uniqueOptions;
  };

  const uniqueOptions = getUniqueOptions(options);

  return (
    <div className="grid w-full gap-x-4 items-center">
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Autocomplete
            multiple={multiple}
            id="tags-outlined"
            options={uniqueOptions}
            getOptionLabel={(option: string) => String(option)}
            filterSelectedOptions
            value={value ?? (multiple ? [] : null)}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label={label}
                placeholder={label}
                error={!!error}
                helperText={error?.message}
              />
            )}
            disabled={disabled}
            className={className}
          />
        )}
      />
    </div>
  );
};

export default AutocompleteField;
