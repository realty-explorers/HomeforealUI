import SliderField from "@/components/Form/SliderField";
import { Button, Dialog, DialogTitle, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { RangeField } from "./RangeField";
import styles from "./CompsSection.module.scss";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaults } from "@/schemas/defaults";
import SwitchField from "@/components/Form/SwitchField";
import React from "react";
import { CompData, FilteredComp } from "@/models/analyzedProperty";
import {
  selectProperties,
  setSelectedComps,
} from "@/store/slices/propertiesSlice";

import { useDispatch, useSelector } from "react-redux";

const fields = [
  {
    label: "Bedrooms",
    fieldName: "bedrooms",
    type: "range",
  },
  {
    label: "full_bathrooms",
    fieldName: "full_bathrooms",
    type: "range",
  },

  {
    label: "Lot Sqft",
    fieldName: "lot_size",
    type: "range",
  },
  {
    label: "Building Sqft",
    fieldName: "building_area",
    type: "range",
  },
  {
    label: "Year Built",
    fieldName: "year_built",
    type: "range",
  },
  {
    label: "Garages",
    fieldName: "garages",
    type: "range",
  },
  // {
  //   label: "Pool",
  //   fieldName: "pool",
  //   type: "boolean",
  // },
  {
    label: "Sold Price",
    fieldName: "sales_closing_price",
    type: "range",
  },

  {
    label: "Price/Sqft",
    fieldName: "pricePerSqft",
    type: "range",
  },
  {
    label: "Max Distance",
    fieldName: "distance",
    type: "range",
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
  garages: z.array(
    z.number().min(defaults.garages.min).max(defaults.garages.max),
  ).default(defaults.garages.default),
  pool: z.boolean().default(false),
  sales_closing_price: z.array(
    z.number().min(defaults.soldPrice.min).max(defaults.soldPrice.max),
  ).default(defaults.soldPrice.default),
  pricePerSqft: z.array(
    z.number().min(defaults.pricePerSqft.min).max(defaults.pricePerSqft.max),
  ).default(defaults.pricePerSqft.default),
  distance: z.array(
    z.number().min(defaults.distance.min).max(defaults.distance.max),
  ).default(defaults.distance.default),
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
    watch,
    control,
  } = useForm<CompsFilterSchemaType>({
    resolver: zodResolver(compsFiltersSchema),
    defaultValues: getDefaults(compsFiltersSchema),
  });

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: any) => {
    const filteredComps: FilteredComp[] = [];
    for (let i = 0; i < selectedProperty.sales_comps.data?.length; i++) {
      const comp = selectedComps?.[i];
      let add = true;
      for (const field of fields) {
        if (comp[field.fieldName] !== undefined) {
          const value = data[field.fieldName];
          if (field.type === "range") {
            if (
              value[0] > comp[field.fieldName] ||
              value[1] < comp[field.fieldName]
            ) {
              console.log(
                "no range ",
                field.fieldName,
                value,
                comp[field.fieldName],
              );
              add = false;
              break;
            }
          } else {
            if (value !== comp[field.fieldName]) {
              add = false;
              break;
            }
          }
        } else {
          console.log("no field ", field.fieldName);
        }
      }
      if (add) {
        filteredComps.push({ ...comp, index: i });
      }
    }
    setSelectedComps(filteredComps);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className="font-poppins text-2xl font-bold">
        Filter Comps
      </DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-[auto_1fr] m-4 mx-32 gap-x-12 gap-y-4"
      >
        {fields.map((field, index) => {
          return (
            <React.Fragment key={index}>
              <Typography className={styles.filterLabel}>
                {field.label}
              </Typography>
              {field.type === "range"
                ? (
                  <SliderField
                    control={control}
                    fieldName={field.fieldName}
                    min={defaults[field.fieldName]?.min}
                    max={defaults[field.fieldName]?.max}
                    step={defaults[field.fieldName]?.step}
                  />
                )
                : (
                  <SwitchField
                    control={control}
                    fieldName={field.fieldName}
                    className="ml-[-12px]"
                  />
                )}
            </React.Fragment>
          );
        })}
        <Button
          className="bg-[#590D82] hover:bg-[#b958ee] text-white"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Dialog>
  );
};

export default CompsFilter;
