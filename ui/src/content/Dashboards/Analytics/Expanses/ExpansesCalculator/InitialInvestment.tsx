import { useEffect, useState } from "react";
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
import ExpansesRow from "../ExpansesRow";
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

  const [expanses, setExpanses] = useState<
    { id: string; label: string; value: number }[]
  >(
    [],
  );

  useEffect(() => {
    setExpanses([
      { id: crypto.randomUUID(), label: "Down Payment", value: 0 },
      { id: crypto.randomUUID(), label: "Loan Amount", value: 0 },
      { id: crypto.randomUUID(), label: "Origination Fee", value: 0 },
      { id: crypto.randomUUID(), label: "Interest Rate", value: 0 },
      { id: crypto.randomUUID(), label: "Points", value: 0 },
    ]);
  }, [props.property]);

  const handleChangeExpanses = (value: number, id: string) => {
    expanses.find((e) => e.id === id).value = value;
    setExpanses([...expanses]);
    props.setExpanses(totalExpanses(expanses));
  };

  const totalExpanses = (expanses) =>
    expanses.reduce((acc, expanse) => acc + Math.round(expanse.value), 0);

  const handleAddExpanse = () => {
    setExpanses([
      ...expanses,
      {
        id: crypto.randomUUID(),
        label: `New Expanse`,
        value: 0,
      },
    ]);
  };

  const handleRemoveExpanse = (id: string) => {
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
                id={expanse.id}
                label={expanse.label}
                expanse={expanse.value}
                removeExpanse={handleRemoveExpanse}
                setExpanse={(value) => handleChangeExpanses(value, expanse.id)}
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
