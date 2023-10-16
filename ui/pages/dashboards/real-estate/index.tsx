import { useEffect, useState } from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import { signIn, signOut, useSession } from 'next-auth/react';
import Head from "next/head";
import SidebarLayout from "@/layouts/SidebarLayout";
import { Box, Button, Container, Grid, Slide } from "@mui/material";
import Footer from "@/components/Footer";
import Map from "@/content/Dashboards/RealEstate/Map";
import Deal from "@/models/deal";
import { useDispatch, useSelector } from "react-redux";
import MoreDetailsModal from "@/content/Dashboards/RealEstate/DetailsPanel/MoreDetailsModal";
import PropertyHeader from "@/content/Dashboards/Analytics/PropertyHeader";
import PropertyFacts from "@/content/Dashboards/Analytics/PropertyFacts";
import PropertyFeatures from "@/content/Dashboards/Analytics/PropertyFeatrues";
import EnvironmentalIndicators from "@/content/Dashboards/Analytics/EnvironmentalIndicators";
import OwnershipInfo from "@/content/Dashboards/Analytics/OwnershipInfo";
import SaleComparable from "@/content/Dashboards/Analytics/SaleComparable";
import CompsSection from "@/content/Dashboards/Analytics/CompsSection";
import ExpansesCalculator from "@/content/Dashboards/Analytics/Expanses/ExpansesCalculator";
import RentComparable from "@/content/Dashboards/Analytics/RentComparable";
import OperationalExpanses from "@/content/Dashboards/Analytics/Expanses/OperationalExpanses";
import SplitPane from "react-split-pane";
import clsx from "clsx";
import {
  selectProperties,
  setSelectedComps,
  setSelectedProperty,
} from "@/store/slices/propertiesSlice";
// import { Property } from "@/models/analyzedProperty";
import styles from "./RealEstate.module.scss";
import SaleComparableIndicators from "@/content/Dashboards/Analytics/SaleComparableIndicators";
import { CompData } from "@/models/analyzedProperty";

const MoreDetailsSection = (
  { selectedProperty, selectedComps, setSelectedComps },
) => {
  return selectedProperty
    ? (
      <>
        <PropertyHeader property={selectedProperty} />
        <PropertyFacts property={selectedProperty} />
        {/* <PropertyFeatures property={selectedProperty} /> */}
        {/* <EnvironmentalIndicators property={selectedProperty} /> */}
        {/* <OwnershipInfo property={selectedProperty} /> */}
        <div className="mt-8">
          <SaleComparableIndicators property={selectedProperty} />
          <SaleComparable property={selectedProperty} />
          <CompsSection
            property={selectedProperty}
            selectedComps={selectedComps}
            setSelectedComps={setSelectedComps}
          />
        </div>
        <ExpansesCalculator property={selectedProperty} />
        {/* <RentComparable property={selectedProperty} /> */}
        {/* <CompsSection property={selectedProperty} /> */}
        {/* <OperationalExpanses property={selectedProperty} /> */}
      </>
    )
    : <></>;
};

const DashboardRealEstate = (props: any) => {
  // const { data, status }: any = useSession({
  //   required: true
  // });
  const dispatch = useDispatch();
  const { selectedProperty, selectedComps } = useSelector(selectProperties);
  const openMoreDetails = selectedProperty;

  // const setSelectedComps = (comps) => {
  //   dispatch(setSelectedComps(comps));
  // };

  const handleSetSelectedComps = (compsProperties: CompData[]) => {
    dispatch(setSelectedComps(compsProperties));
  };
  const [showFirstPanel, setShowFirstPanel] = useState(true);
  const [showLastPanel, setShowLastPanel] = useState(true);

  return (
    <>
      {
        /* <Head>
        <title>Real Estate Dashboard</title>
      </Head> */
      }
      <div className="flex w-full h-[calc(100%-60px)] ">
        <div
          className={clsx([
            "hidden md:block h-[calc(100%-60px)] w-1/2 transition-all duration-500 absolute overflow-x-auto",
            openMoreDetails ? "left-0" : "-left-full",
          ])}
        >
          <MoreDetailsSection
            selectedProperty={selectedProperty}
            selectedComps={selectedComps}
            setSelectedComps={handleSetSelectedComps}
          />
        </div>

        {/* <SplitPane split="vertical"> */}
        {/*   <MoreDetailsSection */}
        {/*     selectedProperty={selectedProperty} */}
        {/*     selectedComps={selectedComps} */}
        {/*     setSelectedComps={setSelectedComps} */}
        {/*   /> */}
        {/**/}
        {/*   <Map /> */}
        {/* </SplitPane> */}
        {/* </div> */}

        <div
          className={clsx([
            "h-[calc(100%-60px)]  absolute w-full left-0 bg-white",
            openMoreDetails ? "md:w-1/2 md:left-1/2" : "w-full left-0",
            // openMoreDetails ? "w-1/2 left-1/2" : "w-1/2 left-1/2",
          ])}
        >
          <Map />
        </div>
      </div>
      {
        /* <MoreDetailsModal
        deal={selectedDeal}
        open={openMoreDetails}
        setOpen={setOpenMoreDetails}
      /> */
      }
      {
        /* <Container maxWidth="lg">
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
      </Container> */
      }
      {/* <Footer /> */}
    </>
  );
};

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

// export default withPageAuthRequired(DashboardRealEstate, { returnTo: '' });
export default DashboardRealEstate;
export const getServerSideProps = withPageAuthRequired();
