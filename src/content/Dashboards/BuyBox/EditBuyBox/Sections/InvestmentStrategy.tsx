import { BuyBoxStrategyType } from '@/schemas/BuyBoxSchemas';
import { Badge, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../EditBuyBoxDialog.module.scss';
import FixAndFlip from './InvestmentTypes/FixAndFlip';
import BuyAndHold from './InvestmentTypes/BuyAndHold';
import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';

const investmentTypes = [
  {
    label: 'Fix and Flip',
    value: 'fixAndFlip',
    strategyType: 'FIX_AND_FLIP' as BuyBoxStrategyType
  },
  {
    label: 'Multifamily',
    value: 'multifamily',
    strategyType: 'MULTIFAMILY' as BuyBoxStrategyType,
    status: 'New'
  },
  {
    label: 'Buy and Hold',
    value: 'buyAndHold',
    strategyType: 'BUY_AND_HOLD' as BuyBoxStrategyType,
    disabled: true,
    status: 'Coming Soon'
  },
  { label: 'BRRR', value: 'brrr', disabled: true, status: 'Coming soon' },
  { label: 'ADU', value: 'adu', disabled: true, status: 'Coming soon' },
  {
    label: 'Short Term Rental',
    value: 'shortTermRental',
    disabled: true,
    status: 'Coming soon'
  }
];

type InvestmentStrategyProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
  errors: FieldErrors<BuyBoxFormData>;
};
const InvestmentStrategy = ({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors
}: InvestmentStrategyProps) => {
  const selectedStrategy =
    watch('strategy.strategyType') || ('FIX_AND_FLIP' as BuyBoxStrategyType);

  const handleSelectStrategy = (strategyType?: BuyBoxStrategyType) => {
    if (!strategyType) return;
    setValue('strategy.strategyType', strategyType, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <div
      className={clsx([
        'flex flex-col lg:grid lg:grid-cols-[auto_1fr] pt-8 gap-x-8 px-4 gap-y-8',
        styles.fontPoppins
      ])}
    >
      <Typography className={clsx([styles.header, 'col-span-2 mb-4'])}>
        Please choose your investor's strategy{' '}
        <span className="text-red-400">
          {errors?.strategy?.message?.toString()}
        </span>
      </Typography>
      <div className="flex md:flex-col gap-y-4 gap-x-8 flex-wrap justify-center md:justify-start self-start">
        {investmentTypes.map((type, index) => (
          <Badge
            key={index}
            badgeContent={type.status}
            color={type.status === 'Beta' ? 'primary' : 'secondary'}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Button
              className={clsx([
                'text-gray-500 px-12 py-4 w-full',
                selectedStrategy === type.strategyType
                  ? 'ring ring-secondary'
                  : 'ring-1 ring-gray-500 '
              ])}
              disabled={type.disabled}
              onClick={() => handleSelectStrategy(type.strategyType)}
            >
              {type.label}
            </Button>
          </Badge>
        ))}
      </div>
      <div>
        {selectedStrategy === 'FIX_AND_FLIP' && (
          <FixAndFlip
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />
        )}

        {selectedStrategy === 'MULTIFAMILY' && (
          <MultifamilyTabsSkeleton
            title="Strategy"
            description="Choose what kind of deals should rise to the top."
            tabs={['Strategy']}
          />
        )}

        {selectedStrategy === 'BUY_AND_HOLD' && (
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
