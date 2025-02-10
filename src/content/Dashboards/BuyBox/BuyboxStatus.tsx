import { Card, CardContent, Grid, Typography } from '@mui/material';
import styles from './BuyboxStatus.module.scss';
import clsx from 'clsx';

const StatusCard = (props) => {
  return (
    <div className="xl:w-1/3 md:w-1/2 w-full h-full p-4">
      <Card
        sx={{ bgcolor: 'white' }}
        className={clsx([styles.statusCard, 'h-full'])}
      >
        <CardContent className="h-full">
          <div className="flex flex-1 h-full flex-col items-center justify-center">
            <Grid item>
              <Typography variant="h6" align="center" className={styles.title}>
                {props.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                align="center"
                // className={styles.status}
              >
                {props.status}
              </Typography>
            </Grid>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type BuyboxStatusProps = {};
const BuyboxStatus = (props: BuyboxStatusProps) => {
  return (
    <div className="flex flex-wrap w-full items-center justify-center p-4">
      <StatusCard title="New Leads Today" status="12" />
      <StatusCard title="Credits" status="5/100" />
      <StatusCard title="Total Active Deals Count" status="$19,150,152" />
    </div>
  );
};

export default BuyboxStatus;
