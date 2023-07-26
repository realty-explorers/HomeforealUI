import PropertyFacts from '@/content/Dashboards/Analytics/PropertyFacts';
import PropertyHeader from '@/content/Dashboards/Analytics/PropertyHeader';
import SidebarLayout from '@/layouts/SidebarLayout';
import Property from '@/models/property';
import { Grid } from '@mui/material';
import { useState } from 'react';

const PropertyAnalytics = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <PropertyHeader property={{} as Property} />
        <PropertyFacts property={{} as Property} />
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
};

PropertyAnalytics.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PropertyAnalytics;
