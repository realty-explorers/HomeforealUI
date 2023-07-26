import CompsSection from '@/content/Dashboards/Analytics/CompsSection';
import EnvironmentalIndicators from '@/content/Dashboards/Analytics/EnvironmentalIndicators';
import OwnershipInfo from '@/content/Dashboards/Analytics/OwnershipInfo';
import PropertyFacts from '@/content/Dashboards/Analytics/PropertyFacts';
import PropertyFeatures from '@/content/Dashboards/Analytics/PropertyFeatrues';
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
        <PropertyFeatures property={{} as Property} />
        <EnvironmentalIndicators property={{} as Property} />
        <OwnershipInfo property={{} as Property} />
        <CompsSection property={{} as Property} />
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
};

PropertyAnalytics.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PropertyAnalytics;
