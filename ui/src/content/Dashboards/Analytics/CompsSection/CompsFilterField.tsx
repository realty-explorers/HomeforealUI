import { TextField } from "@mui/material";
import React from "react";
import styles from "./CompsSection.module.scss";

type CompsFilterFieldProps = {
  getValues: any;
  setValue: any;
  field: any;
};
const CompsFilterField = (
  { field, getValues, setValue }: CompsFilterFieldProps,
) => {
  const [values, setValues] = React.useState(getValues(field.fieldName));

  const handleNumberInputChangeMin = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues([e.target.valueAsNumber, values[1]]);
    setValue(`${field.fieldName}.0`, e.target.valueAsNumber);
  };

  const handleNumberInputChangeMax = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues([values[0], e.target.valueAsNumber]);
    setValue(`${field.fieldName}.1`, e.target.valueAsNumber);
  };

  return (
    <React.Fragment>
      <div className="flex justify-center items-center">
        <TextField
          type="number"
          variant="standard"
          className="w-24 flex justify-center text-center ml-4"
          onChange={handleNumberInputChangeMin}
          value={values?.[0] || 0}
          inputProps={{
            className: styles.compsFilterField,
            min: field.min,
            max: values?.[1] || field.max,
            step: field.step,
          }}
        />
      </div>
      <div className="flex justify-center items-center ml-4">
        <TextField
          type="number"
          variant="standard"
          className="w-24 flex justify-center text-center"
          onChange={handleNumberInputChangeMax}
          value={values?.[1] || 0}
          inputProps={{
            className: styles.compsFilterField,
            min: values?.[0] || field.min,
            max: field.max,
            step: field.step,
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default CompsFilterField;
