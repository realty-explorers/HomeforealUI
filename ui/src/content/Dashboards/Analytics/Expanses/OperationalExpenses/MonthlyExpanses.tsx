import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  Typography,
} from "@mui/material";
import ExpansesRow, { Expanse } from "../ExpansesRow";
import styles from "../ExpansesCalculator.module.scss";
import { TransitionGroup } from "react-transition-group";
import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";

type MonthlyExpansesProps = {
  property: AnalyzedProperty;
  setExpanses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};
const MonthlyExpanses = (props: MonthlyExpansesProps) => {
  const priceTypes = [
    { label: "ARV", value: props.property?.arv_price },
    { label: "Listing Price", value: props.property?.listing_price || 0 },
    // {
    //   label: "Rental Price",
    //   value: typeof props.property?.rents_listing_price === "number"
    //     ? props.property?.rents_listing_price
    //     : 0,
    // },
  ];

  const [expanses, setExpanses] = useState<Expanse[]>([]);

  useEffect(() => {
    const defaultExpanses = [
      {
        id: uuidv4(),
        label: "Property Tax",
        value:
          props.property?.operational_expenses?.property_tax?.expense_amount ||
          0,
        priceType:
          props.property.operational_expenses?.property_tax?.expense_ref ===
              "arv"
            ? priceTypes[0]
            : priceTypes[1],
      },
      {
        id: uuidv4(),
        label: "Insurance",
        value:
          props.property?.operational_expenses?.insurance?.expense_amount || 0,
        priceType:
          props.property.expenses?.operational_expenses?.insurance === "arv"
            ? priceTypes[0]
            : priceTypes[1],
      },
      {
        id: uuidv4(),
        label: "Maintenance",
        value:
          props.property?.operational_expenses?.maintenance?.expense_amount ||
          0,
        priceType:
          props.property.operational_expenses?.maintenance?.expense_ref ===
              "arv"
            ? priceTypes[0]
            : priceTypes[1],
      },
      {
        id: uuidv4(),
        label: "Management",
        value:
          props.property?.operational_expenses?.management?.expense_amount || 0,
        priceType:
          props.property.operational_expenses?.management?.expense_ref === "arv"
            ? priceTypes[0]
            : priceTypes[1],
      },
      {
        id: uuidv4(),
        label: "Vacancy",
        value: props.property?.operational_expenses?.vacancy?.expense_amount ||
          0,
        priceType:
          props.property.operational_expenses?.vacancy?.expense_ref === "arv"
            ? priceTypes[0]
            : priceTypes[1],
      },
    ];
    setExpanses(defaultExpanses);
    props.setExpanses(totalExpanses(defaultExpanses));
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

  const totalExpanses = (expanses) =>
    expanses.reduce((acc, expanse) => acc + Math.round(expanse.value), 0);

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
          Monthly Expenses
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>
          {priceFormatter(Math.round(totalExpanses(expanses) / 12))}/Monthly
        </Typography>
      </Grid>
      <List className="w-full">
        <TransitionGroup>
          {expanses.map((expanse, index) => (
            <Collapse key={expanse.id}>
              <ExpansesRow
                expanse={expanse}
                removeExpanse={handleRemoveExpanse}
                setExpanse={(expanse) => handleChangeExpanses(expanse)}
                priceTypes={priceTypes}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>

      <Grid item xs={12} justifyContent="flex-start">
        <Button className={styles.addButton} onClick={handleAddExpanse}>
          <Typography className={styles.buttonText}>Add Expanses</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default MonthlyExpanses;
