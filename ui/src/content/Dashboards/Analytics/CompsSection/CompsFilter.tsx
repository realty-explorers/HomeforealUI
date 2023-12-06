import SliderField from "@/components/Form/SliderField";
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import RangeField from "@/components/Form/RangeField";
import styles from "./CompsSection.module.scss";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaults } from "@/schemas/defaults";
import SwitchField from "@/components/Form/SwitchField";
import React, { useEffect, useState } from "react";
import { CompData, FilteredComp } from "@/models/analyzedProperty";
import {
  selectProperties,
  setSelectedComps,
} from "@/store/slices/propertiesSlice";

import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { ModeEdit } from "@mui/icons-material";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CompsFilterField from "./CompsFilterField";
import FormRangeField from "@/models/formRangeField";
import { numberFormatter } from "@/utils/converters";

const defaultRangeFields: FormRangeField[] = [
  {
    label: "Sold Price",
    fieldName: "sales_closing_price",
    subjectFieldName: "sales_closing_price",
    min: defaults.soldPrice.min,
    max: defaults.soldPrice.max,
    step: defaults.soldPrice.step,
    formatLabelAsNumber: true,
    prefix: "$",
  },
  {
    label: "Asked Price",
    fieldName: "sales_listing_price",
    subjectFieldName: "sales_listing_price",
    min: defaults.listingPrice.min,
    max: defaults.listingPrice.max,
    step: defaults.listingPrice.step,
    formatLabelAsNumber: true,
    prefix: "$",
  },
  {
    label: "Bedrooms",
    fieldName: "bedrooms",
    subjectFieldName: "bedrooms",
    min: defaults.bedrooms.min,
    max: defaults.bedrooms.max,
    step: defaults.bedrooms.step,
  },
  {
    label: "Bathrooms",
    fieldName: "full_bathrooms",
    subjectFieldName: "full_bathrooms",
    min: defaults.bathrooms.min,
    max: defaults.bathrooms.max,
    step: defaults.bathrooms.step,
  },

  {
    label: "Lot Sqft",
    fieldName: "lot_size",
    subjectFieldName: "lot_size",
    min: defaults.lotSize.min,
    max: defaults.lotSize.max,
    step: defaults.lotSize.step,
    formatLabelAsNumber: true,
  },
  {
    label: "Building Sqft",
    fieldName: "building_area",
    subjectFieldName: "building_area",
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
    formatLabelAsNumber: true,
  },
  {
    label: "Year Built",
    fieldName: "year_built",
    subjectFieldName: "year_built",
    min: defaults.yearBuilt.min,
    max: defaults.yearBuilt.max,
    step: defaults.yearBuilt.step,
    formatLabelAsNumber: false,
  },

  // {
  //   label: "Price/Sqft",
  //   fieldName: "pricePerSqft",
  //   subjectFieldName: "pricePerSqft",
  //   min: defaults.pricePerSqft.min,
  //   max: defaults.pricePerSqft.max,
  //   step: defaults.pricePerSqft.step,
  //   formatLabelAsNumber: true,
  //   prefix: "$",
  // },
  {
    label: "Max Distance",
    fieldName: "distance",
    subjectFieldName: "distance",
    min: defaults.distance.min,
    max: defaults.distance.max,
    step: defaults.distance.step,
    postfix: "mi",
  },
];

const customRangeFields = [
  {
    label: "Max Sold Date",
    fieldName: "sold_date",
    min: defaults.soldMonths.min,
    max: defaults.soldMonths.max,
    step: defaults.soldMonths.step,
    postfix: "months",
  },
];

const booleanFields = [
  {
    label: "Pool",
    fieldName: "pool",
  },
  {
    label: "Same Neighborhood",
    fieldName: "same_neighborhood",
  },
];

const compsFiltersSchema = z.object({
  bedrooms: z.array(
    z.number().min(defaults.bedrooms.min).max(defaults.bedrooms.max),
  ).default(defaults.bedrooms.default),
  full_bathrooms: z.array(
    z.number().min(defaults.bathrooms.min).max(defaults.bathrooms.max),
  ).default(defaults.bathrooms.default),
  lot_size: z.array(
    z.number().min(defaults.lotSize.min).max(defaults.lotSize.max),
  ).default(defaults.lotSize.default),
  building_area: z.array(
    z.number().min(defaults.area.min).max(defaults.area.max),
  )
    .default(defaults.area.default),
  year_built: z.array(
    z.number().min(defaults.yearBuilt.min).max(defaults.yearBuilt.max),
  ).default(defaults.yearBuilt.default),
  pool: z.boolean().default(false),
  sales_closing_price: z.array(
    z.number().min(defaults.soldPrice.min).max(defaults.soldPrice.max),
  ).default(defaults.soldPrice.default),
  sales_listing_price: z.array(
    z.number().min(defaults.listingPrice.min).max(defaults.listingPrice.max),
  ).default(defaults.listingPrice.default),
  // pricePerSqft: z.array(
  //   z.number().min(defaults.pricePerSqft.min).max(defaults.pricePerSqft.max),
  // ).default(defaults.pricePerSqft.default),
  distance: z.array(
    z.number().min(defaults.distance.min).max(defaults.distance.max),
  ).default(defaults.distance.default),
  sold_date: z.number().min(defaults.soldMonths.min).max(
    defaults.soldMonths.max,
  ).default(defaults.soldMonths.default),
});

