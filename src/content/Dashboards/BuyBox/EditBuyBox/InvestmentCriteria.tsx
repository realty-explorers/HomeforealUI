import { Slider, Switch, Typography } from "@mui/material";
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "./EditBuyBoxDialog.module.scss";
import RangeField from "@/components/Form/RangeField";
import { defaults } from "@/schemas/defaults";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import React from "react";
import SwitchField from "@/components/Form/SwitchField";
import SliderField from "@/components/Form/SliderField";
import clsx from "clsx";
import NumericTextField from "@/components/Form/NumericTextField";

const groups = [
  {
    group: "Limitations",
    fieldName: "opp.Limitations.0",
    fields: [
      {
        title: "ARV",
        fieldName: "opp.Limitations.1.ARV",
        type: "range",
        min: defaults.arv.min,
        max: defaults.arv.max,
        step: defaults.arv.step,
        prefix: "$",
        formatLabelAsNumber: true,
      },
    ],
  },
  {
    group: "Fix & Flip",
    fieldName: "opp.Fix & Flip.0",
    fields: [
      {
        title: "Margin",
        fieldName: "opp.Fix & Flip.1.Margin",
        type: "range",
        min: defaults.margin.min,
        max: defaults.margin.max,
        step: defaults.margin.step,
        prefix: "$",
        formatLabelAsNumber: true,
      },
      {
        title: "Cents on $",
        fieldName: "opp.Fix & Flip.1.CentsOnDollar",
        type: "range",
        min: defaults.centOnDollar.min,
        max: defaults.centOnDollar.max,
        step: defaults.centOnDollar.step,
        prefix: "$",
      },
    ],
  },
  {
    group: "Buy & Hold",
    fieldName: "opp.Buy & Hold.0",
    fields: [
      {
        title: "Cap Rate",
        fieldName: "opp.Buy & Hold.1.Cap Rate",
        type: "range",
        min: defaults.capRate.min,
        max: defaults.capRate.max,
        step: defaults.capRate.step,
        postfix: "%",
      },
    ],
  },
];

type InvestmentCriteriaProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const InvestmentCriteria = (
  { register, control, watch, setValue, getValues }: InvestmentCriteriaProps,
) => {
  return (
    <>
      <Typography className={styles.sectionLabel}>
        Investment Criteria
      </Typography>
      {groups.map((group, index) => {
        return (
          <React.Fragment key={index}>
            <div className="flex w-full item-center col-span-2">
              <Controller
                name={group.fieldName}
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Switch
                    {...field}
                    checked={!!value}
                  />
                )}
              />
              <Typography className={styles.label}>{group.group}</Typography>
            </div>
            {group.fields.map((field, index) => {
              if (field.type === "boolean") {
                return <p key={index}>hi</p>;
              } else if (field.type === "range") {
                return (
                  <>
                    <div
                      className={clsx([
                        "flex w-full item-center pl-12",
                      ])}
                    >
                      <SwitchField
                        fieldName={`${field.fieldName}.0`}
                        control={control}
                        disabled={!watch(`${group.fieldName}`)}
                      />
                      <Typography className={styles.label}>
                        {field.title}
                      </Typography>
                    </div>
                    <div className={clsx(["flex"])}>
                      <RangeField
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        prefix={field.prefix}
                        postfix={field.postfix}
                        fieldName={`${field.fieldName}.1`}
                        setValue={setValue}
                        getValues={getValues}
                        formatLabelAsNumber={field.formatLabelAsNumber}
                        disabled={!watch(`${group.fieldName}`) ||
                          !watch(`${field.fieldName}.0`)}
                      />
                      {/* <NumericTextField */}
                      {/*   min={field.min} */}
                      {/*   max={field.max} */}
                      {/*   fieldName={`${field.fieldName}.1.0`} */}
                      {/*   control={control} */}
                      {/*   watch={watch} */}
                      {/*   setValue={setValue} */}
                      {/*   disabled={!watch(`${group.fieldName}`) || */}
                      {/*     !watch(`${field.fieldName}.0`)} */}
                      {/* /> */}
                      {/* <SliderField */}
                      {/*   min={field.min} */}
                      {/*   max={field.max} */}
                      {/*   step={field.step} */}
                      {/*   fieldName={`${field.fieldName}.1`} */}
                      {/*   control={control} */}
                      {/*   // disabled={!watch(`${field.fieldName}.0`)} */}
                      {/*   disabled={!watch(`${group.fieldName}`) || */}
                      {/*     !watch(`${field.fieldName}.0`)} */}
                      {/* /> */}
                    </div>
                  </>
                );
              }
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default InvestmentCriteria;
