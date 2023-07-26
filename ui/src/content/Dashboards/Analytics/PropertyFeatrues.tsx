import Property from '@/models/property';
import { Grid, Typography } from '@mui/material';
import GridField from '@/components/Grid/GridField';
import styles from './Analytics.module.scss';

type PropertyFeaturesProps = {
  property: Property;
};
const PropertyFeatures = (props: PropertyFeaturesProps) => {
  return (
    <Grid className={styles.sectionContainer}>
      <h1 className={styles.sectionHeader}>Features</h1>
      <Grid container justifyContent="center" rowGap={3}>
        <GridField label="Garage Sqft" value="meow" />
        <GridField label="Pool" value="meow" />
        <GridField label="HVAC Heating" value="meow" />
        <GridField label="Parking" value="meow" />
        <GridField label="HVAC Cooling" value="meow" />
        <GridField label="Roof" value="meow" />
        <GridField label="Foundation" value="meow" />
        <Grid item xs={6}></Grid>
      </Grid>
    </Grid>
  );
};

export default PropertyFeatures;
