import { Autocomplete, TextField } from "@mui/material";
import clsx from "clsx";
import React, { useState } from "react";

type AutocompleteFieldProps = {
  label: string;
  options: string[];
  multiple: boolean;
  setValue: any;
  getValues: any;
  fieldName: string;
  disabled?: boolean;
  className?: string;
};

const AutocompleteField = (
  {
    label,
    options,
    multiple,
    setValue,
    getValues,
    fieldName,
    disabled,
    className,
  }: AutocompleteFieldProps,
) => {
  const [values, setValues] = React.useState(getValues(fieldName));
  const handleOptionChanged = (event: any, value: any) => {
    setValues(value);
    setValue(fieldName, value);
  };

  const getUniqueOptions = (options: string[]) => {
    const optionLabels = new Set();
    const uniqueOptions = [];
    for (const option of options) {
      if (!optionLabels.has(option)) {
        optionLabels.add(option);
        uniqueOptions.push(option);
      }
    }
    return uniqueOptions;
  };
  return (
    <div className="grid w-full gap-x-4 items-center">
      <Autocomplete
        multiple={multiple}
        id="tags-outlined"
        // options={[{ label: "All", value: "all" }]}
        options={getUniqueOptions(options)}
        getOptionLabel={(option: string) => String(option)}
        filterSelectedOptions
        defaultValue={values}
        // filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            fullWidth
            label={label}
            placeholder={label}
          />
        )}
        onChange={handleOptionChanged}
        disabled={disabled}
      />
    </div>
  );
};

export default AutocompleteField;
