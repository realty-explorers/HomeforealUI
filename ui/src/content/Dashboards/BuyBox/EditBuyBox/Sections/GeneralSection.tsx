import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { TextField, Typography } from "@mui/material";
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

type GeneralSectionProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
  errors: FieldErrors<buyboxSchemaType>;
};
const GeneralSection = (
  { register, control, watch, setValue, getValues, errors }:
    GeneralSectionProps,
) => {
  return (
    <div className={clsx(["flex justify-center px-4 pt-8 grow gap-x-4"])}>
      <div className="flex flex-col  h-full w-1/2">
        <Typography className={clsx([styles.header, "mb-12"])}>
          Let’s build your Buy Box preferences
        </Typography>

        <Typography className={clsx([styles.subheader, "mb-4"])}>
          Step 1: Choose your buy box name
        </Typography>

        <TextField
          label="BuyBox Name"
          variant="outlined"
          {...register("buybox_name")}
          className="mb-4"
          helperText={errors?.buybox_name?.message}
          error={!!errors?.buybox_name}
        />

        <Typography className={clsx([styles.subheader, "mb-4"])}>
          Please add important notes
        </Typography>
        <TextField
          label="Important Notes"
          placeholder="Important Notes"
          multiline
          rows={4}
          maxRows={4}
          {...register("description")}
          className="mb-4"
        />
      </div>
      <div className="flex w-1/2">
        <HelpOutlineOutlinedIcon className="text-gray-400" />
        <Typography className={styles.helper_text}>
          As an agent your investors have different preferences, help them to
          find what they are looking for.
        </Typography>
      </div>
    </div>
  );
};

export default GeneralSection;
