import Property from '@/models/property';
import { Button, Grid, Typography } from '@mui/material';
import GridField from '@/components/Grid/GridField';
import analyticsStyles from './Analytics.module.scss';
import ThemedButton from '@/components/Buttons/ThemedButton';
import AnalyzedProperty from '@/models/analyzedProperty';

type OwnershipInfoProps = {
  property: AnalyzedProperty;
};
const OwnershipInfo = (props: OwnershipInfoProps) => {
  return (
    <Grid
      className={`${analyticsStyles.yellowBorderedSection} ${analyticsStyles.sectionContainer}`}
    >
      <h1 className={analyticsStyles.sectionHeader}>Ownership Information</h1>
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
      <Grid container justifyContent="flex-end">
        <ThemedButton title="Owner Buy Box" />
      </Grid>
    </Grid>
  );
};

export default OwnershipInfo;
