import AutocompleteField from '@/components/Form/AutocompleteField';
import SwitchField from '@/components/Form/SwitchField';
import { OfferSchemaType } from '@/schemas/OfferSchemas';
import { TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../OfferDialog.module.scss';

type OfferingDespositProps = {
  register: UseFormRegister<OfferSchemaType>;
  control: Control<OfferSchemaType>;
  watch: UseFormWatch<OfferSchemaType>;
  errors: FieldErrors<OfferSchemaType>;
};
const OfferingDesposit = ({
  register,
  control,
  watch,
  errors
}: OfferingDespositProps) => {
  return (
    <>
      <Typography className={clsx([styles.header, 'col-span-2'])}>
        Deposit
      </Typography>
      <Typography className={clsx([styles.subheader])}>
        How much will you put down as a deposit?
      </Typography>

      <TextField
        label="Deposit Amount"
        variant="outlined"
        size="small"
        type="number"
        {...register('deposit.depositAmount')}
        className=""
        helperText={errors?.financialDetails?.purchasePrice?.message}
        error={!!errors?.financialDetails?.purchasePrice}
      />

      <Typography className={clsx([styles.subheader, 'col-span-2'])}>
        Who will hold the deposit?
      </Typography>

      <TextField
        label="Holder Name"
        variant="outlined"
        size="small"
        {...register('deposit.holderName')}
        className="col-span-1 col-end-2"
        helperText={errors?.deposit?.holderName?.message}
        error={!!errors?.deposit?.holderName}
      />

      <TextField
        label="Holder Address"
        variant="outlined"
        size="small"
        {...register('deposit.holderAddress')}
        className="col-span-1 col-end-2"
        helperText={errors?.deposit?.holderAddress?.message}
        error={!!errors?.deposit?.holderAddress}
      />

      <TextField
        label="Holder Phone (Optional)"
        variant="outlined"
        size="small"
        {...register('deposit.holderPhone')}
        className="col-span-1 col-end-2"
        helperText={errors?.deposit?.holderPhone?.message}
        error={!!errors?.deposit?.holderPhone}
      />

      <TextField
        label="Holder Email (Optional)"
        variant="outlined"
        size="small"
        type="email"
        {...register('deposit.holderEmail')}
        className="col-span-1 col-end-2"
        helperText={errors?.deposit?.holderEmail?.message}
        error={!!errors?.deposit?.holderEmail}
      />
    </>
  );
};

export default OfferingDesposit;
