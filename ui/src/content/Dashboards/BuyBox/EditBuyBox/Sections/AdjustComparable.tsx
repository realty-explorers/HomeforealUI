import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { TextField, Typography } from "@mui/material";
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
import ComparablePreferences from "../ComparablePreferences";

type AdjustComparableProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const AdjustComparable = (
  { register, control, watch, setValue, getValues }: AdjustComparableProps,
) => {
  return (
    <div className={clsx(["grow flex flex-col pt-12 h-full"])}>
      <div className="h-full max-h-full overflow-y-auto">
        <Typography className={clsx([styles.header, ""])}>
          Homeforeal provides a unique CMA by categorizing comparables based on
          their similarity to the target property, with four ranks from best
          (green) to less great (red).
        </Typography>
        <div className="h-80 w-full">
          <div className="max-h-full w-full grid gap-2 grid-cols-[15rem_1.5fr] px-2 pt-4">
            <ComparablePreferences
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustComparable;
