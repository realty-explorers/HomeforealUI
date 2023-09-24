import { sliderClasses } from "@mui/base";
import { Checkbox, Slider, Switch, Tab, Tabs, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import styles from "./EditBuyBoxDialog.module.scss";
import { buyboxSchemaType } from "./Schemas";

const similarityTypes = ["green", "yellow", "orange", "red"];

const columns: GridColDef[] = [
  {
    field: "bedrooms",
    headerName: "Bedrooms",
    renderCell: (params: GridValueGetterParams) =>
      `${params.value?.values?.[0]} - ${params.value?.values?.[1]}`,
  },
  {
    field: "bathrooms",
    headerName: "Bathrooms",
    renderCell: (params: GridValueGetterParams) =>
      `${params.value?.values?.[0]} - ${params.value?.values?.[1]}`,
  },
  {
    field: "yearBuilt",
    headerName: "Year Built",
    renderCell: (params: GridValueGetterParams) =>
      `${params.value?.values?.[0]} - ${params.value?.values?.[1]}`,
  },
  {
    field: "buildingSqft",
    headerName: "Building Sqft",
    renderCell: (params: GridValueGetterParams) =>
      `${params.value?.values?.[0]} - ${params.value?.values?.[1]}`,
  },
  // { field: "bathrooms", headerName: "Bathrooms" },
];

const FieldValue = ({ index, value, className }: any) => {
  return (
    <div
      key={index}
      className={`h-10  px-4 lg:px-6 flex flex-col justify-end md:order-${
        2 + index
      }`}
    >
      <div
        className={clsx([
          "flex items-center h-full border-b border-slate-200 dark:border-slate-700 py-2 text-slate-600 dark:text-slate-400 ",
          className,
        ])}
      >
        <span className="font-semibold text-[rgba(208,208,208)]">
          {value}
        </span>
      </div>
    </div>
  );
};

type SimilarityChartProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
};
const SimilarityChart = (
  { register, control, watch }: SimilarityChartProps,
) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const greenValues = useWatch({ control, name: "green" });
  const yellowValues = useWatch({ control, name: "yellow" });
  const orangeValues = useWatch({ control, name: "orange" });
  const redValues = useWatch({ control, name: "red" });

  const displayValue = (value: any) => {
    if (Array.isArray(value)) {
      return value[0]
        ? (!Array.isArray(value[1])
          ? `${value[1]}`
          : `${value[1][0]} - ${value[1][1]}`)
        : "All";
    }
    return value
      ? <CheckIcon color="success" />
      : <DoNotDisturbIcon color="error" />;
  };

  return (
    <div className="col-span-2 mt-12">
      <div className="max-w-sm mx-auto md:max-w-none grid md:grid-cols-5 md:-mx-6 text-sm bg-slate-900 rounded-md">
        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-emerald-50 font-semibold text-lg mt-4 mb-4 text-center">
              Group
            </div>
          </div>
          {Object.keys(greenValues).map((key, index) => {
            return <FieldValue key={index} index={index} value={key} />;
          })}
        </section>

        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-[rgb(43,205,43)] font-semibold text-lg mt-4 mb-4 text-center shadow-[0_0_8px_0_rgb(43,205,43)] rounded-md">
              Green
            </div>
          </div>

          {Object.keys(greenValues).map((key, index) => {
            return (
              <FieldValue
                key={index}
                index={index}
                value={displayValue(greenValues[key])}
                className="justify-center"
              />
            );
          })}
        </section>

        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-[rgb(214,207,23)] font-semibold text-lg mt-4 mb-4 text-center shadow-[0_0_8px_0_rgb(214,207,23)] rounded-md">
              Yellow
            </div>
          </div>
          {Object.keys(yellowValues).map((key, index) => {
            return (
              <FieldValue
                key={index}
                index={index}
                value={displayValue(yellowValues[key])}
                className="justify-center"
              />
            );
          })}
        </section>

        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-[rgb(255,107,4)] font-semibold text-lg mt-4 mb-4 text-center shadow-[0_0_8px_0_rgb(255,107,4)] rounded-md ">
              Orange
            </div>
          </div>
          {Object.keys(orangeValues).map((key, index) => {
            return (
              <FieldValue
                key={index}
                index={index}
                value={displayValue(orangeValues[key])}
                className="justify-center"
              />
            );
          })}
        </section>
        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-[rgb(255,0,0)] font-semibold text-lg mt-4 mb-4 text-center shadow-[0_0_8px_0_rgb(255,0,0)] rounded-md">
              Red
            </div>
          </div>
          {Object.keys(redValues).map((key, index) => {
            return (
              <FieldValue
                key={index}
                index={index}
                value={displayValue(redValues[key])}
                className="justify-center"
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default SimilarityChart;
