import Head from 'next/head';

import SidebarLayout from '@/layouts/SidebarLayout';

import PageHeader from '@/content/Dashboards/Crypto/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Box, Container, Grid } from '@mui/material';
import Footer from '@/components/Footer';

import Map from '@/content/Dashboards/RealEstate/Map';
import AccountBalance from '@/content/Dashboards/Crypto/AccountBalance';
import Wallets from '@/content/Dashboards/Crypto/Wallets';
import AccountSecurity from '@/content/Dashboards/Crypto/AccountSecurity';
import WatchList from '@/content/Dashboards/Crypto/WatchList';
import Properties from '@/content/Dashboards/RealEstate/Properties';
import { useContext, useState } from 'react';
import { SearchContext } from '@/contexts/SearchContext';
import Deal from '@/models/deal';
import { useSelector } from 'react-redux';
import { selectSearchResults } from '@/store/searchSlice';

function DashboardRealEstate() {
  const [selectedDeal, setSelectedDeal] = useState<Deal>();

  const searchResults = useSelector(selectSearchResults);

  return (
    <>
      <Head>
        <title>Real Estate Dashboard</title>
      </Head>
      <Box sx={{ marginBottom: 5 }}>
        <Map selectedDeal={selectedDeal} setSelectedDeal={setSelectedDeal} />
      </Box>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <Properties
              deals={searchResults}
              setSelectedDeal={setSelectedDeal}
              selectedDeal={selectedDeal}
            />
          </Grid>
          <Grid item xs={12}>
            <AccountBalance />
          </Grid>
          <Grid item lg={8} xs={12}>
            <Wallets />
          </Grid>
          <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid>
          <Grid item xs={12}>
            <WatchList />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardRealEstate;
