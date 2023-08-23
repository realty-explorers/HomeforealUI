import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import styles from './ExpansesCalculator.module.scss';
import { useState } from 'react';

type ExpansesRowProps = {
  label: string;
  expanse: number;
  setExpanse: (newValue: number) => void;
  removeExpanse: (label) => void;
  priceTypes: { label: string; value: number }[];
};
const ExpansesRow = (props: ExpansesRowProps) => {
  const [selectedType, setSelectedType] = useState<string>(
    props.priceTypes?.[0].label
  );

  const handleChangeType = (event) => {
    setSelectedType(event.target.value);
  };

  const handleChangeAmount = (event) => {
    const value = event.target.value;
    props.setExpanse(parseFloat(value));
  };

  const handleChangePercentage = (event) => {
    const value = event.target.value;
    const currentExpanse = props.priceTypes?.find(
      (type) => type.label === selectedType
    )?.value;
    props.setExpanse((value * currentExpanse) / 100);
  };

  return (
    <Grid container alignItems="center" columns={17}>
      <Grid item xs={4} padding={'0 1rem 0 1rem'}>
        <Typography className={styles.label}>{props.label}</Typography>
      </Grid>
      <Grid item xs={4} paddingX={1}>
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            type="number"
            id="outlined-adornment-amount"
            endAdornment={<InputAdornment position="start">%</InputAdornment>}
            label="Amount"
            value={
              (props.expanse /
                props.priceTypes?.find((type) => type.label === selectedType)
                  ?.value) *
              100
            }
            onChange={handleChangePercentage}
          />
        </FormControl>
      </Grid>
      <Grid item xs={4} paddingX={1}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedType}
            label="Type"
            onChange={handleChangeType}
          >
            {props.priceTypes?.map((type, index) => (
              <MenuItem key={index} value={type.label}>
                {type.label}
              </MenuItem>
            ))}
            {/* <MenuItem value="listingPrice">Listing Price</MenuItem>
            <MenuItem value="arv">ARV</MenuItem> */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} paddingX={1}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            type="number"
            value={props.expanse}
            onChange={handleChangeAmount}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <Grid container justifyContent="center">
          <IconButton
            onClick={() => {
              props.removeExpanse(props.label);
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExpansesRow;
