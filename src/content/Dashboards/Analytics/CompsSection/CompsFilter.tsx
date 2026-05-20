import { useForm } from 'react-hook-form';
import z from 'zod';
import { useSelector } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { defaults } from '@/schemas/defaults';
import { CompData, FilteredComp } from '@/models/analyzedProperty';
import { selectSelectedProperty } from '@/store/slices/propertiesSlice';
import FormRangeField from '@/models/formRangeField';
import { numberFormatter } from '@/utils/converters';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import RangeFilterField from './RangeFilterField';

const defaultRangeFields: FormRangeField[] = [
  {
    label: 'Sold Price',
    fieldName: 'price',
    subjectFieldName: 'price',
    min: defaults.soldPrice.min,
    max: defaults.soldPrice.max,
    step: defaults.soldPrice.step,
    formatLabelAsNumber: true,
    prefix: '$'
  },
  {
    label: 'Asked Price',
    fieldName: 'price',
    subjectFieldName: 'price',
    min: defaults.listingPrice.min,
    max: defaults.listingPrice.max,
    step: defaults.listingPrice.step,
    formatLabelAsNumber: true,
    prefix: '$'
  },
  {
    label: 'Bedrooms',
    fieldName: 'bedrooms',
    subjectFieldName: 'bedrooms',
    min: defaults.bedrooms.min,
    max: defaults.bedrooms.max,
    step: defaults.bedrooms.step
  },
  {
    label: 'Bathrooms',
    fieldName: 'baths',
    subjectFieldName: 'baths',
    min: defaults.bathrooms.min,
    max: defaults.bathrooms.max,
    step: defaults.bathrooms.step
  },
  {
    label: 'Lot Sqft',
    fieldName: 'lotArea',
    subjectFieldName: 'lotArea',
    min: defaults.lotSize.min,
    max: defaults.lotSize.max,
    step: defaults.lotSize.step,
    formatLabelAsNumber: true
  },
  {
    label: 'Building Sqft',
    fieldName: 'area',
    subjectFieldName: 'area',
    min: defaults.area.min,
    max: defaults.area.max,
    step: defaults.area.step,
    formatLabelAsNumber: true
  },
  {
    label: 'Year Built',
    fieldName: 'yearBuilt',
    subjectFieldName: 'yearBuilt',
    min: defaults.yearBuilt.min,
    max: defaults.yearBuilt.max,
    step: defaults.yearBuilt.step,
    formatLabelAsNumber: false
  },
  {
    label: 'Max Distance',
    fieldName: 'distance',
    subjectFieldName: 'distance',
    min: defaults.distance.min,
    max: defaults.distance.max,
    step: defaults.distance.step,
    postfix: 'mi'
  }
];

const customRangeFields = [
  {
    label: 'Max Sold Date',
    fieldName: 'listDate',
    min: defaults.soldMonths.min,
    max: defaults.soldMonths.max,
    step: defaults.soldMonths.step,
    postfix: 'months'
  }
];

const compsFiltersSchema = z.object({
  bedrooms: z
    .array(z.number().min(defaults.bedrooms.min).max(defaults.bedrooms.max))
    .default(defaults.bedrooms.default),
  full_bathrooms: z
    .array(z.number().min(defaults.bathrooms.min).max(defaults.bathrooms.max))
    .default(defaults.bathrooms.default),
  lot_size: z
    .array(z.number().min(defaults.lotSize.min).max(defaults.lotSize.max))
    .default(defaults.lotSize.default),
  building_area: z
    .array(z.number().min(defaults.area.min).max(defaults.area.max))
    .default(defaults.area.default),
  year_built: z
    .array(z.number().min(defaults.yearBuilt.min).max(defaults.yearBuilt.max))
    .default(defaults.yearBuilt.default),
  pool: z.boolean().default(false),
  sales_closing_price: z
    .array(z.number().min(defaults.soldPrice.min).max(defaults.soldPrice.max))
    .default(defaults.soldPrice.default),
  sales_listing_price: z
    .array(
      z.number().min(defaults.listingPrice.min).max(defaults.listingPrice.max)
    )
    .default(defaults.listingPrice.default),
  distance: z
    .array(z.number().min(defaults.distance.min).max(defaults.distance.max))
    .default(defaults.distance.default),
  sold_date: z
    .number()
    .min(defaults.soldMonths.min)
    .max(defaults.soldMonths.max)
    .default(defaults.soldMonths.default)
});

