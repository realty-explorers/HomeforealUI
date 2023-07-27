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
import analyticsStyles from '../Analytics.module.scss';
import styles from './OperationalExpanses.module.scss';
import ExpansesRow from './ExpansesRow';
import MonthlyExpanses from './MonthlyExpases';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}));

type OperationalExpansesProps = {
  property: Property;
};
const OperationalExpanses = (props: OperationalExpansesProps) => {
  return (
    <Grid
      container
      className={`${analyticsStyles.sectionContainer}`}
      alignItems="center"
      justifyContent="center"
      rowGap={3}
    >
      <Grid item xs={6}>
        <h1 className={analyticsStyles.sectionHeader}>Operational Expanses</h1>
      </Grid>
      <Grid item xs={6}>
        <ValueCard title="Annual Expanses" value="$6,600" />
      </Grid>
      <MonthlyExpanses />
    </Grid>
  );
};

export default OperationalExpanses;
