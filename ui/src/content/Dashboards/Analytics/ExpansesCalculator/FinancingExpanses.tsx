import { useState } from 'react';
import { Button, Checkbox, Grid, Typography } from '@mui/material';
import ExpansesRow from './ExpansesRow';
import styles from './ExpansesCalculator.module.scss';

type FinancingExpansesProps = {};
const FinancingExpanses = (props: FinancingExpansesProps) => {
  const [expanses, setExpanses] = useState<string[]>([
    'Down Payment',
    'Loan Amount',
    'Origination Fee',
    'Interest Rate',
    'Points'
  ]);
  return (
    <Grid container>
      <Grid container justifyContent="center" alignItems="center" xs={6}>
        <Checkbox title="Select this property" />
        <Typography className={styles.checkboxLabel}>
          Financing Expanses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>$7,250</Typography>
      </Grid>
      {expanses.map((expanse, index) => (
        <ExpansesRow label={expanse} key={index} />
      ))}
      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton}>
          <Typography className={styles.buttonText}>Add Expanses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default FinancingExpanses;
