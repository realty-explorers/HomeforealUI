import AnalyzedProperty from "@/models/analyzedProperty";
import { selectProperties } from "@/store/slices/propertiesSlice";
import { priceFormatter } from "@/utils/converters";
import { Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./PropertyHeaderStyles.module.scss";
import HelpIcon from "@mui/icons-material/Help";
import clsx from "clsx";

//bg-green-200
//bg-purple-200
//bg-green-500
//bg-purple-500
//bg-green-600
//bg-purple-600
const MarginInfoChips = (
  { amount, percent, margin, color, name },
) => {
  return (
    <div className="flex ml-12">
      <div
        className={clsx([
          "rounded-lg flex items-center py-2  pr-12 pl-4 justify-center",
          `bg-${color}-200`,
        ])}
      >
        <Typography className=" font-poppins font-bold text-xl flex justify-center w-32">
          {priceFormatter(amount.toFixed())}
        </Typography>
      </div>
      <div
        className={clsx([
          "px-2 text-white rounded-lg -ml-8 py-2 flex flex-col items-center w-16",
          `bg-${color}-600`,
        ])}
      >
        <Typography className=" font-poppins font-bold ">
          {percent}%
        </Typography>

        <Typography className=" font-poppins font-bold text-[0.5rem]">
          Under
        </Typography>
      </div>
      <div
        className={clsx([
          " px-2 text-white rounded-lg ml-4 py-2 flex flex-col items-center",
          `bg-${color}-500`,
        ])}
      >
        <Typography className=" font-poppins font-bold ">
          {margin}%
        </Typography>

        <Typography className=" font-poppins font-bold text-[0.5rem]">
          Net Margin
        </Typography>
      </div>
    </div>
  );
};

type MarginInfoProps = {};
const MarginInfo = (props: MarginInfoProps) => {
  const { selectedProperty, selectedComps, saleCalculatedProperty } =
    useSelector(
      selectProperties,
    );
  // const profitMargin = props.property?.listing_price > 0
  //   ? (props.property?.arv_price -
  //     props.property?.listing_price - 0) / props.property?.listing_price * 100
  //   : null;
  // const compsMargin = props.property?.listing_price > 0
  //   ? (props.property?.sales_comps_price -
  //     props.property?.listing_price - 0) / props.property?.sales_comps_price * 100
  //   : null;
  //
  // const profitMargin = props.property?.margin_percentage;
  return (saleCalculatedProperty?.sales_comps?.data?.length > 0 &&
    (
      <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-y-4 mt-8 items-center">
        <Typography className="font-poppins text-2xl">
          Sale Comparable
        </Typography>
        <MarginInfoChips
          amount={saleCalculatedProperty?.sales_comps_price}
          percent={saleCalculatedProperty?.sales_comps_percentage.toFixed()}
          margin={saleCalculatedProperty.margin_percentage.toFixed()}
          color="purple"
          name="Under Comps"
        />

        <Typography className="font-poppins text-2xl">
          Top 25th ARV
        </Typography>

        <MarginInfoChips
          amount={saleCalculatedProperty?.arv_price}
          percent={saleCalculatedProperty?.arv_percentage.toFixed()}
          margin={saleCalculatedProperty.margin_percentage.toFixed()}
          color="green"
          name="Under ARV"
        />
      </div>
    ));
};

export default MarginInfo;
