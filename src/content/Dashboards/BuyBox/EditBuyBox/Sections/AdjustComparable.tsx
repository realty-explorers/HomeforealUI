import { buyboxSchemaType } from '@/schemas/BuyBoxSchemas';
import { TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../EditBuyBoxDialog.module.scss';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ComparablePreferences from '../ComparablePreferences';
import SimilarityChart from '../SimilarityChart';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';

type AdjustComparableProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
};
const AdjustComparable = ({
  register,
  control,
  watch,
  setValue,
  getValues
}: AdjustComparableProps) => {
  return (
    <div className={clsx(['grow flex flex-col pt-8 h-full px-4'])}>
      <div className="h-full max-h-full overflow-y-auto">
        <Typography className={clsx([styles.header, 'mb-4'])}>
          Homeforeal provides a unique CMA by categorizing comparables based on
          their similarity to the target property, with four ranks from best
          (green) to less great (red).
        </Typography>
        <div className="h-80 w-full pr-2">
          <div className="w-full grid gap-2 grid-cols-[15rem_1.5fr] px-8 pt-4">
            <ComparablePreferences
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />
          </div>

          <div>
            {/* TODO: Add SimilarityChart */}
            <SimilarityChart
              register={register}
              control={control}
              watch={watch}
              getValues={getValues}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustComparable;
