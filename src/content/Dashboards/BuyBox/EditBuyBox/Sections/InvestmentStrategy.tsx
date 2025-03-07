import { buyboxSchemaType } from '@/schemas/BuyBoxSchemas';
import { Badge, Button, TextField, Typography } from '@mui/material';
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
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useState } from 'react';
import FixAndFlip from './InvestmentTypes/FixAndFlip';
import BuyAndHold from './InvestmentTypes/BuyAndHold';
import { getValue } from '@mui/system';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';

const investmentTypes = [
  { label: 'Fix and Flip', value: 'fixAndFlip' },
  {
    label: 'Buy and Hold',
    value: 'buyAndHold',
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
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    // getValues('opp.strategy') TODO: Need to add strategy selection
    'fixAndFlip'
  );
  // const handleSelectStrategy = (strategy: string) => {
  //   if (selectedStrategy !== '') {
  //     setValue(`opp.${selectedStrategy}.0`, false, { shouldDirty: true });
  //   }
  //   setValue(`opp.${strategy}.0`, true, { shouldDirty: true });
  //   setValue(`opp.strategy`, strategy, { shouldDirty: true });
  //   setSelectedStrategy(strategy);
  // };
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
      <div className="flex md:flex-col gap-y-4 gap-x-8 flex-wrap justify-center">
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
            {/* TODO: Need to add strategy selection */}
            {/* <Button */}
            {/*   className={clsx([ */}
            {/*     'text-gray-500 px-12 py-4 w-full', */}
            {/*     selectedStrategy === type.value */}
            {/*       ? 'ring ring-secondary' */}
            {/*       : 'ring-1 ring-gray-500 ' */}
            {/*   ])} */}
            {/*   disabled={type.disabled} */}
            {/*   onClick={() => handleSelectStrategy(type.value)} */}
            {/* > */}
            {/*   {type.label} */}
            {/* </Button> */}

            <Button
              className={clsx([
                'text-gray-500 px-12 py-4 w-full',
                'fixAndFlip' === type.value
                  ? 'ring ring-secondary'
                  : 'ring-1 ring-gray-500 '
              ])}
              disabled={type.disabled}
              // onClick={() => handleSelectStrategy(type.value)}
            >
              {type.label}
            </Button>
          </Badge>
        ))}
      </div>
      <div>
        {selectedStrategy === 'fixAndFlip' && (
          <FixAndFlip
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
          />
        )}

        {selectedStrategy === 'buyAndHold' && (
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
