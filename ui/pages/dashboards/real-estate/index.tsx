import { useEffect, useRef, useState } from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import SidebarLayout from "@/layouts/SidebarLayout";
import { CircularProgress, IconButton } from "@mui/material";
import Map from "@/content/Dashboards/RealEstate/Map";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  selectProperties,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import styles from "./RealEstate.module.scss";
import { CompData, FilteredComp } from "@/models/analyzedProperty";
import { motion, Variants } from "framer-motion";
import { propertiesApiEndpoints } from "@/store/services/propertiesApiService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SkeletonSection from "@/content/Dashboards/RealEstate/MoreDetails/SkeletonSection";
import MoreDetails from "@/content/Dashboards/RealEstate/MoreDetails/MoreDetails";

const DashboardRealEstate = (props: any) => {
  const dispatch = useDispatch();
  const {
    selectedProperty,
    selectedComps,
    selectedPropertyPreview,
    selectedRentalComps,
    selecting,
  } = useSelector(
    selectProperties,
  );
  const openMoreDetails = selectedPropertyPreview;

  const selectedPropertyState = propertiesApiEndpoints.getProperty
    .useQueryState(
      selectedPropertyPreview?.source_id,
    );

  const handleSelectRentalComps = (compsProperties: FilteredComp[]) => {
    dispatch(setSelectedRentalComps(compsProperties));
  };

  const handleHidePanel = () => {
    dispatch(setSelectedPropertyPreview(null));
    dispatch(setSelectedProperty(null));
  };

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      {openMoreDetails && (
        <>
          <IconButton
            className="absolute top-1/2 left-1/2 -translate-y-full -translate-x-1/2 bg-white w-1 h-10 shadow z-[1] animate-fadeDelayed opacity-0"
            onClick={handleHidePanel}
          >
            <ExpandMoreIcon
              className={clsx([
                "transition-all",
                openMoreDetails ? "rotate-90" : "-rotate-90",
              ])}
            />
          </IconButton>
          <motion.div
            initial={{
              translateX: "-100%",
            }}
            animate={{ translateX: "0" }}
            transition={{
              duration: 0.8,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={clsx([
              styles.moreDetailsPanel,
              "w-1/2 overflow-y-auto absolute h-full bg-off-white",
            ])}
          >
            {(selectedPropertyState.isFetching || selecting)
              ? (
                selectedProperty ? <SkeletonSection /> : (
                  <CircularProgress
                    className={clsx([
                      " h-40 w-40 z-[3] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                    ])}
                  />
                )
              )
              : (
                <div
                  className={clsx([
                    "duration-500 transition-opacity animate-fade",
                  ])}
                >
                  <MoreDetails
                    selectedProperty={selectedProperty}
                    selectedComps={selectedComps}
                    selectedRentalComps={selectedRentalComps}
                    setSelectedRentalComps={handleSelectRentalComps}
                  />
                </div>
              )}
          </motion.div>
        </>
      )}

      <div
        className={clsx([
          "h-full absolute left-1/2 bg-white transition-transform duration-500 overflow-hidden",
          openMoreDetails ? "w-1/2 translate-x-0" : "w-full  -translate-x-1/2",
        ])}
      >
        <Map />
      </div>
    </div>
  );
};

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

// export default withPageAuthRequired(DashboardRealEstate, { returnTo: '' });
export default DashboardRealEstate;
export const getServerSideProps = withPageAuthRequired();
