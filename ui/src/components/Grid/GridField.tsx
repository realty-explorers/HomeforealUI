import { Grid, Typography } from '@mui/material';
import styles from './GridField.module.scss';

type GridFieldProps = {
  size?: number;
  label: string;
  value: string;
};
const GridField = (props: GridFieldProps) => {
  return (
    <Grid item xs={props.size ?? 6}>
      <Grid container item xs={12}>
        <Grid item xs={6} container>
          <Typography className={styles.label}>{props.label}</Typography>
        </Grid>
        <Grid item xs={6} container>
          <Typography className={styles.value}>{props.value}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridField;
