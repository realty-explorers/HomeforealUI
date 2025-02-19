import SwitchField from '@/components/Form/SwitchField';
import { defaults } from '@/schemas/defaults';
import { Slider, Switch, Typography } from '@mui/material';
import {
  Control,
  Controller,
  Path,
  PathValue,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from './EditBuyBoxDialog.module.scss';
import RangeField from '@/components/Form/RangeField';
import clsx from 'clsx';
import AutocompleteField from '@/components/Form/AutocompleteField';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';
import RangeFieldV2 from '@/components/Form/RangeFieldV2';

const select_fields: {
  title: string;
  fieldName: Path<BuyBoxFormData>;
  options: { label: string; value: string }[];
  multiple: boolean;
}[] = [
  {
    title: 'Property Types',
    fieldName: 'propertyCriteria.propertyTypes',
    options: [
      { label: 'Single Family', value: 'single_family' }
      // { label: "Multi Family", value: "Multi Family" },
      // { label: "Condo", value: "Condo" },
      // { label: "Townhouse", value: "Townhouse" },
    ],
    multiple: true
  }
];

const range_fields: {
  title: string;
  fieldName: Path<BuyBoxFormData>;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  postfix?: string;
  formatLabelAsNumber?: boolean;
}[] = [
  {
    title: 'Bedrooms',
    fieldName: 'propertyCriteria.beds',
    min: defaults.bedrooms.min,
    max: defaults.bedrooms.max,
    step: defaults.bedrooms.step
  },
  {
    title: 'Bathrooms',
    fieldName: 'propertyCriteria.baths',
    min: defaults.bathrooms.min,
    max: defaults.bathrooms.max,
    step: defaults.bathrooms.step
  },
  {
    title: 'Building Sqft',
    fieldName: 'propertyCriteria.area',
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
    formatLabelAsNumber: true
  },
  {
    title: 'Lot Size',
    fieldName: 'propertyCriteria.lotArea',
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
    formatLabelAsNumber: true
  },
  {
    title: 'Year Built',
    fieldName: 'propertyCriteria.yearBuilt',
    min: defaults.yearBuilt.min,
    max: defaults.yearBuilt.max,
    step: defaults.yearBuilt.step
  },
  {
    title: 'Listing Price',
    fieldName: 'propertyCriteria.price',
    min: defaults.listingPrice.min,
    max: defaults.listingPrice.max,
    step: defaults.listingPrice.step,
    prefix: '$',
    formatLabelAsNumber: true
  }
];

type PropertyCriteriaFieldsProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
};

const PropertyCriteriaFields = ({
  register,
  control,
  watch,
  setValue,
  getValues
}: PropertyCriteriaFieldsProps) => {
  return (
    <>
      {select_fields.map((field, index) => {
        return (
          <div
            key={index}
            className="flex w-full items-center justify-center col-span-2 mb-2"
          >
            <SwitchField
              fieldName={`${field.fieldName}.enabled`}
              control={control}
            />
            <AutocompleteField
              label={field.title}
              options={field.options.map((option) => option.value)}
              multiple={field.multiple}
              control={control}
              fieldName={`${field.fieldName}.items` as Path<BuyBoxFormData>}
              disabled={
                !watch(`${field.fieldName}.enabled` as Path<BuyBoxFormData>)
              }
            />
          </div>
        );
      })}
      {range_fields.map((field, index) => {
        return (
          <>
            <div className={clsx(['flex w-full item-center'])}>
              <SwitchField
                fieldName={`${field.fieldName}.enabled`}
                control={control}
                // disabled={!watch(`${group.fieldName}`)}
              />
              <Typography className={styles.label}>{field.title}</Typography>
            </div>
            <RangeFieldV2
              min={field.min}
              max={field.max}
              step={field.step}
              control={control}
              prefix={field.prefix}
              formatLabelAsNumber={field.formatLabelAsNumber}
              fieldName={`${field.fieldName}`}
              disabled={
                !watch(`${field.fieldName}.enabled` as Path<BuyBoxFormData>)
              }
            />
            {/* <RangeField */}
            {/*   key={index} */}
            {/*   min={field.min || 0} */}
            {/*   max={field.max || 0} */}
            {/*   step={field.step} */}
            {/*   // prefix={field.prefix} */}
            {/*   // postfix={field.postfix} */}
            {/*   formatLabelAsNumber={field.formatLabelAsNumber} */}
            {/*   minFieldName={field.minFieldName} */}
            {/*   maxFieldName={field.maxFieldName} */}
            {/*   setValue={setValue} */}
            {/*   getValues={getValues} */}
            {/*   disabled={!watch(field.minFieldName)} */}
            {/* /> */}
          </>
        );
      })}
    </>
  );
};

export default PropertyCriteriaFields;
