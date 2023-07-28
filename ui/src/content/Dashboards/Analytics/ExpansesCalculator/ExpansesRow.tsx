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
  removeExpanse: (label) => void;
};
const ExpansesRow = (props: ExpansesRowProps) => {
  const [removed, setRemoved] = useState(false);
  return (
    <Grid container alignItems="center" columns={17}>
      <Grid item xs={4} padding={'0 1rem 0 1rem'}>
        <Typography className={styles.label}>{props.label}</Typography>
      </Grid>
      <Grid item xs={4} paddingX={1}>
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            endAdornment={<InputAdornment position="start">%</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Grid>
      <Grid item xs={4} paddingX={1}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value="listingPrice"
            label="Age"
            onChange={() => {}}
          >
            <MenuItem value="listingPrice">Listing Price</MenuItem>
            <MenuItem value="arv">ARV</MenuItem>
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
          />
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <Grid container justifyContent="center">
          <IconButton
            onClick={() => {
              setRemoved(true);
              setTimeout(() => {
                props.removeExpanse(props.label);
              }, 300);
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
