import Property from '@/models/property';
import { Grid, Typography } from '@mui/material';
import styles from './PropertyFacts.module.scss';

const PropertyField = (props: { label: string; value: string }) => {
  return (
    <Grid item xs={6}>
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

type PropertyFactsProps = {
  property: Property;
};
const PropertyFacts = (props: PropertyFactsProps) => {
  return (
    <Grid className={styles.factsGrid}>
      <h1>Property Facts</h1>
      <Grid container justifyContent="center" rowGap={3}>
        <PropertyField label="PropertyType" value="meow" />
        <PropertyField label="Bathrooms" value="meow" />
        <PropertyField label="Bedrooms" value="meow" />
        <PropertyField label="YearBuilt" value="meow" />
        <PropertyField label="Half Bathrooms" value="meow" />
        <PropertyField label="Lot Size" value="meow" />
        <PropertyField label="Mls" value="meow" />
        <PropertyField label="Building Size" value="meow" />
        <PropertyField label="Zoning" value="meow" />
        <PropertyField label="Floors" value="meow" />
      </Grid>
    </Grid>
  );
};

export default PropertyFacts;
