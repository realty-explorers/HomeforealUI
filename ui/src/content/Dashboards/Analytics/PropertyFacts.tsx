import Property from '@/models/property';
import { Button, Grid, Typography } from '@mui/material';
import GridField from '@/components/Grid/GridField';
import analyticsStyles from './Analytics.module.scss';

type PropertyFactsProps = {
  property: Property;
};
const PropertyFacts = (props: PropertyFactsProps) => {
  return (
    <Grid
      className={`${analyticsStyles.yellowSection} ${analyticsStyles.sectionContainer}`}
    >
      <h1 className={analyticsStyles.sectionHeader}>Property Facts</h1>
      <Grid container justifyContent="center" rowGap={3}>
        <GridField label="PropertyType" value="meow" />
        <GridField label="Bathrooms" value="meow" />
        <GridField label="Bedrooms" value="meow" />
        <GridField label="YearBuilt" value="meow" />
        <GridField label="Half Bathrooms" value="meow" />
        <GridField label="Lot Size" value="meow" />
        <GridField label="Mls" value="meow" />
        <GridField label="Building Size" value="meow" />
        <GridField label="Zoning" value="meow" />
        <GridField label="Floors" value="meow" />
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button className={analyticsStyles.button}>
          <Typography className={analyticsStyles.buttonText}>More</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default PropertyFacts;
