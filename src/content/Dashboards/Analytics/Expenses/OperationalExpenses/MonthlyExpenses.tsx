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

type MonthlyExpensesProps = {
  property: AnalyzedProperty;
  setExpenses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};
const MonthlyExpenses = (props: MonthlyExpensesProps) => {
  const priceTypes = [
    { label: 'ARV', value: props.property?.arv_price },
    { label: 'Listing Price', value: props.property?.price || 0 },
    {
      label: 'Annual Rent',
      value: props.property?.rental_comps_price * 12 || 0
    }
    // {
    //   label: "Rental Price",
    //   value: typeof props.property?.rents_listing_price === "number"
    //     ? props.property?.rents_listing_price
    //     : 0,
    // },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const defaultMaintenance = props.property?.rental_comps_price * 12 * 0.08;
    const defaultManagement = props.property?.rental_comps_price * 12 * 0.1;
    const defaultVacancy = props.property?.rental_comps_price * 12 * 0.07;
    const defaultExpenses = [
      {
        id: uuidv4(),
        label: 'Property Tax',
        value:
          props.property?.operational_expenses?.property_tax?.expense_amount ||
          0,
        priceType:
          props.property.operational_expenses?.property_tax?.expense_ref ===
          'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Insurance',
        value:
          props.property?.operational_expenses?.insurance?.expense_amount || 0,
        priceType:
          props.property?.operational_expenses?.insurance?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Maintenance',
        value:
          props.property?.operational_expenses?.maintenance?.expense_amount ||
          defaultMaintenance,
        priceType:
          props.property.operational_expenses?.maintenance?.expense_ref ===
          'arv'
            ? priceTypes[0]
            : priceTypes[1]
      },
      {
        id: uuidv4(),
        label: 'Management',
        value:
          props.property?.operational_expenses?.management?.expense_amount ||
          defaultManagement,
        priceType:
          props.property.operational_expenses?.management?.expense_ref === 'arv'
            ? priceTypes[0]
            : priceTypes[2]
      },
      {
        id: uuidv4(),
        label: 'Vacancy',
        value:
          props.property?.operational_expenses?.vacancy?.expense_amount ||
          defaultVacancy,
        priceType:
          props.property.operational_expenses?.vacancy?.expense_ref === 'arv'
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
    const updatedExpenses = expenses.filter((expanse) => expanse.id !== id);
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
          Monthly Expenses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center" alignItems="center">
        <Typography className={styles.totalExpensesLabel}>
          {priceFormatter(Math.round(totalExpenses(expenses) / 12))}/Monthly
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

export default MonthlyExpenses;
