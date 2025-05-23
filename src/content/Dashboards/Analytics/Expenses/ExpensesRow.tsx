import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import styles from "./ExpensesCalculator.module.scss";
import { useEffect, useState } from "react";

type Expense = {
  id: string;
  label: string;
  value: number;
  priceType: { label: string; value: number };
};

type ExpansesRowProps = {
  expense: Expense;
  setExpense: (expanse: Expense) => void;
  removeExpense?: (id: string) => void;
  priceTypes: { label: string; value: number }[];
};
const ExpansesRow = (props: ExpansesRowProps) => {
  const [expanse, setExpanse] = useState<Expense>(props.expense);
  const handleChangeType = (event) => {
    const priceType = props.priceTypes.find(
      (type) => type.label === event.target.value,
    );
    expanse.priceType = priceType;
    props.setExpense(expanse);
    setExpanse(expanse);
  };

  const handleChangeAmount = (event) => {
    const value = event.target.value;
    expanse.value = parseFloat(value);
    props.setExpense(expanse);
  };

  const handleChangePercentage = (event) => {
    const value = event.target.value;
    const currentExpanse = expanse.priceType.value;
    expanse.value = (value * currentExpanse) / 100;
    props.setExpense(expanse);
  };

  useEffect(() => {
    setExpanse(props.expense);
  }, [props.expense]);

  return (
    expanse
      ? (
        <Grid container alignItems="center" columns={17}>
          <Grid item xs={4} padding={"0 1rem 0 1rem"}>
            <Typography className={styles.label}>
              {expanse.label}
            </Typography>
            {/* <span contentEditable className={styles.label}>{props.label}</span> */}
          </Grid>
          <Grid item xs={4} paddingX={1}>
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                value={expanse.priceType.label}
                label="Type"
                onChange={handleChangeType}
              >
                {props.priceTypes?.map((type, index) => (
                  <MenuItem key={index} value={type.label}>
                    {type.label}
                  </MenuItem>
                ))}
                {
                  /* <MenuItem value="listingPrice">Listing Price</MenuItem>
            <MenuItem value="arv">ARV</MenuItem> */
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} paddingX={1}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                type="number"
                id="outlined-adornment-amount"
                endAdornment={
                  <InputAdornment position="start">%</InputAdornment>
                }
                label="Amount"
                inputProps={{ min: 0, max: 100, step: 1 }}
                itemScope
                value={Math.round(
                  (expanse.value / expanse.priceType.value) * 100,
                )}
                onChange={handleChangePercentage}
              />
            </FormControl>
          </Grid>

          <Grid item xs={4} paddingX={1}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Amount"
                type="number"
                inputProps={{
                  min: 0,
                  max: expanse.priceType.value,
                  step: 1000,
                }}
                value={Math.round(expanse.value)}
                onChange={handleChangeAmount}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            {props.removeExpense && (
              <Grid container justifyContent="center">
                <IconButton
                  onClick={() => {
                    props.removeExpense(props.expense.id);
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      )
      : <></>
  );
};

export default ExpansesRow;
export type { Expense };
