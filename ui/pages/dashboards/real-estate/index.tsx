import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, Button, Container, Grid } from '@mui/material';
import Footer from '@/components/Footer';
import Map from '@/content/Dashboards/RealEstate/Map';
import Properties from '@/content/Dashboards/RealEstate/Properties';
import Deal from '@/models/deal';
import { useSelector } from 'react-redux';
import { selectSearchResults } from '@/store/searchSlice';

function DashboardRealEstate() {
  const { data, status }: any = useSession({
    required: true
  });

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
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardRealEstate;
