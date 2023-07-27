import Property from '@/models/property';
import { Grid, Typography } from '@mui/material';
import GridField from '@/components/Grid/GridField';
import styles from './Analytics.module.scss';

type OwnershipInfoProps = {
  property: Property;
};
const OwnershipInfo = (props: OwnershipInfoProps) => {
  return (
    <Grid className={styles.sectionContainer}>
      <h1 className={styles.sectionHeader}>Ownership Information</h1>
      <Grid container justifyContent="center" rowGap={3}>
        <Grid item xs={6} container rowGap={3}>
          <GridField size={12} label="Entity Name" value="meow" />
          <GridField size={12} label="True Owner" value="meow" />
          <GridField size={12} label="# Owned Properties" value="meow" />
          <GridField size={12} label="Bought this Year" value="meow" />
          <GridField size={12} label="Sold this Year" value="meow" />
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Grid>
  );
};

export default OwnershipInfo;
