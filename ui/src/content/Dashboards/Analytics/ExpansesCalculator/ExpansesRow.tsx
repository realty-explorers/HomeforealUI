import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import styles from './ExpansesCalculator.module.scss';

type ExpansesRowProps = {
  label: string;
};
const ExpansesRow = (props: ExpansesRowProps) => {
  return (
    <Grid container alignItems="center">
      <Grid xs={3} padding={'0 1rem 0 1rem'}>
        <Typography className={styles.label}>{props.label}</Typography>
      </Grid>
      <Grid xs={3} paddingX={1}>
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            endAdornment={<InputAdornment position="start">%</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Grid>
      <Grid xs={3} paddingX={1}>
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
      <Grid xs={3} paddingX={1}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ExpansesRow;
