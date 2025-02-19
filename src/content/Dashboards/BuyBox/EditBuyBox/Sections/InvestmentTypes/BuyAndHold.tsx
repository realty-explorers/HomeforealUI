import RangeField from '@/components/Form/RangeField';
import SwitchField from '@/components/Form/SwitchField';
import { buyboxSchemaType } from '@/schemas/BuyBoxSchemas';
import { defaults } from '@/schemas/defaults';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../EditBuyBoxDialog.module.scss';

const grossYieldField = {
  title: 'Gross Yield',
  fieldName: 'opp.buyAndHold.1.grossYield',
  type: 'range',
  min: defaults.grossYield.min,
  max: defaults.grossYield.max,
  step: defaults.grossYield.step,
  postfix: '%'
};

const capRateField = {
  title: 'Cap Rate',
  fieldName: 'opp.buyAndHold.1.capRate',
  type: 'range',
  min: defaults.capRate.min,
  max: defaults.capRate.max,
  step: defaults.capRate.step,
  postfix: '%'
};

type BuyAndHoldProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const BuyAndHold = ({
  register,
  control,
  watch,
  setValue,
  getValues
}: BuyAndHoldProps) => {
  return (
    <div className="ml-16">
      <Typography className={styles.helperText2}>
        <span className={styles.highlighted}>Buy and Hold</span> is a strategy
        where investors purchase properties and retain them for the long term to
        generate rental income
      </Typography>
      {/* <div className="flex items mt-8"> */}
      {/*   <SwitchField */}
      {/*     fieldName={`${grossYieldField.fieldName}.0`} */}
      {/*     control={control} */}
      {/*     // disabled={!watch(`${group.fieldName}`)} */}
      {/*   /> */}
      {/*   <Typography className={styles.header2}> */}
      {/*     Choose the minimum Gross Yield you are expecting to get from your */}
      {/*     investment */}
      {/*   </Typography> */}
      {/* </div> */}
      {/**/}
      {/* <div className={clsx(["flex my-4"])}> */}
      {/*   <RangeField */}
      {/*     min={grossYieldField.min} */}
      {/*     max={grossYieldField.max} */}
      {/*     step={grossYieldField.step} */}
      {/*     prefix={grossYieldField.prefix} */}
      {/*     postfix={grossYieldField.postfix} */}
      {/*     formatLabelAsNumber={grossYieldField.formatLabelAsNumber} */}
      {/*     fieldName={`${grossYieldField.fieldName}.1`} */}
      {/*     setValue={setValue} */}
      {/*     getValues={getValues} */}
      {/*     disabled={!watch(`${grossYieldField.fieldName}.0`)} */}
      {/*   /> */}
      {/* </div> */}

      <div className="flex items-center mt-8">
        <SwitchField
          fieldName={`${capRateField.fieldName}.0`}
          control={control}
          // disabled={!watch(`${group.fieldName}`)}
        />
        <Typography className={styles.header2}>
          Choose minimum Cap Rate (after opertaing expenses)
        </Typography>
      </div>

      <div className={clsx(['flex my-4'])}>
        <RangeField
          min={capRateField.min}
          max={capRateField.max}
          step={capRateField.step}
          prefix={capRateField.prefix}
          postfix={capRateField.postfix}
          formatLabelAsNumber={capRateField.formatLabelAsNumber}
          fieldName={`${capRateField.fieldName}.1`}
          setValue={setValue}
          getValues={getValues}
          disabled={!watch(`${capRateField.fieldName}.0`)}
        />
      </div>
    </div>
  );
};

export default BuyAndHold;
