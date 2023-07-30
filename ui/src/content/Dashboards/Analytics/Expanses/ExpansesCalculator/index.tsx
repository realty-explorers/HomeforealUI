import { useState } from 'react';
import Property from '@/models/property';
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
  Typography
} from '@mui/material';
import GridField from '@/components/Grid/GridField';
import ValueCard from '@/components/Cards/ValueCard';
import styled from '@emotion/styled';
import analyticsStyles from '../../Analytics.module.scss';
import styles from './ExpansesCalculator.module.scss';
import ExpansesRow from '../ExpansesRow';
import InitialInvestment from './InitialInvestment';
import FinancingExpanses from './FinancingExpanses';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

type ExpansesCalculatorProps = {
  property: Property;
};
const ExpansesCalculator = (props: ExpansesCalculatorProps) => {
  return (
    <Grid
      className={`${analyticsStyles.blackBorderedSection} ${analyticsStyles.sectionContainer}`}
      // sx={{ display: 'flex' }}
    >
      <Grid container justifyContent="center" rowGap={3}>
        <Grid item xs={6}>
          <h1 className={analyticsStyles.sectionHeader}>Expanses Calculator</h1>
        </Grid>
        <Grid item xs={6}>
          <ValueCard title="Estimated Expanses" value="$27,000" />
        </Grid>
        <InitialInvestment />
        <FinancingExpanses />
      </Grid>
    </Grid>
  );
};

export default ExpansesCalculator;
