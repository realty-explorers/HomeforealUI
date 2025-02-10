import { Slider, Switch, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";
import SliderField from "@/components/Form/SliderField";
import styles from "./EditBuyBoxDialog.module.scss";

type RangeFieldProps = {
  control: any;
  fieldName: string;
  title: string;
};

export const RangeField = (
  {
    control,
    title,
    fieldName,
  }: RangeFieldProps,
) => {
  return (
    <div className="flex">
      <Typography>{title}</Typography>
      <SliderField control={control} fieldName={fieldName} />
    </div>
  );
};
