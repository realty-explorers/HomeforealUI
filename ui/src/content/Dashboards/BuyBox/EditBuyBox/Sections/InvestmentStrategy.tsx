import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { Badge, Button, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "../EditBuyBoxDialog.module.scss";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useState } from "react";
import FixAndFlip from "./InvestmentTypes/FixAndFlip";
import BuyAndHold from "./InvestmentTypes/BuyAndHold";
import { getValue } from "@mui/system";

const investmentTypes = [
  { label: "Fix and Flip", value: "fix_and_flip" },
  {
    label: "Buy and Hold",
    value: "buy_and_hold",
    status: "Beta",
  },
  { label: "BRRR", value: "brrr", disabled: true, status: "Coming soon" },
  { label: "ADU", value: "adu", disabled: true, status: "Coming soon" },
  {
    label: "Short Term Rental",
    value: "short_term_rental",
    disabled: true,
    status: "Coming soon",
  },
];

type InvestmentStrategyProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
  errors: FieldErrors<buyboxSchemaType>;
};
const InvestmentStrategy = (
  { register, control, watch, setValue, getValues, errors }:
    InvestmentStrategyProps,
) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    getValues("opp.strategy"),
  );
  const handleSelectStrategy = (strategy: string) => {
    if (selectedStrategy !== "") {
      setValue(`opp.${selectedStrategy}.0`, false);
    }
    setValue(`opp.${strategy}.0`, true);
    setValue(`opp.strategy`, strategy);
    setSelectedStrategy(strategy);
  };
  return (
    <div
      className={clsx([
        "grid grid-cols-[auto_1fr] pt-8 gap-x-8 px-4",
        styles.font_poppins,
      ])}
    >
      <Typography className={clsx([styles.header, "col-span-2 mb-4"])}>
        Please choose your investor's strategy{" "}
        <span className="text-red-400">{errors?.opp?.strategy?.message}</span>
      </Typography>
      <div className="flex flex-col gap-y-4">
        {investmentTypes.map((type, index) => (
          <Badge
            key={index}
            badgeContent={type.status}
            color={type.status === "Beta" ? "primary" : "secondary"}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Button
              className={clsx([
                "text-gray-500 px-12 py-4 w-full",
                selectedStrategy === type.value
                  ? "ring ring-secondary"
                  : "ring-1 ring-gray-500 ",
              ])}
              disabled={type.disabled}
              onClick={() => handleSelectStrategy(type.value)}
            >
              {type.label}
            </Button>
          </Badge>
        ))}
      </div>
      <div>
        {selectedStrategy === "fix_and_flip" && (
          <FixAndFlip
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />
        )}

        {selectedStrategy === "buy_and_hold" && (
          <BuyAndHold
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />
        )}
      </div>
    </div>
  );
};

export default InvestmentStrategy;
