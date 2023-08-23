import { useState } from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
// import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, Button, Container, Grid, Slide } from '@mui/material';
import Footer from '@/components/Footer';
import Map from '@/content/Dashboards/RealEstate/Map';
import Deal from '@/models/deal';
import { useSelector } from 'react-redux';
import MoreDetailsModal from '@/content/Dashboards/RealEstate/DetailsPanel/MoreDetailsModal';
import PropertyHeader from '@/content/Dashboards/Analytics/PropertyHeader';
import PropertyFacts from '@/content/Dashboards/Analytics/PropertyFacts';
import PropertyFeatures from '@/content/Dashboards/Analytics/PropertyFeatrues';
import EnvironmentalIndicators from '@/content/Dashboards/Analytics/EnvironmentalIndicators';
import OwnershipInfo from '@/content/Dashboards/Analytics/OwnershipInfo';
import SaleComparable from '@/content/Dashboards/Analytics/SaleComparable';
import CompsSection from '@/content/Dashboards/Analytics/CompsSection';
import ExpansesCalculator from '@/content/Dashboards/Analytics/Expanses/ExpansesCalculator';
import RentComparable from '@/content/Dashboards/Analytics/RentComparable';
import OperationalExpanses from '@/content/Dashboards/Analytics/Expanses/OperationalExpanses';
import Property from '@/models/property';
import clsx from 'clsx';
import { selectProperties } from '@/store/slices/propertiesSlice';

const DashboardRealEstate = (props: any) => {
  // const { data, status }: any = useSession({
  //   required: true
  // });
  const { selectedDeal } = useSelector(selectProperties);
  const openMoreDetails = selectedDeal;

  return (
    <>
      {/* <Head>
        <title>Real Estate Dashboard</title>
      </Head> */}
      <div className="flex w-full h-[calc(100%-60px)]">
        <div
          className={clsx([
            'hidden md:block h-[calc(100%-60px)] w-1/2 transition-all duration-500 absolute overflow-x-auto',
            openMoreDetails ? 'left-0' : '-left-full'
          ])}
        >
          <PropertyHeader deal={selectedDeal} />
          <PropertyFacts property={{} as Property} />
          <PropertyFeatures property={{} as Property} />
          <EnvironmentalIndicators property={{} as Property} />
          <OwnershipInfo property={{} as Property} />
          <SaleComparable property={{} as Property} />
          <CompsSection property={{} as Property} />
          <ExpansesCalculator property={selectedDeal?.property} />
          <RentComparable property={{} as Property} />
          <CompsSection property={{} as Property} />
          <OperationalExpanses property={{} as Property} />
        </div>

        <div
          className={clsx([
            'h-[calc(100%-60px)] transition-all duration-500 absolute w-full left-0',
            openMoreDetails ? 'md:w-1/2 md:left-1/2' : 'w-full left-0'
          ])}
        >
          <Map />
        </div>
      </div>
      {/* <MoreDetailsModal
        deal={selectedDeal}
        open={openMoreDetails}
        setOpen={setOpenMoreDetails}
      /> */}
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
