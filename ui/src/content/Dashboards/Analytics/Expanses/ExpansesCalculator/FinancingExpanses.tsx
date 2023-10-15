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
import ExpansesRow, { Expanse } from "../ExpansesRow";
import styles from "../ExpansesCalculator.module.scss";
import { TransitionGroup } from "react-transition-group";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";
import clsx from "clsx";

type FinancingExpansesProps = {
  property: AnalyzedProperty;
  setExpanses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};

const FinancingExpanses = (props: FinancingExpansesProps) => {
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

  const [downPayment, setDownPayment] = useState<Expanse>({
    ...defaultDownPayment,
  });
  const [loanAmount, setLoanAmount] = useState<Expanse>({
    ...defaultLoanAmount,
  });
  const [originationFee, setOriginationFee] = useState<Expanse>({
    ...defaultOriginationFee,
  });
  const [expanses, setExpanses] = useState<Expanse[]>([]);
  const [months, setMonths] = useState<number>(defaultMonths);
  const [interestRate, setInterestRate] = useState<number>(defaultInterestRate);

  useEffect(() => {
    setExpanses([
      { ...defaultOriginationFee },
    ]);
    setMonths(defaultMonths);
    setInterestRate(defaultInterestRate);
    setDownPayment({ ...defaultDownPayment });
    setLoanAmount({ ...defaultLoanAmount });
  }, [props.property]);

  const handleChangeExpanses = (changedExpanse: Expanse) => {
    const expanseIndex = expanses.findIndex(
      (expanse) => expanse.id === changedExpanse.id,
    );
    if (expanseIndex === -1) return;
    expanses[expanseIndex] = changedExpanse;
    setExpanses([...expanses]);
    props.setExpanses(totalExpanses(expanses));
  };

  const handleChangeDownPayment = (changedExpanse: Expanse) => {
    setDownPayment(changedExpanse);
    const loanAmountValue = changedExpanse.priceType.value -
      changedExpanse.value;
    setLoanAmount({
      ...loanAmount,
      priceType: changedExpanse.priceType,
      value: loanAmountValue,
    });
    props.setExpanses(totalExpanses(expanses, loanAmountValue));
  };

  const handleChangeLoanAmount = (changedExpanse: Expanse) => {
    setLoanAmount(changedExpanse);
    const loanAmountValue = changedExpanse.priceType.value -
      changedExpanse.value;
    setDownPayment({
      ...downPayment,
      priceType: changedExpanse.priceType,
      value: loanAmountValue,
    });
    props.setExpanses(totalExpanses(expanses, changedExpanse.value));
  };

  const handleChangeInterestRate = (value: number) => {
    setInterestRate(value);
    props.setExpanses(totalExpanses(expanses, undefined, value));
  };

  const handleChangeMonths = (value: number) => {
    setMonths(value);
    props.setExpanses(totalExpanses(expanses, undefined, undefined, value));
  };

  const totalExpanses = (
    expanses: Expanse[],
    totalLoan?: number,
    interest?: number,
    duration?: number,
  ) => {
    const expansesSum = expanses.reduce(
      (acc, expanse) => acc + Math.round(expanse.value),
      0,
    );
    const loanExpanse = (totalLoan ?? loanAmount.value) *
      (interest ?? interestRate) / 100 *
      (duration ?? months) / 12;
    return expansesSum + loanExpanse;
  };

  const handleAddExpanse = () => {
    setExpanses([
      ...expanses,
      {
        id: uuidv4(),
        label: `New Expanse`,
        value: 0,
        priceType: priceTypes[0],
      },
    ]);
  };

  const handleRemoveExpanse = (id) => {
    const updatedExpanses = expanses.filter(
      (expanse) => expanse.id !== id,
    );
    setExpanses(updatedExpanses);
    props.setExpanses(totalExpanses(updatedExpanses));
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
          Financing Expanses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>
          {priceFormatter(
            Math.round(totalExpanses(expanses)),
          )}
        </Typography>
      </Grid>
      <List>
        <ExpansesRow
          expanse={downPayment}
          setExpanse={(expanse) => handleChangeDownPayment(expanse)}
          priceTypes={priceTypes}
        />

        <ExpansesRow
          expanse={loanAmount}
          setExpanse={(expanse) => handleChangeLoanAmount(expanse)}
          priceTypes={priceTypes}
        />

        <ExpansesRow
          expanse={expanses[0]}
          setExpanse={(expanse) => handleChangeExpanses(expanse)}
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
        <Button className={styles.addButton} onClick={handleAddExpanse}>
          <Typography className={styles.buttonText}>Add Expanses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default FinancingExpanses;