type CompsFilterSchemaType = z.infer<typeof compsFiltersSchema>;

type CompsFilterProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedComps: (comps: FilteredComp[]) => void;
  selectedComps: FilteredComp[];
};

const formatSubjectValue = (
  value: number | string | undefined,
  field: { formatLabelAsNumber?: boolean; prefix?: string; postfix?: string }
) => {
  if (value === undefined || value === null || value === '') return '—';
  const numeric = typeof value === 'number' ? value : Number(value);
  const isNumber = !Number.isNaN(numeric);
  const formatted =
    field.formatLabelAsNumber && isNumber
      ? numberFormatter(numeric)
      : `${value}`;
  return `${field.prefix ?? ''}${formatted}${field.postfix ? ` ${field.postfix}` : ''}`;
};

const CompsFilter = ({
  open,
  setOpen,
  setSelectedComps,
  selectedComps
}: CompsFilterProps) => {
  const selectedProperty = useSelector(selectSelectedProperty);

  const [rangeFields, setRangeFields] =
    useState<FormRangeField[]>(defaultRangeFields);

  function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodDefault) {
          return [key, value._def.defaultValue()];
        }
        return [key, undefined];
      })
    );
  }

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    control
  } = useForm<Record<string, any>>({
    defaultValues: getDefaults(compsFiltersSchema)
  });

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: any) => {
    const filteredComps: FilteredComp[] = [];
    const soldComps = selectedProperty?.comps.filter(
      (comp) => comp.status === 'sold' || comp.status === 'off_market'
    );
    if (!soldComps) {
      setSelectedComps([]);
      handleClose();
      return;
    }
    for (let i = 0; i < soldComps.length; i++) {
      const comp = soldComps[i];
      let add = true;
      for (const field of rangeFields) {
        if (comp[field.fieldName] !== undefined) {
          const value = data[field.fieldName];
          if (!Array.isArray(value) || value.length < 2) continue;
          if (
            value[0] > comp[field.fieldName] ||
            value[1] < comp[field.fieldName]
          ) {
            add = false;
            break;
          }
        }
      }
      try {
        const field = customRangeFields[0];
        if (comp['sales_date'] !== undefined) {
          const value = data[field.fieldName];
          if (value !== undefined && value !== null) {
            const currentDate = new Date();
            const date = new Date(comp['sales_date']);
            const diff = currentDate.getTime() - date.getTime();
            const diffMonths = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
            if (Number(value) < diffMonths) {
              add = false;
            }
          }
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
    comps: CompData[]
  ) => {
    if (!comps || comps.length === 0) return rangeFields;
    for (const rangeField of rangeFields) {
      const values: number[] = [];
      for (const comp of comps) {
        const raw = comp?.[rangeField.fieldName];
        const num = typeof raw === 'number' ? raw : Number(raw);
        if (Number.isFinite(num)) values.push(num);
      }
      if (values.length === 0) continue;
      rangeField.min = Math.min(...values);
      rangeField.max = Math.max(...values);
      if (rangeField.min === rangeField.max) {
        rangeField.max = rangeField.min + (rangeField.step || 1);
      }
    }
    return rangeFields;
  };

  useEffect(() => {
    const soldComps = selectedProperty?.comps.filter(
      (comp) => comp.status === 'sold' || comp.status === 'off_market'
    );
    if (!soldComps) return;
    const limitedRangeFields = findRangeLimits(rangeFields, soldComps);
    setRangeFields(limitedRangeFields);
    for (const rangeField of limitedRangeFields) {
      if (
        Number.isFinite(rangeField.min) &&
        Number.isFinite(rangeField.max) &&
        getValues(rangeField.fieldName) === undefined
      ) {
        setValue(rangeField.fieldName, [rangeField.min, rangeField.max]);
      }
    }
    for (const field of customRangeFields) {
      if (getValues(field.fieldName) === undefined) {
        setValue(field.fieldName, field.max);
      }
    }
  }, [selectedProperty]);

  useEffect(() => {
    const limitedRangeFields = findRangeLimits(
      JSON.parse(JSON.stringify(rangeFields)),
      selectedComps
    );
    for (const rangeField of limitedRangeFields) {
      const lo = Number.isFinite(rangeField.min)
        ? Math.floor(rangeField.min * 1000) / 1000
        : null;
      const hi = Number.isFinite(rangeField.max)
        ? Math.ceil(rangeField.max * 1000) / 1000
        : null;
      if (lo === null || hi === null) continue;
      setValue(rangeField.fieldName, [lo, hi]);
    }
  }, [selectedComps]);

  const totalComps = useMemo(
    () =>
      selectedProperty?.comps?.filter(
        (c) => c.status === 'sold' || c.status === 'off_market'
      )?.length ?? 0,
    [selectedProperty]
  );

  const handleReset = () => {
    for (const rangeField of rangeFields) {
      if (
        Number.isFinite(rangeField.min) &&
        Number.isFinite(rangeField.max)
      ) {
        setValue(rangeField.fieldName, [rangeField.min, rangeField.max], {
          shouldDirty: true
        });
      }
    }
    for (const field of customRangeFields) {
      setValue(field.fieldName, field.max, { shouldDirty: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogContent className="max-w-3xl gap-0 border-zinc-200 bg-white p-0 sm:rounded-2xl">
        <DialogHeader className="space-y-2 border-b border-zinc-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
              <SlidersHorizontal className="size-5" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="font-poppins text-xl font-semibold tracking-tight text-zinc-900">
                Filter Comps
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {selectedComps?.length ?? 0} of {totalComps} comps match your
                current range
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[78vh] flex-col"
        >
          <div className="grid grid-cols-[1.1fr_0.9fr_2.4fr] gap-x-6 border-b border-zinc-100 bg-zinc-50/60 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <span>Characteristic</span>
            <span className="text-center">Subject</span>
            <span>Comps Range</span>
          </div>

          <ScrollArea className="max-h-[58vh] flex-1">
            <div className="divide-y divide-zinc-100 px-6">
              {rangeFields.map((field, index) => (
                <div
                  key={`${field.fieldName}-${index}`}
                  className="grid grid-cols-[1.1fr_0.9fr_2.4fr] items-center gap-x-6 py-4"
                >
                  <span className="font-poppins text-sm font-medium text-zinc-900">
                    {field.label}
                  </span>
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        'inline-flex h-7 items-center rounded-full bg-zinc-100 px-3 text-xs font-semibold tabular-nums text-zinc-700'
                      )}
                    >
                      {formatSubjectValue(
                        selectedProperty?.[field.subjectFieldName],
                        field
                      )}
                    </span>
                  </div>
                  <RangeFilterField
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    prefix={field.prefix}
                    postfix={field.postfix}
                    formatLabelAsNumber={field.formatLabelAsNumber}
                    fieldName={field.fieldName}
                    control={control}
                    setValue={setValue}
                  />
                </div>
              ))}

              {customRangeFields.map((field, index) => (
                <div
                  key={`custom-${field.fieldName}-${index}`}
                  className="grid grid-cols-[1.1fr_0.9fr_2.4fr] items-center gap-x-6 py-4"
                >
                  <span className="font-poppins text-sm font-medium text-zinc-900">
                    {field.label}
                  </span>
                  <div className="flex justify-center">
                    <span className="text-xs text-zinc-400">—</span>
                  </div>
                  <RangeFilterField
                    mode="single"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    postfix={field.postfix}
                    fieldName={field.fieldName}
                    control={control}
                    setValue={setValue}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          {Object.keys(errors).length > 0 && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-3">
              <p className="text-xs font-medium text-red-600">
                Please fix the errors above
              </p>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              Reset filters
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-full px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 text-white shadow-sm hover:from-primary hover:to-primary-light"
              >
                Apply filter
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompsFilter;
