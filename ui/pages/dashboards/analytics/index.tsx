import CompsSection from '@/content/Dashboards/Analytics/CompsSection';
import EnvironmentalIndicators from '@/content/Dashboards/Analytics/EnvironmentalIndicators';
import ExpansesCalculator from '@/content/Dashboards/Analytics/ExpansesCalculator';
import Map from '@/content/Dashboards/Analytics/Map';
import OperationalExpanses from '@/content/Dashboards/Analytics/OperationalExpanses';
import OwnershipInfo from '@/content/Dashboards/Analytics/OwnershipInfo';
import PropertyFacts from '@/content/Dashboards/Analytics/PropertyFacts';
import PropertyFeatures from '@/content/Dashboards/Analytics/PropertyFeatrues';
import PropertyHeader from '@/content/Dashboards/Analytics/PropertyHeader';
import RentComparable from '@/content/Dashboards/Analytics/RentComparable';
import SaleComparable from '@/content/Dashboards/Analytics/SaleComparable';
import SidebarLayout from '@/layouts/SidebarLayout';
import Property from '@/models/property';
import { Grid } from '@mui/material';
import { useState } from 'react';

const PropertyAnalytics = () => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item xs={6} sx={{ height: '100%', overflowY: 'scroll' }}>
        <PropertyHeader property={{} as Property} />
        <PropertyFacts property={{} as Property} />
        <PropertyFeatures property={{} as Property} />
        <EnvironmentalIndicators property={{} as Property} />
        <OwnershipInfo property={{} as Property} />
        <SaleComparable property={{} as Property} />
        <CompsSection property={{} as Property} />
        <ExpansesCalculator property={{} as Property} />
        <RentComparable property={{} as Property} />
        <CompsSection property={{} as Property} />
        <OperationalExpanses property={{} as Property} />
      </Grid>
      <Grid item xs={6}>
        <Map />
      </Grid>
    </Grid>
  );
};

PropertyAnalytics.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PropertyAnalytics;
