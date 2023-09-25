import { useEffect, useState } from "react";
import Property from "@/models/property";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
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
import analyticsStyles from "../../Analytics.module.scss";
import styles from "./ExpansesCalculator.module.scss";
import ExpansesRow from "../ExpansesRow";
import InitialInvestment from "./InitialInvestment";
import FinancingExpanses from "./FinancingExpanses";
import { set } from "nprogress";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type ExpansesCalculatorProps = {
  property: AnalyzedProperty;
};
const ExpansesCalculator = (props: ExpansesCalculatorProps) => {
  const [initialInvestmentExpanses, setInitialInvestmentExpanses] = useState<
    number
  >(0);
  const [financingExpanses, setFinancingExpanses] = useState<number>(0);
  const [initialInvestmentActive, setInitialInvestmentActive] = useState(true);
  const [finanicingExpansesActive, setFinancingExpansesActive] = useState(
    false,
  );

  const totalExpanses =
    (initialInvestmentActive ? initialInvestmentExpanses : 0) +
    (finanicingExpansesActive ? financingExpanses : 0);

  useEffect(() => {
    setInitialInvestmentExpanses(0);
    setFinancingExpanses(0);
    setInitialInvestmentActive(true);
    setFinancingExpansesActive(false);
  }, [props.property]);

  return (
    <Grid
      className={`${analyticsStyles.blackBorderedSection} ${analyticsStyles.sectionContainer}`}
    >
      <Grid container justifyContent="center" rowGap={3}>
        <Grid item xs={6}>
          <h1 className={analyticsStyles.sectionHeader}>Expanses Calculator</h1>
        </Grid>
        <Grid item xs={6} className="sticky top-0 z-[2]">
          <ValueCard
            title="Estimated Expanses"
            value={priceFormatter(totalExpanses.toFixed())}
          />
        </Grid>
        <InitialInvestment
          property={props.property}
          setExpanses={setInitialInvestmentExpanses}
          active={initialInvestmentActive}
          toggleActive={() => setInitialInvestmentActive((prev) => !prev)}
        />
        <FinancingExpanses
          property={props.property}
          setExpanses={setFinancingExpanses}
          active={finanicingExpansesActive}
          toggleActive={() => setFinancingExpansesActive((prev) => !prev)}
        />
      </Grid>
    </Grid>
  );
};

export default ExpansesCalculator;
