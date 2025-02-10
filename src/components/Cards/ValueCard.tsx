import { Card, Grid, Typography } from '@mui/material';
import styles from './ValueCard.module.scss';

type ValueCardProps = {
  title: string;
  value: string;
};
const ValueCard = (props: any) => {
  return (
    <Card className={styles.card}>
      <Grid container padding={2}>
        <Grid item container xs={12} justifyContent="center">
          <Typography className={styles.value}>{props.value}</Typography>
        </Grid>
        <Grid item container xs={12} justifyContent="center">
          <Typography className={styles.title}>{props.title}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ValueCard;
