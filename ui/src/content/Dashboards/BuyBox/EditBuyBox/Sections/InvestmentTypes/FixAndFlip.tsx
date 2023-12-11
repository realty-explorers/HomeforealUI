import RangeField from "@/components/Form/RangeField";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
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
    <div>
      <Typography>
        Fix and flip is a real estate strategy where investors buy rundown
        properties, renovate them, and sell for a profit.
      </Typography>
      <Typography className={styles.header}>
        what is the purchase price range you’re looking for?
      </Typography>
      {/* <div className={clsx(["flex"])}> */}
      {/*   <RangeField */}
      {/*     min={field.min} */}
      {/*     max={field.max} */}
      {/*     step={field.step} */}
      {/*     prefix={field.prefix} */}
      {/*     postfix={field.postfix} */}
      {/*     fieldName={`${field.fieldName}.1`} */}
      {/*     setValue={setValue} */}
      {/*     getValues={getValues} */}
      {/*     formatLabelAsNumber={field.formatLabelAsNumber} */}
      {/*     disabled={!watch(`${group.fieldName}`) || */}
      {/*       !watch(`${field.fieldName}.0`)} */}
      {/*   /> */}
      {/* </div> */}
    </div>
  );
};

export default FixAndFlip;
