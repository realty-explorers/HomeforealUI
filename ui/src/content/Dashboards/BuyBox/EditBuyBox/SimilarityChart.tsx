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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import styles from "./EditBuyBoxDialog.module.scss";
import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";

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
          "flex items-center h-full border-b border-white py-2 text-white",
          className,
        ])}
      >
        <span className="font-semibold text-white">
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

  const greenValues = useWatch({ control, name: "similarity.green" });
  const yellowValues = useWatch({ control, name: "similarity.yellow" });
  const orangeValues = useWatch({ control, name: "similarity.orange" });
  const redValues = useWatch({ control, name: "similarity.red" });

  const displayValue = (value: any) => {
    if (Array.isArray(value)) {
      return value[0]
        ? (!Array.isArray(value[1])
          ? `${value[1]}`
          : `${value[1][0]} - ${value[1][1]}`)
        : "All";
    }
    return value ? <CheckCircleOutlineRoundedIcon htmlColor="white" /> : "Any";
  };

  return (
    <div className="col-span-2 mt-12">
      <div
        className={clsx([
          "max-w-sm mx-auto md:max-w-none grid md:grid-cols-5 md:-mx-6 text-sm  rounded-md",
          "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700",
        ])}
      >
        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-white font-semibold text-lg mt-4 mb-4 text-center">
              Group
            </div>
          </div>
          {Object.keys(greenValues ?? {}).map((key, index) => {
            return <FieldValue key={index} index={index} value={key} />;
          })}
        </section>

        <section className="">
          <div
            className=" px-6 flex flex-col justify-end max-md:hidden md:order-1"
            aria-hidden="true"
          >
            <div className="py-2 text-green-300 font-semibold text-lg mt-4 mb-4 text-center shadow rounded-md">
              Green
            </div>
          </div>

          {Object.keys(greenValues ?? {}).map((key, index) => {
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
            <div className="py-2 text-yellow-400 font-semibold text-lg mt-4 mb-4 text-center shadow rounded-md">
              Yellow
            </div>
          </div>
          {Object.keys(yellowValues ?? {}).map((key, index) => {
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
            <div className="py-2 text-orange-400 font-semibold text-lg mt-4 mb-4 text-center shadow rounded-md ">
              Orange
            </div>
          </div>
          {Object.keys(orangeValues ?? {}).map((key, index) => {
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
            <div className="py-2 text-[red] font-semibold text-lg mt-4 mb-4 text-center shadow rounded-md">
              Red
            </div>
          </div>
          {Object.keys(redValues ?? {}).map((key, index) => {
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
