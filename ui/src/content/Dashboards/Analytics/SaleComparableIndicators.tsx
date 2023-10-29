import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import GridField from "@/components/Grid/GridField";
import ValueCard from "@/components/Cards/ValueCard";
import styled from "@emotion/styled";
import analyticsStyles from "./Analytics.module.scss";
import styles from "./SaleComparable.module.scss";
import ThemedButton from "@/components/Buttons/ThemedButton";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";
import { numberStringUtil, priceFormatter } from "@/utils/converters";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectProperties } from "@/store/slices/propertiesSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type SaleComparableIndicatorsProps = {
  property: AnalyzedProperty;
};
const SaleComparableIndicators = (props: SaleComparableIndicatorsProps) => {
  const { saleCalculatedProperty } = useSelector(selectProperties);
  return (saleCalculatedProperty?.sales_comps?.data?.length > 0 &&
    (
      <div className="flex w-full items-center gap-4 p-4 sticky top-0 z-[2] bg-[#f2f5f9]">
        <div className="grid grid-cols-2 gap-4 gap-x-20">
          <div className="flex">
            <Typography
              className={clsx([styles.header])}
            >
              Sale Comps
            </Typography>
          </div>
          <div className="flex">
            <Typography
              className={clsx([
                styles.indicator,
                "bg-[rgba(182,151,221,0.29)] ",
              ])}
            >
              {priceFormatter(
                saleCalculatedProperty?.sales_comps_price.toFixed(),
              )}
            </Typography>
          </div>

          <div className="flex">
            <Typography
              className={clsx([styles.header])}
            >
              Top 25th ARV
            </Typography>
          </div>
          <div className="flex">
            <Typography
              className={clsx([
                styles.indicator,
                "bg-[#D6FCD0] ",
              ])}
            >
              {priceFormatter(saleCalculatedProperty?.arv_price.toFixed())}
            </Typography>
          </div>
        </div>
      </div>
    ));
};

export default SaleComparableIndicators;
