import Chip from "@/components/Chip";
import RangeField from "@/components/Form/RangeField";
import SwitchField from "@/components/Form/SwitchField";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { defaults } from "@/schemas/defaults";
import { Typography } from "@mui/material";
import clsx from "clsx";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "../../EditBuyBoxDialog.module.scss";

const field = {
  title: "Listing Price",
  fieldName: "property.Listing Price",
  type: "range",
  min: defaults.listingPrice.min,
  max: defaults.listingPrice.max,
  step: defaults.listingPrice.step,
  prefix: "$",
  formatLabelAsNumber: true,
};

const marginField = {
  title: "Margin",
  fieldName: "opp.fix_and_flip.1.margin",
  type: "range",
  min: defaults.margin.min,
  max: defaults.margin.max,
  step: defaults.margin.step,
  prefix: "%",
  formatLabelAsNumber: true,
};

const arvField = {
  title: "ARV",
  fieldName: "opp.fix_and_flip.1.arv",
  type: "range",
  min: defaults.arv.min,
  max: defaults.arv.max,
  step: defaults.arv.step,
  prefix: "%",
  formatLabelAsNumber: true,
};

type FixAndFlipProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const FixAndFlip = (
  { register, control, watch, setValue, getValues }: FixAndFlipProps,
) => {
  return (
    <div className="ml-16">
      <Typography className={styles.helper_text2}>
        <span className={styles.highlighted}>Fix and Flip</span>{" "}
        is a real estate strategy where investors buy rundown properties,
        renovate them, and sell for a profit.
      </Typography>
      <Typography className={clsx([styles.header2, "mt-2"])}>
        what is the purchase price range you’re looking for?
      </Typography>
      <div className={clsx(["flex my-4"])}>
        <RangeField
          min={field.min}
          max={field.max}
          step={field.step}
          prefix={field.prefix}
          postfix={field.postfix}
          formatLabelAsNumber={field.formatLabelAsNumber}
          fieldName={`${field.fieldName}.1`}
          setValue={setValue}
          getValues={getValues}
        />
      </div>
      <div className="flex items">
        <SwitchField
          fieldName={`${arvField.fieldName}.0`}
          control={control}
          // disabled={!watch(`${group.fieldName}`)}
        />
        <Typography className={styles.header2}>
          Choose the minimum desired margin between the listed price and
          comparable ARV
        </Typography>
      </div>

      <div className={clsx(["flex my-2"])}>
        <RangeField
          min={arvField.min}
          max={arvField.max}
          step={arvField.step}
          prefix={arvField.prefix}
          postfix={arvField.postfix}
          formatLabelAsNumber={arvField.formatLabelAsNumber}
          fieldName={`${arvField.fieldName}.1`}
          setValue={setValue}
          getValues={getValues}
          disabled={!watch(`${arvField.fieldName}.0`)}
        />
      </div>

      <div className="flex items-center">
        <SwitchField
          fieldName={`${marginField.fieldName}.0`}
          control={control}
          // disabled={!watch(`${group.fieldName}`)}
        />
        <Typography className={styles.header2}>
          Or choose by net profit margin (after estimated expenses){" "}
          <Chip
            background="var(--color-secondary)"
            color="white"
            label="Beta"
          />
        </Typography>
      </div>

      <div className={clsx(["flex my-2"])}>
        <RangeField
          min={marginField.min}
          max={marginField.max}
          step={marginField.step}
          prefix={marginField.prefix}
          postfix={marginField.postfix}
          formatLabelAsNumber={marginField.formatLabelAsNumber}
          fieldName={`${marginField.fieldName}.1`}
          setValue={setValue}
          getValues={getValues}
          disabled={!watch(`${marginField.fieldName}.0`)}
        />
      </div>
    </div>
  );
};

export default FixAndFlip;
