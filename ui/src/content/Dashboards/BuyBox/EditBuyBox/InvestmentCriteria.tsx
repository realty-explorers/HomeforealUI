import { Slider, Switch, Typography } from "@mui/material";
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
} from "react-hook-form";
import styles from "./EditBuyBoxDialog.module.scss";
import { RangeField } from "./RangeField";
import { buyboxSchemaType } from "./Schemas";

type InvestmentCriteriaProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
};
const InvestmentCriteria = (
  { register, control, watch }: InvestmentCriteriaProps,
) => {
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Investment Criteria
      </Typography>

      <div className="flex w-full item-center col-span-2">
        <Controller
          name={`opp.Limitations.0`}
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch
              {...field}
              checked={!!value}
            />
          )}
        />
        <Typography className={styles.label}>Limitations</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`opp.Limitations.1.ARV`}
        title="ARV"
        labelClass="pl-12"
      />

      <div className="flex w-full item-center col-span-2">
        <Controller
          name={`opp.Fix & Flip.0`}
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch
              {...field}
              checked={!!value}
            />
          )}
        />
        <Typography className={styles.label}>Fix & Flip</Typography>
      </div>
      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`opp.Fix & Flip.1.Margin`}
        title="Margin"
        labelClass="pl-12"
      />
      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`opp.Fix & Flip.1.Cents on $`}
        title="Cents on $"
        labelClass="pl-12"
      />

      <div className="flex w-full item-center col-span-2">
        <Controller
          name={`opp.Buy & Hold.0`}
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch
              {...field}
              checked={!!value}
            />
          )}
        />
        <Typography className={styles.label}>Buy & Hold</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`opp.Buy & Hold.1.Cap Rate`}
        title="Cap Rate"
        labelClass="pl-12"
      />
    </>
  );
};

export default InvestmentCriteria;
