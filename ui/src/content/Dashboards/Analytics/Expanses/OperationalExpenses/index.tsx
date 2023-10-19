import { useEffect, useState } from "react";
import { Grid, TableCell } from "@mui/material";
import ValueCard from "@/components/Cards/ValueCard";
import styled from "@emotion/styled";
import analyticsStyles from "../../Analytics.module.scss";
import styles from "./ExpansesCalculator.module.scss";
import ExpansesRow from "../ExpansesRow";
import MonthlyExpanses from "./MonthlyExpanses";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";

type ExpansesCalculatorProps = {
  property: AnalyzedProperty;
};
const ExpansesCalculator = (props: ExpansesCalculatorProps) => {
  const [monthlyExpanses, setMonthlyExpanses] = useState<
    number
  >(0);
  const [monthlyExpansesActive, setMonthlyExpansesActive] = useState(true);

  const totalExpanses = monthlyExpansesActive ? monthlyExpanses : 0;

  useEffect(() => {
    setMonthlyExpansesActive(true);
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
                Expanses Calculator
              </h1>
            </Grid>
            <Grid item xs={6} className="sticky top-0 z-[2]">
              <ValueCard
                title="Annual Expanses"
                value={priceFormatter(totalExpanses.toFixed())}
              />
            </Grid>
            <MonthlyExpanses
              property={props.property}
              setExpanses={setMonthlyExpanses}
              active={monthlyExpansesActive}
              toggleActive={() => setMonthlyExpansesActive((prev) => !prev)}
            />
          </Grid>
        </Grid>
      </div>
    ));
};

export default ExpansesCalculator;
