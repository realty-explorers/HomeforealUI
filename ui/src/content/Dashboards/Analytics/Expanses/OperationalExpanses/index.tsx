import { useState } from "react";
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
} from "@mui/material";
import GridField from "@/components/Grid/GridField";
import ValueCard from "@/components/Cards/ValueCard";
import styled from "@emotion/styled";
import analyticsStyles from "../../Analytics.module.scss";
import MonthlyExpanses from "./MonthlyExpases";
import AnalyzedProperty from "@/models/analyzedProperty";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

type OperationalExpansesProps = {
  property: AnalyzedProperty;
};
const OperationalExpanses = (props: OperationalExpansesProps) => {
  return (
    <Grid
      className={`${analyticsStyles.blackBorderedSection} ${analyticsStyles.sectionContainer}`}
      rowGap={3}
    >
      <Grid container justifyContent="center" rowGap={3}>
        <Grid item xs={6}>
          <h1 className={analyticsStyles.sectionHeader}>
            Operational Expanses
          </h1>
        </Grid>
        <Grid item xs={6}>
          <ValueCard title="Annual Expanses" value="$6,600" />
        </Grid>
        <MonthlyExpanses />
      </Grid>
    </Grid>
  );
};

export default OperationalExpanses;
