import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Checkbox,
  Collapse,
  Fade,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import ExpensesRow, { Expense } from '../ExpensesRow';
import styles from '../ExpensesCalculator.module.scss';
import { TransitionGroup } from 'react-transition-group';
import AnalyzedProperty from '@/models/analyzedProperty';
import { priceFormatter } from '@/utils/converters';

type InitialInvestmentProps = {
  property: AnalyzedProperty;
  setExpenses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};
const InitialInvestment = (props: InitialInvestmentProps) => {
  const priceTypes = [
    { label: 'ARV', value: props.property?.arv_price },
    { label: 'Listing Price', value: props.property?.price || 0 }
  ];

  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const defaultExpenses = [
      {
        id: uuidv4(),
        label: 'Fixed Fee',
        value: props.property?.expenses?.fixed_fee?.expense_amount || 0,
        priceType:
          props.property.expenses?.fixed_fee?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Closing Fee',
        // value: props.property?.expenses?.closing_fee?.expense_amount || 0,
        value: 1000,
        priceType:
          props.property.expenses?.closing_fee?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Selling Fee',
        // value: props.property?.expenses?.selling_fee?.expense_amount || 0,
        value: props.property?.arv_price * 0.03,
        priceType:
          props.property.expenses?.selling_fee?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Rehab',
        value: props.property?.expenses?.rehab?.expense_amount || 0,
        priceType:
          props.property.expenses?.rehab?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[1]
      }
    ];
    setExpenses(defaultExpenses);
    props.setExpenses(totalExpenses(defaultExpenses));
  }, [props.property]);

  const handleChangeExpenses = (changedExpense: Expense) => {
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === changedExpense.id
    );
    if (expenseIndex === -1) return;
    expenses[expenseIndex] = changedExpense;
    setExpenses([...expenses]);
    props.setExpenses(totalExpenses(expenses));
  };

  const totalExpenses = (expenses) =>
    expenses.reduce((acc, expense) => acc + Math.round(expense.value), 0);

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: uuidv4(),
        label: `New Expense`,
        value: 0,
        priceType: priceTypes[0]
      }
    ]);
  };

  const handleRemoveExpense = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    props.setExpenses(totalExpenses(updatedExpenses));
  };

  return (
    <Grid container>
      <Grid container justifyContent="center" alignItems="center" item xs={6}>
        <Checkbox
          title="Select this property"
          checked={props.active}
          onChange={props.toggleActive}
        />
        <Typography className={styles.checkboxLabel}>
          Initial Investment
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center" alignItems="center">
        <Typography className={styles.totalExpensesLabel}>
          {priceFormatter(Math.round(totalExpenses(expenses)))}
        </Typography>
      </Grid>
      <List className="w-full">
        <TransitionGroup>
          {expenses.map((expense, index) => (
            <Collapse key={expense.id}>
              <ExpensesRow
                expense={expense}
                removeExpense={handleRemoveExpense}
                setExpense={(expense) => handleChangeExpenses(expense)}
                priceTypes={priceTypes}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>

      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton} onClick={handleAddExpense}>
          <Typography className={styles.buttonText}>Add Expenses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InitialInvestment;
