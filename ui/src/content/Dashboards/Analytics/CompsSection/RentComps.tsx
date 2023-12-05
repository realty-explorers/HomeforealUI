import { Box, Button, Card, Grid, Typography } from "@mui/material";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import PropertyCard from "./PropertyCard";
import TuneIcon from "@mui/icons-material/Tune";
import AnalyzedProperty, { FilteredComp } from "@/models/analyzedProperty";
import { useEffect, useState } from "react";
import CompsFilter from "./CompsFilter";
import RentsCard from "./RentsCard";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProperties,
  setRentalCalculatedProperty,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import { useCalculateCompsMutation } from "@/store/services/analysisApi";
import CompsSection from "./CompsSection";
import PropertyCardRental from "./PropertyCardRental";

type RentCompsProps = {};
const RentComps = () => {
  const dispatch = useDispatch();
  const { selectedProperty, selectedRentalComps } = useSelector(
    selectProperties,
  );
  const [calculateComps, compsResult] = useCalculateCompsMutation();

  const recalculateComps = async (compsIds: string[]) => {
    const response = await calculateComps({
      "buybox_id": selectedProperty.buybox_id,
      "source_id": selectedProperty.source_id,
      "list_of_comps": compsIds,
      "analysis_comp_name": "flip",
    });
    if (response.data) {
      const newSelectedProperty = response.data as AnalyzedProperty;
      dispatch(setRentalCalculatedProperty(newSelectedProperty));
    }
  };

  const setNewSelectedComps = (newSelectedComps: FilteredComp[]) => {
    dispatch(setSelectedRentalComps(newSelectedComps));
    // recalculateComps(newSelectedComps.map((comp) => comp.source_id));
  };

  // useEffect(() => {
  //   const newComps: FilteredComp[] = selectedProperty.rents_comps?.data?.map(
  //     (comp, index) => {
  //       return { ...comp, index };
  //     },
  //   );
  //   dispatch(setSelectedRentalComps(newComps));
  // }, [selectedProperty]);

  return (selectedProperty?.rents_comps?.data?.length > 0 &&
    (
      <CompsSection
        comps={selectedProperty.rents_comps?.data}
        selectedComps={selectedRentalComps}
        setSelectedComps={setNewSelectedComps}
        propertyCard={
          <PropertyCardRental
            property={selectedProperty}
            compsProperties={selectedRentalComps}
          />
        }
        compCard={
          <RentsCard
            compsProperty={null}
            index={0}
            selected={false}
            toggle={() => {}}
            className={styles.rentCompsCard}
          />
        }
      />
    ));
};

export default RentComps;
