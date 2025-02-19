import { sliderClasses } from '@mui/base';
import {
  Button,
  Checkbox,
  Slider,
  Switch,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from './EditBuyBoxDialog.module.scss';
// import { RangeField } from "./RangeField";
import RangeField from '@/components/Form/RangeField';
import { defaultSimilarityFields } from '@/schemas/defaults';
import SwitchField from '@/components/Form/SwitchField';
import ArticleIcon from '@mui/icons-material/Article';
import { styled } from '@mui/system';
import RangeFieldV2 from '@/components/Form/RangeFieldV2';
import SingleRangeField from '@/components/Form/SingleRangeField';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';
import SliderField from '@/components/Form/SliderField';
import SingleRangeFieldConst from '@/components/Form/SingleRangeFieldConst';

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white'
  }
}));

const similarityTypes = ['green', 'yellow', 'orange', 'red'];
const rangeFields = [
  {
    label: 'Bedrooms',
    fieldName: 'bedsOffset',
    type: 'range',
    min: defaultSimilarityFields.bedrooms.min,
    max: defaultSimilarityFields.bedrooms.max,
    step: defaultSimilarityFields.bedrooms.step
  },
  {
    label: 'Bathrooms',
    fieldName: 'bathsOffset',
    type: 'range',
    min: defaultSimilarityFields.bathrooms.min,
    max: defaultSimilarityFields.bathrooms.max,
    step: defaultSimilarityFields.bathrooms.step
  },
  {
    label: 'Building Sqft',
    fieldName: 'areaOffset',
    type: 'range',
    min: defaultSimilarityFields.area.min,
    max: defaultSimilarityFields.area.max,
    step: defaultSimilarityFields.area.step,
    postfix: '%'
  },
  {
    label: 'Year Built',
    fieldName: 'yearBuiltOffset',
    type: 'range',
    min: defaultSimilarityFields.yearBuilt.min,
    max: defaultSimilarityFields.yearBuilt.max,
    step: defaultSimilarityFields.yearBuilt.step
  },
  {
    label: 'Lot Size',
    fieldName: 'lotAreaOffset',
    type: 'range',
    min: defaultSimilarityFields.lotSize.min,
    max: defaultSimilarityFields.lotSize.max,
    step: defaultSimilarityFields.lotSize.step,
    formatLabelAsNumber: true,
    postfix: '%'
  },
  {
    label: 'Distance',
    fieldName: 'maxDistance',
    type: 'single',
    min: defaultSimilarityFields.distance.min,
    max: defaultSimilarityFields.distance.max,
    step: defaultSimilarityFields.distance.step,
    postfix: 'mi'
  },
  {
    label: 'Sale Date',
    fieldName: 'maxListingAgeMonths',
    type: 'single',
    min: defaultSimilarityFields.saleDate.min,
    max: defaultSimilarityFields.saleDate.max,
    step: defaultSimilarityFields.saleDate.step,
    postfix: 'months'
  }
];

const booleanFields = [
  // { fieldName: "Same Neighborhood", type: "boolean" },
  // { fieldName: "Same Property Type", type: "boolean" },
  // { fieldName: "Same Pool Status", type: "boolean" },
];

//bg-red-500
//bg-orange-500
//bg-yellow-500
//bg-green-500

type ComparablePreferencesProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
};
const ComparablePreferences = ({
  register,
  control,
  watch,
  setValue,
  getValues
}: ComparablePreferencesProps) => {
  const [tab, setTab] = useState(0);
  // const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleUseTemplate = () => {};

  return (
    <>
      <div className="col-span-2 relative">
        {similarityTypes.map(
          (similarityType, index) =>
            index === tab && (
              <div
                key={index}
                className={clsx([' flex absolute top-0 left-0'])}
              >
                <Controller
                  name={`similarityCriteria.${index}.enabled`}
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <Checkbox {...field} checked={!!value} />
                  )}
                />
                <Typography className={styles.label}>Active</Typography>{' '}
              </div>
            )
        )}

        <Tabs
          value={tab}
          onChange={handleChange}
          centered
          TabIndicatorProps={{
            sx: {
              // borderRadius: "10rem",
              border: `0.2rem solid ${
                tab === 0
                  ? 'green'
                  : tab === 1
                  ? 'yellow'
                  : tab === 2
                  ? 'orange'
                  : 'red'
              }`
            }
          }}
        >
          <StyledTab
            label="Green"
            className={clsx([tab === 0 && 'bg-green-500 text-white'])}
          />
          <StyledTab
            label="Yellow"
            className={clsx([tab === 1 && 'bg-yellow-500'])}
          />
          <StyledTab
            label="Orange"
            className={clsx([tab === 2 && 'bg-orange-500'])}
          />
          <StyledTab
            label="Red"
            className={clsx([tab === 3 && 'bg-red-500'])}
          />
        </Tabs>

        {/* <Button */}
        {/*   startIcon={<ArticleIcon />} */}
        {/*   className="bg-secondary text-white hover:ring-4 hover:bg-secondary px-4" */}
        {/*   onClick={handleUseTemplate} */}
        {/* > */}
        {/*   Use Template */}
        {/* </Button> */}
      </div>

      {similarityTypes.map((similarityType, index) => {
        return (
          <React.Fragment key={index}>
            {rangeFields.map((similarityField, idx) => {
              return (
                index === tab &&
                (similarityField.type === 'boolean' ? (
                  <div
                    key={idx}
                    className={clsx(['flex w-full item-center col-span-2'])}
                  >
                    <Controller
                      name={`similarityCriteria.${index}.${similarityField.fieldName}.enabled`}
                      control={control}
                      render={({ field: { value, ...field } }) => (
                        <Switch
                          {...field}
                          checked={!!value}
                          disabled={
                            !watch(`similarityCriteria.${index}.enabled`)
                          }
                        />
                      )}
                    />
                    <Typography className={styles.label}>
                      {similarityField.fieldName}
                    </Typography>{' '}
                  </div>
                ) : (
                  <>
                    <div
                      className={clsx([
                        ' w-full item-center',
                        index === tab ? 'flex' : 'hidden'
                      ])}
                    >
                      <SwitchField
                        fieldName={`similarityCriteria.${index}.${similarityField.fieldName}.enabled`}
                        control={control}
                        disabled={!watch(`similarityCriteria.${index}.enabled`)}
                      />
                      <Typography className={styles.label}>
                        {similarityField.label}
                      </Typography>
                    </div>
                    {similarityField.type === 'range' && (
                      <RangeFieldV2
                        key={idx}
                        min={similarityField.min}
                        max={similarityField.max}
                        step={similarityField.step}
                        // prefix={similarityField.prefix}
                        postfix={similarityField.postfix}
                        formatLabelAsNumber={
                          similarityField.formatLabelAsNumber
                        }
                        fieldName={`similarityCriteria.${index}.${similarityField.fieldName}`}
                        control={control}
                        disabled={
                          !watch(
                            `similarityCriteria.${index}.${similarityField.fieldName}.enabled`
                          )
                        }
                      />
                    )}
                    {similarityField.type === 'single' && (
                      <SingleRangeField
                        key={idx}
                        min={similarityField.min}
                        max={similarityField.max}
                        step={similarityField.step}
                        // prefix={similarityField.prefix}
                        postfix={similarityField.postfix}
                        formatLabelAsNumber={
                          similarityField.formatLabelAsNumber
                        }
                        fieldName={`similarityCriteria.${index}.${similarityField.fieldName}`}
                        control={control}
                        disabled={
                          !watch(
                            `similarityCriteria.${index}.${similarityField.fieldName}.enabled`
                          )
                        }
                      />
                    )}
                  </>
                ))
              );
            })}
            {index === tab && (
              <>
                <div
                  className={clsx([
                    ' w-full item-center ml-14',
                    index === tab ? 'flex' : 'hidden'
                  ])}
                >
                  <Typography className={styles.label}>
                    Similarity Weight
                  </Typography>
                </div>
                <SingleRangeFieldConst
                  key={index}
                  min={0}
                  max={1}
                  step={0.01}
                  fieldName={`similarityCriteria.${index}.weight`}
                  control={control}
                  disabled={!watch(`similarityCriteria.${index}.enabled`)}
                />
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* {similarityTypes.map((similartyType, index) => { */}
      {/*   return ( */}
      {/*     ( */}
      {/*       <React.Fragment key={index}> */}
      {/*         <div */}
      {/*           className={clsx([ */}
      {/*             "flex w-full item-center col-span-2", */}
      {/*             index === value ? "" : "hidden", */}
      {/*           ])} */}
      {/*         > */}
      {/*           <Switch {...register(`${similartyType}.samePropertyType`)} /> */}
      {/*           <Typography className={styles.label}> */}
      {/*             Same Property Type */}
      {/*           </Typography> */}
      {/*         </div> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.bedrooms`} */}
      {/*           title="Bedrooms" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.bathrooms`} */}
      {/*           title="Bathrooms" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.yearBuilt`} */}
      {/*           title="Year Built" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.buildingSqft`} */}
      {/*           title="Building Sqft" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.lotSize`} */}
      {/*           title="Lot Size" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <div */}
      {/*           className={clsx([ */}
      {/*             "flex w-full item-center col-span-2", */}
      {/*             index === value ? "" : "hidden", */}
      {/*           ])} */}
      {/*         > */}
      {/*           <Switch {...register(`${similartyType}.samePool`)} /> */}
      {/*           <Typography className={styles.label}>Same Pool</Typography> */}
      {/*         </div> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.garages`} */}
      {/*           title="Garages" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.distance`} */}
      {/*           title="Distance" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/**/}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.saleDate`} */}
      {/*           title="Sale Date" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*         <RangeField */}
      {/*           register={register} */}
      {/*           control={control} */}
      {/*           watch={watch} */}
      {/*           fieldName={`${similartyType}.weight`} */}
      {/*           title="Weight" */}
      {/*           labelClass={index === value ? "" : "hidden"} */}
      {/*           sliderClass={index === value ? "" : "hidden"} */}
      {/*         /> */}
      {/*       </React.Fragment> */}
      {/*     ) */}
      {/*   ); */}
      {/* })} */}
    </>
  );
};

export default ComparablePreferences;
