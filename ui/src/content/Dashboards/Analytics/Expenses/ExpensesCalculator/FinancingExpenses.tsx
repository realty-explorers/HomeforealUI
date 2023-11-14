import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Checkbox,
  Collapse,
  Fade,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ExpensesRow, { Expense } from "../ExpensesRow";
import styles from "../ExpensesCalculator.module.scss";
import { TransitionGroup } from "react-transition-group";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";
import clsx from "clsx";

type FinancingExpensesProps = {
  property: AnalyzedProperty;
  setExpenses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};

const FinancingExpenses = (props: FinancingExpensesProps) => {
  const priceTypes = [
    { label: "ARV", value: props.property?.arv_price },
    { label: "Listing Price", value: props.property?.listing_price || 0 },
  ];

  const defaultLoanAmount = {
    id: uuidv4(),
    label: "Loan Amount",
    value: props.property?.loan?.amount?.expense_amount || 0,
    priceType: props.property?.loan?.amount?.expense_ref === "arv"
      ? priceTypes[0]
      : priceTypes[1],
  };

  const defaultDownPayment = {
    id: uuidv4(),
    label: "Down Payment",
    value: defaultLoanAmount.priceType.value - defaultLoanAmount.value,
    priceType: props.property?.loan?.down_payment?.expense_ref === "arv"
      ? priceTypes[0]
      : priceTypes[1],
  };

  const defaultOriginationFee = {
    id: uuidv4(),
    label: "Origination Fee",
    value: props.property?.loan?.closing_cost?.expense_amount || 0,
    priceType: props.property?.loan?.closing_cost?.expense_ref === "arv"
      ? priceTypes[0]
      : priceTypes[1],
  };

  const defaultInterestRate = props.property?.loan?.interest_rate || 0;
  const defaultMonths = props.property?.loan?.duration || 0;

  const [downPayment, setDownPayment] = useState<Expense>({
    ...defaultDownPayment,
  });
  const [loanAmount, setLoanAmount] = useState<Expense>({
    ...defaultLoanAmount,
  });
  const [originationFee, setOriginationFee] = useState<Expense>({
    ...defaultOriginationFee,
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [months, setMonths] = useState<number>(defaultMonths);
  const [interestRate, setInterestRate] = useState<number>(defaultInterestRate);

  useEffect(() => {
    const defaultExpenses = [{ ...defaultOriginationFee }];
    setExpenses(defaultExpenses);
    setMonths(defaultMonths);
    setInterestRate(defaultInterestRate);
    setDownPayment({ ...defaultDownPayment });
    setLoanAmount({ ...defaultLoanAmount });
    props.setExpenses(
      totalExpenses(
        defaultExpenses,
        defaultLoanAmount.value,
        defaultInterestRate,
        defaultMonths,
      ),
    );
  }, [props.property]);

  const handleChangeExpenses = (changedExpense: Expense) => {
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === changedExpense.id,
    );
    if (expenseIndex === -1) return;
    expenses[expenseIndex] = changedExpense;
    setExpenses([...expenses]);
    props.setExpenses(totalExpenses(expenses));
  };

  const handleChangeDownPayment = (changedExpense: Expense) => {
    setDownPayment(changedExpense);
    const loanAmountValue = changedExpense.priceType.value -
      changedExpense.value;
    setLoanAmount({
      ...loanAmount,
      priceType: changedExpense.priceType,
      value: loanAmountValue,
    });
    props.setExpenses(totalExpenses(expenses, loanAmountValue));
  };

  const handleChangeLoanAmount = (changedExpense: Expense) => {
    setLoanAmount(changedExpense);
    const loanAmountValue = changedExpense.priceType.value -
      changedExpense.value;
    setDownPayment({
      ...downPayment,
      priceType: changedExpense.priceType,
      value: loanAmountValue,
    });
    props.setExpenses(totalExpenses(expenses, changedExpense.value));
  };

  const handleChangeInterestRate = (value: number) => {
    setInterestRate(value);
    props.setExpenses(totalExpenses(expenses, undefined, value));
  };

  const handleChangeMonths = (value: number) => {
    setMonths(value);
    props.setExpenses(totalExpenses(expenses, undefined, undefined, value));
  };

  const totalExpenses = (
    Expenses: Expense[],
    totalLoan?: number,
    interest?: number,
    duration?: number,
  ) => {
    const ExpensesSum = expenses.reduce(
      (acc, expense) => acc + Math.round(expense.value),
      0,
    );
    const loanExpense = (totalLoan ?? loanAmount.value) *
      (interest ?? interestRate) / 100 *
      (duration ?? months) / 12;
    return ExpensesSum + loanExpense;
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: uuidv4(),
        label: `New Expense`,
        value: 0,
        priceType: priceTypes[0],
      },
    ]);
  };

  const handleRemoveExpense = (id) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== id,
    );
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
          Financing Expenses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpensesLabel}>
          {priceFormatter(
            Math.round(totalExpenses(expenses)),
          )}
        </Typography>
      </Grid>
      <List className="w-full">
        <ExpensesRow
          expense={downPayment}
          setExpense={(expense) => handleChangeDownPayment(expense)}
          priceTypes={priceTypes}
        />

        <ExpensesRow
          expense={loanAmount}
          setExpense={(expense) => handleChangeLoanAmount(expense)}
          priceTypes={priceTypes}
        />

        <ExpensesRow
          expense={expenses[0]}
          setExpense={(expense) => handleChangeExpenses(expense)}
          priceTypes={priceTypes}
        />
        <div className="flex py-2">
          <Typography
            className={clsx([styles.label, "w-1/4 px-4 flex items-center"])}
          >
            Interest Rate
          </Typography>
          <FormControl>
            <InputLabel htmlFor="outlined-adornment-amount">
              Interest Rate
            </InputLabel>
            <OutlinedInput
              type="number"
              id="outlined-adornment-amount"
              className="w-40"
              endAdornment={<InputAdornment position="start">%</InputAdornment>}
              label="Amount"
              inputProps={{ min: 0, step: 1 }}
              itemScope
              value={interestRate}
              onChange={(e) =>
                handleChangeInterestRate(parseInt(e.target.value))}
            />
          </FormControl>
        </div>

        <div className="flex pt-2">
          <Typography
            className={clsx([styles.label, "w-1/4 px-4 flex items-center"])}
          >
            Loan Duration
          </Typography>
          <FormControl>
            <InputLabel htmlFor="outlined-adornment-amount">
              Months
            </InputLabel>
            <OutlinedInput
              type="number"
              id="outlined-adornment-amount"
              className="w-40"
              endAdornment={
                <InputAdornment position="start">Months</InputAdornment>
              }
              label="Amount"
              inputProps={{ min: 0, step: 1 }}
              itemScope
              value={months}
              onChange={(e) => handleChangeMonths(parseInt(e.target.value))}
            />
          </FormControl>
        </div>
      </List>

      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton} onClick={handleAddExpense}>
          <Typography className={styles.buttonText}>Add Expenses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default FinancingExpenses;
