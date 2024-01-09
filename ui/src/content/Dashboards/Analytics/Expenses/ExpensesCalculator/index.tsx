import { useEffect, useState } from "react";
import { Grid, TableCell } from "@mui/material";
import ValueCard from "@/components/Cards/ValueCard";
import analyticsStyles from "../../Analytics.module.scss";
import InitialInvestment from "./InitialInvestment";
import FinancingExpenses from "./FinancingExpenses";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";
import { useDispatch } from "react-redux";
import {
  setFinancingCosts,
  setInitialInvestment,
} from "@/store/slices/expensesSlice";

type ExpensesCalculatorProps = {
  property: AnalyzedProperty;
};
const ExpensesCalculator = (props: ExpensesCalculatorProps) => {
  const dispatch = useDispatch();
  const [initialInvestmentExpenses, setInitialInvestmentExpenses] = useState<
    number
  >(0);
  const [financingExpenses, setFinancingExpenses] = useState<number>(0);
  const [initialInvestmentActive, setInitialInvestmentActive] = useState(true);
  const [financingExpensesActive, setFinancingExpensesActive] = useState(
    false,
  );

  const handleChangeInitialInvestmentExpenses = (value: number) => {
    setInitialInvestmentExpenses(value);
    if (initialInvestmentActive) {
      dispatch(setInitialInvestment(value));
    }
  };

  const handleChangeFinancingExpenses = (value: number) => {
    setFinancingExpenses(value);
    if (financingExpensesActive) {
      dispatch(setFinancingCosts(value));
    }
  };

  const handleChangeInitialInvestmentActive = () => {
    setInitialInvestmentActive((prev) => !prev);
    dispatch(
      setInitialInvestment(
        initialInvestmentActive ? 0 : initialInvestmentExpenses,
      ),
    );
  };

  const handleChangeFinancingExpensesActive = () => {
    setFinancingExpensesActive((prev) => !prev);
    dispatch(
      setFinancingCosts(financingExpensesActive ? 0 : financingExpenses),
    );
  };

  const totalExpenses =
    (initialInvestmentActive ? initialInvestmentExpenses : 0) +
    (financingExpensesActive ? financingExpenses : 0);

  useEffect(() => {
    setInitialInvestmentActive(true);
    setFinancingExpensesActive(false);
  }, [props.property]);

  return (
    <div className="hidden md:flex p-4">
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
            setExpenses={handleChangeInitialInvestmentExpenses}
            active={initialInvestmentActive}
            toggleActive={handleChangeInitialInvestmentActive}
          />
          <FinancingExpenses
            property={props.property}
            setExpenses={handleChangeFinancingExpenses}
            active={financingExpensesActive}
            toggleActive={handleChangeFinancingExpensesActive}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpensesCalculator;
