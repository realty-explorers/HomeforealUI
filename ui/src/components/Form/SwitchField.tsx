import { Slider, Switch, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Control, Controller, Path } from 'react-hook-form';

type RangeFieldProps<T> = {
  fieldName: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  className?: string;
};

const SwitchField = <T extends Record<string, any>>({
  control,
  fieldName,
  disabled,
  className
}: RangeFieldProps<T>) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { value, ...field } }) => (
        <Switch
          {...field}
          checked={!!value}
          disabled={disabled}
          className={className}
        />
      )}
    />
  );
};

export default SwitchField;
