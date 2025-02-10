import { useEffect, useState } from "react";
import { Grid, TableCell } from "@mui/material";
import ValueCard from "@/components/Cards/ValueCard";
import analyticsStyles from "../../Analytics.module.scss";
import MonthlyExpenses from "./MonthlyExpenses";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";

type ExpensesCalculatorProps = {
  property: AnalyzedProperty;
};
const ExpensesCalculator = (props: ExpensesCalculatorProps) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    number
  >(0);
  const [monthlyExpensesActive, setMonthlyExpensesActive] = useState(true);

  const totalExpenses = monthlyExpensesActive ? monthlyExpenses : 0;

  useEffect(() => {
    setMonthlyExpensesActive(true);
  }, [props.property]);

  return (props.property?.rents_comps?.data?.length > 0 &&
    (
      <div className="p-4">
        <Grid
          className={`${analyticsStyles.blackBorderedSection} ${analyticsStyles.sectionContainer}`}
        >
          <Grid container justifyContent="center" rowGap={3}>
            <Grid item xs={6}>
              <h1 className={analyticsStyles.sectionHeader}>
                Operational Expenses
              </h1>
            </Grid>
            <Grid item xs={6} className="sticky top-0 z-[2]">
              <ValueCard
                title="Annual Expenses"
                value={priceFormatter(totalExpenses.toFixed())}
              />
            </Grid>
            <MonthlyExpenses
              property={props.property}
              setExpenses={setMonthlyExpenses}
              active={monthlyExpensesActive}
              toggleActive={() => setMonthlyExpensesActive((prev) => !prev)}
            />
          </Grid>
        </Grid>
      </div>
    ));
};

export default ExpensesCalculator;
