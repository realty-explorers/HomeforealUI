import { useEffect, useState } from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
// import { signIn, signOut, useSession } from 'next-auth/react';
import Head from "next/head";
import SidebarLayout from "@/layouts/SidebarLayout";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Slide,
} from "@mui/material";
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
import SalesComps from "@/content/Dashboards/Analytics/CompsSection/SalesComps";
import RentComps from "@/content/Dashboards/Analytics/CompsSection/RentComps";
import ExpansesCalculator from "@/content/Dashboards/Analytics/Expanses/ExpansesCalculator";
import OperationalExpanses from "@/content/Dashboards/Analytics/Expanses/OperationalExpenses";
import RentComparable from "@/content/Dashboards/Analytics/RentComparable";
import SplitPane from "react-split-pane";
import clsx from "clsx";
import {
  selectProperties,
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
// import { Property } from "@/models/analyzedProperty";
import styles from "./RealEstate.module.scss";
import SaleComparableIndicators from "@/content/Dashboards/Analytics/SaleComparableIndicators";
import { CompData, FilteredComp } from "@/models/analyzedProperty";
import { motion, Variants } from "framer-motion";
import { propertiesApiEndpoints } from "@/store/services/propertiesApiService";
import { selectLocation } from "@/store/slices/locationSlice";

import Lottie from "lottie-react";
import mapLoadingAnimation from "@/static/animations/loading/mapLoadingAnimation.json";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const MoreDetailsSection = (
  {
    selectedProperty,
    selectedComps,
    selectedRentalComps,
    setSelectedRentalComps,
  },
) => {
  const dispatch = useDispatch();
  return selectedProperty
    ? (
      <>
        <IconButton
          className="-mb-4"
          onClick={() => dispatch(setSelectedPropertyPreview(null))}
        >
          <KeyboardReturnIcon />
        </IconButton>
        <PropertyHeader property={selectedProperty} />
        <PropertyFacts property={selectedProperty} />
        {/* <PropertyFeatures property={selectedProperty} /> */}
        {/* <EnvironmentalIndicators property={selectedProperty} /> */}
        {/* <OwnershipInfo property={selectedProperty} /> */}
        <div className="mt-8">
          <SaleComparableIndicators property={selectedProperty} />
          <SaleComparable property={selectedProperty} />
          <SalesComps />
        </div>
        <ExpansesCalculator property={selectedProperty} />
        <div className="mt-8">
          <RentComparable property={selectedProperty} />
          <RentComps
            property={selectedProperty}
            selectedComps={selectedRentalComps}
            setSelectedComps={setSelectedRentalComps}
          />
        </div>
        <OperationalExpanses property={selectedProperty} />
      </>
    )
    : <></>;
};

const DashboardRealEstate = (props: any) => {
  // const { data, status }: any = useSession({
  //   required: true
  // });
  const dispatch = useDispatch();
  const {
    selectedProperty,
    selectedComps,
    selectedPropertyPreview,
    selectedRentalComps,
  } = useSelector(
    selectProperties,
  );
  const openMoreDetails = selectedPropertyPreview;

  const selectedPropertyState = propertiesApiEndpoints.getProperty
    .useQueryState(
      selectedPropertyPreview?.source_id,
    );

  // const setSelectedComps = (comps) => {
  //   dispatch(setSelectedComps(comps));
  // };

  const handleSelectRentalComps = (compsProperties: CompData[]) => {
    dispatch(setSelectedRentalComps(compsProperties));
  };
  const [showFirstPanel, setShowFirstPanel] = useState(true);
  const [showLastPanel, setShowLastPanel] = useState(true);

  return (
    <>
      {/* <div className="flex w-full h-[calc(100%-60px)] "> */}
      <div className="flex w-full h-full">
        {openMoreDetails && (
          <motion.div
            // initial={{ opacity: 0, scale: 0.5 }}
            // animate={{ opacity: 1, scale: 1 }}
            initial={{ left: "-100%" }}
            animate={{ left: "0" }}
            transition={{
              duration: 0.8,
              // delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={clsx([
              "w-1/2 h-[calc(100%-60px)] overflow-x-auto absolute",
            ])}
            // hidden md:block h-[calc(100%-60px)] w-1/2 transition-all duration-500 absolute overflow-x-auto
          >
            {/* <Lottie */}
            {/*   animationData={mapLoadingAnimation} */}
            {/*   className={clsx([ */}
            {/*     "h-40 w-40 z-[3] fixed top-1/2 left-1/4 translate-x-[-50%] translate-y-[-50%] transition-opacity duration-500", */}
            {/*     selectedPropertyState.isFetching */}
            {/*       ? "opacity-100" */}
            {/*       : "opacity-0", */}
            {/*   ])} */}
            {/* /> */}
            <CircularProgress
              className={clsx([
                "h-40 w-40 z-[3] fixed top-1/2 left-1/4 translate-x-[-50%] translate-y-[-50%] transition-opacity duration-500",
                selectedPropertyState.isFetching ? "opacity-100" : "opacity-0",
              ])}
            />
            <div
              className={clsx([
                "duration-500 transition-opacity",
                selectedPropertyState.isFetching && "opacity-50",
              ])}
            >
              <MoreDetailsSection
                selectedProperty={selectedProperty}
                selectedComps={selectedComps}
                selectedRentalComps={selectedRentalComps}
                setSelectedRentalComps={handleSelectRentalComps}
              />
            </div>
          </motion.div>
        )}

        <div
          className={clsx([
            "h-[calc(100%-58px)]  absolute left-1/2 bg-white transition-transform duration-500 ",
            openMoreDetails
              ? "md:w-1/2 md:translate-x-0"
              : "w-full -translate-x-1/2",
            // openMoreDetails ? "w-1/2 left-1/2" : "w-1/2 left-1/2",
          ])}
        >
          <Map />
        </div>
      </div>
    </>
  );
};

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

// export default withPageAuthRequired(DashboardRealEstate, { returnTo: '' });
export default DashboardRealEstate;
export const getServerSideProps = withPageAuthRequired();
