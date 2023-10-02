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

type InitialInvestmentProps = {
  property: AnalyzedProperty;
  setExpanses: (value: number) => void;
  active: boolean;
  toggleActive: () => void;
};
const InitialInvestment = (props: InitialInvestmentProps) => {
  const priceTypes = [
    { label: "ARV", value: props.property?.arv },
    { label: "Listing Price", value: props.property?.listing_price || 0 },
  ];

  const [expanses, setExpanses] = useState<Expanse[]>([]);

  useEffect(() => {
    setExpanses([
      {
        id: uuidv4(),
        label: "Down Payment",
        value: 0,
        priceType: priceTypes[0],
      },
      {
        id: uuidv4(),
        label: "Loan Amount",
        value: 0,
        priceType: priceTypes[0],
      },
      {
        id: uuidv4(),
        label: "Origination Fee",
        value: 0,
        priceType: priceTypes[0],
      },
      {
        id: uuidv4(),
        label: "Interest Rate",
        value: 0,
        priceType: priceTypes[0],
      },
      { id: uuidv4(), label: "Points", value: 0, priceType: priceTypes[0] },
    ]);
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
          Initial Investment
        </Typography>
      </Grid>
      <Grid item container xs={6} justifyContent="center">
        <Typography className={styles.totalExpansesLabel}>
          {priceFormatter(Math.round(totalExpanses(expanses)))}
        </Typography>
      </Grid>
      <List>
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

export default InitialInvestment;
