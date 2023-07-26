import Property from '@/models/property';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import analyticsStyles from './Analytics.module.scss';
import styles from './EnvironmentalIndicators.module.scss';

const IndicatorCard = (props: { title: string; content: string }) => {
  return (
    <Card className={styles.indicatorCard}>
      <Grid container direction="column" sx={{ height: '100%' }}>
        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <Typography className={styles.indicatorHeader}>
            {props.title}
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          container
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Typography className={styles.indicatorContent}>
            {props.content}
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          container
          justifyContent="center"
          // alignItems="flex-end"
        >
          <Typography className={styles.indicatorLink}>meow</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

type EnvironmentalIndicatorsProps = {
  property: Property;
};
const EnvironmentalIndicators = (props: EnvironmentalIndicatorsProps) => {
  return (
    <Grid className={analyticsStyles.sectionContainer}>
      <h1 className={analyticsStyles.sectionHeader}>
        Environmental Indicators
      </h1>
      <Grid container justifyContent="center" columnSpacing={2}>
        <Grid xs={3} item>
          <IndicatorCard title="FLOOD" content="0.5%  risk Zone V" />
        </Grid>
        <Grid xs={3} item>
          <IndicatorCard title="CRIME" content="low crime rate" />
        </Grid>
        <Grid xs={3} item>
          <IndicatorCard title="RAILROAD" content="0.5 mile from railroad" />
        </Grid>
        <Grid xs={3} item>
          <IndicatorCard title="AIRPORT" content="0.2 mile from airport" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EnvironmentalIndicators;
