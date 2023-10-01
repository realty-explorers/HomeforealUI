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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type SaleComparableIndicatorsProps = {};
const SaleComparableIndicators = (props: SaleComparableIndicatorsProps) => {
  return (
    <div className="flex w-full items-center gap-4 p-4 ">
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
            $ 270,000
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
            $ 330,000
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SaleComparableIndicators;