const validateComps = () => {
};

type CompsFilterSchemaType = z.infer<typeof compsFiltersSchema>;

type CompsFilterProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedComps: (comps: FilteredComp[]) => void;
  selectedComps: FilteredComp[];
};
const CompsFilter = (
  { open, setOpen, setSelectedComps, selectedComps }: CompsFilterProps,
) => {
  const { selectedProperty } = useSelector(selectProperties);

  const [rangeFields, setRangeFields] = useState<FormRangeField[]>(
    defaultRangeFields,
  );

  function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodDefault) {
          return [key, value._def.defaultValue()];
        }
        return [key, undefined];
      }),
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
    control,
  } = useForm<CompsFilterSchemaType>({
    resolver: zodResolver(compsFiltersSchema),
    defaultValues: getDefaults(compsFiltersSchema),
  });

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    const filteredComps: FilteredComp[] = [];
    for (let i = 0; i < selectedProperty?.sales_comps?.data?.length; i++) {
      const comp = selectedProperty?.sales_comps?.data?.[i];
      let add = true;
      for (const field of rangeFields) {
        if (comp[field.fieldName] !== undefined) {
          const value = data[field.fieldName];
          if (
            value[0] > comp[field.fieldName] || value[1] < comp[field.fieldName]
          ) {
            add = false;
            console.log(
              "no range ",
              field.fieldName,
              value,
              comp[field.fieldName],
            );
            break;
          }
        } else {
          console.log("no field ", field.fieldName);
        }
      }
      try {
        const field = customRangeFields[0];
        if (comp["sales_date"] !== undefined) {
          const value = data[field.fieldName];
          const currentDate = new Date();
          const date = new Date(comp["sales_date"]);
          const diff = currentDate - date;
          const diffMonths = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
          console.log(diffMonths);
          if (value < diffMonths) {
            add = false;
          }
        } else {
          console.log("no field ", field.fieldName);
        }
      } catch (e) {
        console.log(e);
      }
      if (add) {
        filteredComps.push({ ...comp, index: i });
      }
    }
    setSelectedComps(filteredComps);
    handleClose();
  };

  const findRangeLimits = (
    rangeFields: FormRangeField[],
    comps: CompData[],
  ) => {
    if (comps.length === 0) return rangeFields;
    for (const rangeField of rangeFields) {
      rangeField.min = comps[0][rangeField.fieldName];
      rangeField.max = comps[0][rangeField.fieldName];
    }
    // try {
    //   const currentDate = new Date();
    //   const date = new Date(comp.sales_date);
    //   const diff = currentDate - date;
    //   const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    //   customRangeFields[0].max = diffDays;
    // } catch (e) {
    //   console.log(e);
    // }

    for (let i = 1; i < comps.length; i++) {
      const comp = comps[i];
      for (const rangeField of rangeFields) {
        if (comp[rangeField.fieldName] < rangeField.min) {
          rangeField.min = comp[rangeField.fieldName];
        }
        if (comp[rangeField.fieldName] > rangeField.max) {
          rangeField.max = comp[rangeField.fieldName];
        }
      }
      // try {
      //   const currentDate = new Date();
      //   const date = new Date(comp.sales_date);
      //   const diff = currentDate - date;
      //   const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      //   if (diff > customRangeFields[0].max) {
      //     customRangeFields[0].max = diffDays;
      //   }
      //   console.log(Math.floor(diff / (1000 * 60 * 60 * 24)));
      // } catch (e) {
      //   console.log(e);
      // }
    }
    return rangeFields;
  };

  useEffect(() => {
    const limitedRangeFields = findRangeLimits(
      rangeFields,
      selectedProperty?.sales_comps?.data,
    );
    setRangeFields(limitedRangeFields);
  }, [selectedProperty]);

  useEffect(() => {
    const limitedRangeFields = findRangeLimits(
      JSON.parse(JSON.stringify(rangeFields)),
      selectedComps,
    );
    for (const rangeField of limitedRangeFields) {
      setValue(rangeField.fieldName, [
        Math.floor(rangeField.min * 1000) / 1000,
        Math.ceil(rangeField.max * 1000) / 1000,
      ]);
    }
  }, [selectedComps]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className="flex items-center">
        <TuneOutlinedIcon className="text-[#590D82]" />
        <Typography className="pl-2 font-poppins text-2xl font-bold">
          Filter Comps
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full py-4">
        <div className="grid grid-cols-[1fr_1fr_4fr] w-full pr-16 pb-4 gap-y-4 mb-4">
          <Typography className={clsx([styles.compsFilterHeader])}>
            Characteristics
          </Typography>
          <Typography className={clsx([styles.compsFilterHeader])}>
            Subject Prop.
          </Typography>
          <Typography className={clsx([styles.compsFilterHeader])}>
            Comps Range
          </Typography>
        </div>
        <div className="grid grid-cols-[1fr_1fr_4fr] w-full gap-y-4 pr-16 ">
          {rangeFields.map((field, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center ">
                <Typography
                  className={clsx([styles.compsFilterLabel, "ml-[30%]"])}
                >
                  {field.label}
                </Typography>
              </div>
              <div className="flex items-center justify-center">
                <Typography
                  className={clsx([styles.compsFilterField, "text-center"])}
                >
                  {field.formatLabelAsNumber
                    ? numberFormatter(selectedProperty[field.subjectFieldName])
                    : selectedProperty[field.subjectFieldName]}
                </Typography>
              </div>
              <RangeField
                key={index}
                min={field.min}
                max={field.max}
                step={field.step}
                prefix={field.prefix}
                postfix={field.postfix}
                formatLabelAsNumber={field.formatLabelAsNumber}
                fieldName={`${field.fieldName}`}
                setValue={setValue}
                getValues={getValues}
              />
            </React.Fragment>
          ))}
          {customRangeFields.map((field, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex items-center ">
                  <Typography
                    className={clsx([styles.compsFilterLabel, "ml-[30%]"])}
                  >
                    {field.label}
                  </Typography>
                </div>
                <div className="flex items-center justify-center">
                  <Typography
                    className={clsx([styles.compsFilterField, "text-center"])}
                  >
                    {selectedProperty[field.fieldName]}
                  </Typography>
                </div>
                <RangeField
                  key={index}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  prefix={field.prefix}
                  postfix={field.postfix}
                  formatLabelAsNumber={field.formatLabelAsNumber}
                  fieldName={`${field.fieldName}`}
                  setValue={setValue}
                  getValues={getValues}
                />
              </React.Fragment>
            );
          })}
        </div>
        {
          //show errors
          Object.keys(errors).length > 0 && (
            <div className="flex flex-col items-center justify-center mt-4">
              <Typography className="text-red-500">
                Please fix the errors above
              </Typography>
            </div>
          )
        }

        <Button
          className="bg-[#590D82] hover:bg-[#b958ee] text-white px-4 mx-4 mt-6"
          type="submit"
        >
          Apply Filter
        </Button>
      </form>

      {/* <form */}
      {/*   onSubmit={handleSubmit(onSubmit)} */}
      {/*   className="grid grid-cols-[auto_1fr] m-4 mx-32 gap-x-12 gap-y-4" */}
      {/* > */}
      {/*   {fields.map((field, index) => { */}
      {/*     return ( */}
      {/*       <React.Fragment key={index}> */}
      {/*         <Typography className={styles.filterLabel}> */}
      {/*           {field.label} */}
      {/*         </Typography> */}
      {/*         {field.type === "range" */}
      {/*           ? ( */}
      {/*             <SliderField */}
      {/*               control={control} */}
      {/*               fieldName={field.fieldName} */}
      {/*               min={defaults[field.fieldName]?.min} */}
      {/*               max={defaults[field.fieldName]?.max} */}
      {/*               step={defaults[field.fieldName]?.step} */}
      {/*             /> */}
      {/*           ) */}
      {/*           : ( */}
      {/*             <SwitchField */}
      {/*               control={control} */}
      {/*               fieldName={field.fieldName} */}
      {/*               className="ml-[-12px]" */}
      {/*             /> */}
      {/*           )} */}
      {/*       </React.Fragment> */}
      {/*     ); */}
      {/*   })} */}
      {/* </form> */}
    </Dialog>
  );
};

export default CompsFilter;
