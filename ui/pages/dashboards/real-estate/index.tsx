import { useState } from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
// import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, Button, Container, Grid } from '@mui/material';
import Footer from '@/components/Footer';
import Map from '@/content/Dashboards/RealEstate/Map';
import Deal from '@/models/deal';
import { useSelector } from 'react-redux';
import { selectSearchResults } from '@/store/searchSlice';
import MoreDetailsModal from '@/content/Dashboards/RealEstate/DetailsPanel/MoreDetailsModal';

const DashboardRealEstate = (props: any) => {
  // const { data, status }: any = useSession({
  //   required: true
  // });

  const [selectedDeal, setSelectedDeal] = useState<Deal>();
  const [openMoreDetails, setOpenMoreDetails] = useState<boolean>(false);

  const searchResults = useSelector(selectSearchResults);

  return (
    <>
      <Head>
        <title>Real Estate Dashboard</title>
      </Head>
      <Box sx={{ marginBottom: 5, height: '100%' }}>
        <Map
          selectedDeal={selectedDeal}
          setSelectedDeal={setSelectedDeal}
          setOpenMoreDetails={setOpenMoreDetails}
        />
      </Box>
      <MoreDetailsModal
        deal={selectedDeal}
        open={openMoreDetails}
        setOpen={setOpenMoreDetails}
      />
      {/* <Container maxWidth="lg">
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
      </Container> */}
      {/* <Footer /> */}
    </>
  );
};

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

// export default withPageAuthRequired(DashboardRealEstate, { returnTo: '' });
export default DashboardRealEstate;
export const getServerSideProps = withPageAuthRequired();
