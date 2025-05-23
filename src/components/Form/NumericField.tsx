import { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  min: number;
  max: number;
  formatLabelAsNumber?: boolean;
}

const NumericField = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <>
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
          thousandSeparator={props.formatLabelAsNumber}
          allowNegative={true}
          min={props.min}
          max={props.max}
          valueIsNumericString
        />
      </>
    );
  },
);

export default NumericField;
