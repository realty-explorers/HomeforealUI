import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { Badge, Button, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "../EditBuyBoxDialog.module.scss";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useState } from "react";
import FixAndFlip from "./InvestmentTypes/FixAndFlip";

const investmentTypes = [
  { label: "Buy and Hold", value: "buy_and_hold" },
  { label: "Fix and Flip", value: "fix_and_flip" },
  { label: "BRRR", value: "brrr", disabled: true },
  { label: "ADU", value: "adu", disabled: true },
  { label: "Short Term Rental", value: "short_term_rental", disabled: true },
];

type InvestmentStrategyProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const InvestmentStrategy = (
  { register, control, watch, setValue, getValues }: InvestmentStrategyProps,
) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const handleSelectStrategy = (strategy: string) => {
    setSelectedStrategy(strategy);
  };
  return (
    <div
      className={clsx([
        "grid grid-cols-[auto_1fr] pt-12 gap-x-8",
        styles.font_poppins,
      ])}
    >
      <Typography className={clsx([styles.header, "col-span-2 mb-4"])}>
        Please choose your investor's strategy
      </Typography>
      <div className="flex flex-col gap-y-4">
        {investmentTypes.map((type, index) => (
          <Badge
            key={index}
            badgeContent={type.disabled ? "Coming Soon" : ""}
            color={type.disabled && "primary"}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Button
              className={clsx([
                "text-gray-500 px-16 py-4 w-full",
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
      </div>
    </div>
  );
};

export default InvestmentStrategy;
