import CompsSection from '@/content/Dashboards/Analytics/CompsSection';
import EnvironmentalIndicators from '@/content/Dashboards/Analytics/EnvironmentalIndicators';
import Map from '@/content/Dashboards/Analytics/Map';
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
import styles from './index.module.scss';
import styled from '@emotion/styled';
import ExpansesCalculator from '@/content/Dashboards/Analytics/Expanses/ExpansesCalculator';
import OperationalExpanses from '@/content/Dashboards/Analytics/Expanses/OperationalExpanses';

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: '100%',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '0.4em'
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,.1)'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,1)'
  }
}));

const PropertyAnalytics = () => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <StyledGrid item xs={6} sx={{ height: '100%', overflowY: 'scroll' }}>
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
      </StyledGrid>
      <Grid item xs={6}>
        <Map />
      </Grid>
    </Grid>
  );
};

PropertyAnalytics.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PropertyAnalytics;
