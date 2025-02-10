import Chip from '@/components/Chip';
import RangeField from '@/components/Form/RangeField';
import RangeFieldV2 from '@/components/Form/RangeFieldV2';
import SingleRangeField from '@/components/Form/SingleRangeField';
import SwitchField from '@/components/Form/SwitchField';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';
import { defaults } from '@/schemas/defaults';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  Path,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../EditBuyBoxDialog.module.scss';

const field = {
  title: 'Listing Price',
  fieldName: 'property_criteria.price' as Path<BuyBoxFormData>,
  type: 'range',
  min: defaults.listingPrice.min,
  max: defaults.listingPrice.max,
  step: defaults.listingPrice.step,
  prefix: '$',
  formatLabelAsNumber: true
};

const marginField = {
  title: 'Margin',
  fieldName: 'strategy.min_margin' as Path<BuyBoxFormData>,
  type: 'range',
  min: defaults.margin.min,
  max: defaults.margin.max,
  step: defaults.margin.step,
  prefix: '%',
  formatLabelAsNumber: true
};

const arvField = {
  title: 'ARV',
  fieldName: 'strategy.min_arv' as Path<BuyBoxFormData>,
  type: 'range',
  min: defaults.arv.min,
  max: defaults.arv.max,
  step: defaults.arv.step,
  prefix: '%',
  formatLabelAsNumber: true
};

type FixAndFlipProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
};
const FixAndFlip = ({
  register,
  control,
  watch,
  setValue,
  getValues
}: FixAndFlipProps) => {
  return (
    <div className="ml-16">
      <Typography className={styles.helper_text2}>
        <span className={styles.highlighted}>Fix and Flip</span> is a real
        estate strategy where investors buy rundown properties, renovate them,
        and sell for a profit.
      </Typography>
      <Typography className={clsx([styles.header2, 'mt-2'])}>
        what is the purchase price range you’re looking for?
      </Typography>
      <div className={clsx(['flex my-4'])}>
        <RangeFieldV2
          min={field.min}
          max={field.max}
          step={field.step}
          prefix={field.prefix}
          formatLabelAsNumber={field.formatLabelAsNumber}
          fieldName={`property_criteria.price`}
          control={control}
        />

        {/* <RangeField */}
        {/*   min={field.min} */}
        {/*   max={field.max} */}
        {/*   step={field.step} */}
        {/*   prefix={field.prefix} */}
        {/*   // postfix={field.postfix} */}
        {/*   formatLabelAsNumber={field.formatLabelAsNumber} */}
        {/*   fieldName={`${field.fieldName}`} */}
        {/*   setValue={setValue} */}
        {/*   getValues={getValues} */}
        {/* /> */}
      </div>
      <div className="flex items">
        <SwitchField
          fieldName={`${arvField.fieldName}.enabled`}
          control={control}
          // disabled={!watch(`${group.fieldName}`)}
        />
        <Typography className={styles.header2}>
          Choose the minimum desired margin between the listed price and
          comparable ARV
        </Typography>
      </div>

      <div className={clsx(['flex my-2'])}>
        <SingleRangeField
          min={arvField.min}
          max={arvField.max}
          step={arvField.step}
          prefix={arvField.prefix}
          formatLabelAsNumber={arvField.formatLabelAsNumber}
          fieldName={`${arvField.fieldName}`}
          control={control}
          disabled={
            !watch(`${arvField.fieldName}.enabled` as Path<BuyBoxFormData>)
          }
        />
      </div>

      <div className="flex items-center">
        <SwitchField
          fieldName={`${marginField.fieldName}.enabled`}
          control={control}
          // disabled={!watch(`${group.fieldName}`)}
        />
        <Typography className={styles.header2}>
          Or choose by net profit margin (after estimated expenses){' '}
          <Chip
            background="var(--color-secondary)"
            color="white"
            label="Beta"
          />
        </Typography>
      </div>

      <div className={clsx(['flex my-2'])}>
        <SingleRangeField
          min={marginField.min}
          max={marginField.max}
          step={marginField.step}
          prefix={marginField.prefix}
          formatLabelAsNumber={marginField.formatLabelAsNumber}
          fieldName={`${marginField.fieldName}`}
          control={control}
          disabled={
            !watch(`${marginField.fieldName}.enabled` as Path<BuyBoxFormData>)
          }
        />
      </div>
    </div>
  );
};

export default FixAndFlip;
