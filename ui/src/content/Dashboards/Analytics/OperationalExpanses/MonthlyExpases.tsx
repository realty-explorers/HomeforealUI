import { useState } from 'react';
import { Button, Checkbox, Grid, Grow, Typography } from '@mui/material';
import ExpansesRow from './ExpansesRow';
import styles from './ExpansesCalculator.module.scss';

type MonthlyExpansesProps = {};
const MonthlyExpanses = (props: MonthlyExpansesProps) => {
  const [expanses, setExpanses] = useState<string[]>([
    'Property Tax',
    'Insurance',
    'Maintenance',
    'Management',
    'Vacancy Rate'
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
          Monthly Expanses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>
          $550/Month
        </Typography>
      </Grid>
      {expanses.map((expanse, index) => (
        <Grow in={expanses.includes(expanse)} key={index}>
          <div>
            <ExpansesRow
              label={expanse}
              key={index}
              removeExpanse={handleRemoveExpanse}
            />
          </div>
        </Grow>
      ))}
      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton} onClick={handleAddExpanse}>
          <Typography className={styles.buttonText}>Add Expanses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default MonthlyExpanses;
