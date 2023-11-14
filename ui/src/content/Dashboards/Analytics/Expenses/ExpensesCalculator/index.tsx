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
import styles from "./ExpensesCalculator.module.scss";
import ExpensesRow from "../ExpensesRow";
import InitialInvestment from "./InitialInvestment";
import FinancingExpenses from "./FinancingExpenses";
import { set } from "nprogress";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type ExpensesCalculatorProps = {
  property: AnalyzedProperty;
};
const ExpensesCalculator = (props: ExpansesCalculatorProps) => {
  const [initialInvestmentExpenses, setInitialInvestmentExpanses] = useState<
    number
  >(0);
  const [financingExpenses, setFinancingExpenses] = useState<number>(0);
  const [initialInvestmentActive, setInitialInvestmentActive] = useState(true);
  const [financingExpensesActive, setFinancingExpensesActive] = useState(
    false,
  );

  const totalExpenses =
    (initialInvestmentActive ? initialInvestmentExpenses : 0) +
    (financingExpensesActive ? financingExpenses : 0);

  useEffect(() => {
    setInitialInvestmentActive(true);
    setFinancingExpensesActive(false);
  }, [props.property]);

  return (
    <div className="p-4">
      <Grid
        className={`${analyticsStyles.blackBorderedSection} ${analyticsStyles.sectionContainer}`}
      >
        <Grid container justifyContent="center" rowGap={3}>
          <Grid item xs={6}>
            <h1 className={analyticsStyles.sectionHeader}>
              Expenses Calculator
            </h1>
          </Grid>
          <Grid item xs={6} className="sticky top-0 z-[2]">
            <ValueCard
              title="Estimated Expenses"
              value={priceFormatter(totalExpenses.toFixed())}
            />
          </Grid>
          <InitialInvestment
            property={props.property}
            setExpenses={setInitialInvestmentExpanses}
            active={initialInvestmentActive}
            toggleActive={() => setInitialInvestmentActive((prev) => !prev)}
          />
          <FinancingExpenses
            property={props.property}
            setExpenses={setFinancingExpenses}
            active={financingExpensesActive}
            toggleActive={() => setFinancingExpensesActive((prev) => !prev)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpensesCalculator;
