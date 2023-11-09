import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import styles from "./CompsSection.module.scss";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import handleCallbackFactory from "@auth0/nextjs-auth0/dist/handlers/callback";
import NumericField from "@/components/Form/NumericField";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  },
);

const CustomTextField = (props: any) => {
  return (
    <TextField
      type="number"
      {...props}
      variant="standard"
      className="w-24 flex justify-center text-center ml-4"
    />
  );
};

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
    console.log(e.target.value);
    setValues([values[0], e.target.value]);
    setValue(`${field.fieldName}.1`, e.target.value);
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
          size="small"
          className="w-24 flex justify-center text-center"
          value={typeof values === "number" ? values : values?.[1]}
          onChange={handleNumberInputChangeMax}
          name="numberformat"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumericField as any,
            // startAdornment: prefix && (
            //   <InputAdornment position="start">{prefix}</InputAdornment>
            // ),
            // endAdornment: postfix && (
            //   <InputAdornment position="end">{postfix}</InputAdornment>
            // ),
          }}
          inputProps={{
            className: styles.compsFilterField,
            min: values?.[0] || field.min,
            max: field.max,
            step: field.step,
          }}
          variant="standard"
        />
      </div>
    </React.Fragment>
  );
};

export default CompsFilterField;
