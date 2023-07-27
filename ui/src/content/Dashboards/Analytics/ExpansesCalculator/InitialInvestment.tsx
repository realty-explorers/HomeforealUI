import { useState } from 'react';
import { Button, Checkbox, Grid, Typography } from '@mui/material';
import ExpansesRow from './ExpansesRow';
import styles from './ExpansesCalculator.module.scss';

type InitialInvestmentProps = {};
const InitialInvestment = (props: InitialInvestmentProps) => {
  const [expanses, setExpanses] = useState<string[]>([
    'Fixed Fee',
    'Closing Cost',
    'Immediate Repairs',
    'Rehab',
    'Selling Fee'
  ]);

  const handleAddExpanse = () => {
    setExpanses([...expanses, 'New Expanse']);
  };

  const handleRemoveExpanse = (label: string) => {
    setExpanses(expanses.filter((expanse) => expanse !== label));
  };

  return (
    <Grid container>
      <Grid container justifyContent="center" alignItems="center" xs={6}>
        <Checkbox title="Select this property" />
        <Typography className={styles.checkboxLabel}>
          Initial Investment
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>$7,250</Typography>
      </Grid>
      {expanses.map((expanse, index) => (
        <ExpansesRow
          label={expanse}
          key={index}
          removeExpanse={handleRemoveExpanse}
        />
      ))}
      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton} onClick={handleAddExpanse}>
          <Typography className={styles.buttonText}>Add Expanses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InitialInvestment;
