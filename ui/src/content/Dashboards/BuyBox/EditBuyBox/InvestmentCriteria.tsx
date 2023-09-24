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
        <Switch {...register("limitations")} />
        <Typography className={styles.label}>Limitations</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`arv`}
        title="ARV"
        labelClass="pl-12"
      />

      <div className="flex w-full item-center col-span-2">
        <Switch {...register("fixAndFlip")} />
        <Typography className={styles.label}>Fix & Flip</Typography>
      </div>
      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`margin`}
        title="Margin"
        labelClass="pl-12"
      />
      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`centsOnDollar`}
        title="Cents on $"
        labelClass="pl-12"
      />

      <div className="flex w-full item-center col-span-2">
        <Switch {...register("buyAndHold")} />
        <Typography className={styles.label}>Buy & Hold</Typography>
      </div>

      <RangeField
        register={register}
        control={control}
        watch={watch}
        fieldName={`capRate`}
        title="Cap Rate"
        labelClass="pl-12"
      />
    </>
  );
};

export default InvestmentCriteria;
