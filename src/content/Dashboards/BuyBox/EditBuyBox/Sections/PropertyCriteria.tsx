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
import InvestmentCriteria from "../ComparablePreferences";
import PropertyCriteriaFields from "../PropertyCriteriaFields";

type PropertyCriteriaProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const PropertyCriteria = (
  { register, control, watch, setValue, getValues }: PropertyCriteriaProps,
) => {
  return (
    <div className={clsx(["grow flex flex-col pt-8 h-full px-4"])}>
      <div className="h-full max-h-full overflow-y-auto">
        <Typography className={clsx([styles.header, "mb-4"])}>
          Choose the criteria you're looking for in your properties
        </Typography>
        <div className="h-80 w-full">
          <div className="max-h-full w-full grid gap-2 grid-cols-[15rem_1.5fr] px-8 pt-4">
            <PropertyCriteriaFields
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

export default PropertyCriteria;
