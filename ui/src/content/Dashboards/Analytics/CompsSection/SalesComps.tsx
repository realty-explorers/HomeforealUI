import { Box, Button, Card, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";

import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import PropertyCard from "./PropertyCard";
import CompsCard from "./CompsCard";
import CompsProperty from "@/models/comps_property";
import styled from "@emotion/styled";
import TuneIcon from "@mui/icons-material/Tune";
import { Height } from "@mui/icons-material";
import AnalyzedProperty, {
  CompData,
  FilteredComp,
} from "@/models/analyzedProperty";
import { useEffect, useState } from "react";
import CompsFilter from "./CompsFilter";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProperties,
  setCalculatedProperty,
  setSelectedComps,
  setSelectedProperty,
} from "@/store/slices/propertiesSlice";
import { useCalculateCompsMutation } from "@/store/services/analysisApi";

const Wrapper = styled(Box)(({ theme }) => ({
  width: "10rem",
  overflow: "hidden",
}));

type SalesCompsProps = {};
const SalesComps = (props: SalesCompsProps) => {
  const dispatch = useDispatch();
  const { selectedProperty, selectedComps } = useSelector(selectProperties);
  const [filterOpen, setFilterOpen] = useState(false);

  const [calculateComps, compsResult] = useCalculateCompsMutation();

  const selectedCompsIndexes = selectedComps?.map((comp) => comp.index);

  const recalculateComps = async (compsIds: string[]) => {
    const response = await calculateComps({
      "buybox_id": selectedProperty.buybox_id,
      "source_id": selectedProperty.source_id,
      "list_of_comps": compsIds,
      "analysis_comp_name": "flip",
    });
    if (response.data) {
      const newSelectedProperty = response.data as AnalyzedProperty;
      dispatch(setCalculatedProperty(newSelectedProperty));
    }
  };

  const handleToggle = (index) => {
    if (selectedCompsIndexes?.includes(index)) {
      const filteredComps = selectedComps.filter((property) =>
        property.index !== index
      );
      dispatch(setSelectedComps(filteredComps));
      recalculateComps(filteredComps.map((comp) => comp.source_id));
    } else {
      const newSelectedComps = [...selectedComps, {
        ...selectedProperty.sales_comps?.data?.[index],
        index,
      }];
      dispatch(setSelectedComps(newSelectedComps));
      recalculateComps(newSelectedComps.map((comp) => comp.source_id));
    }
  };

  useEffect(() => {
    const newComps: FilteredComp[] = selectedProperty.sales_comps?.data?.map(
      (comp, index) => {
        return { ...comp, index };
      },
    );
    dispatch(setSelectedComps(newComps));
  }, [selectedProperty]);

  return (selectedProperty?.sales_comps?.data?.length > 0 &&
    (
      <Grid className={`${analyticsStyles.sectionContainer}`}>
        <Typography className={styles.compsSectionInfo}>
          We found {selectedComps?.length} comps that match your search
        </Typography>
        <Button
          onClick={() => setFilterOpen(!filterOpen)}
          startIcon={<TuneIcon />}
          className="text-black bg-white hover:bg-[#5569ff] hover:text-white rounded-2xl mt-2 px-4"
        >
          Filter Comps
        </Button>
        <CompsFilter
          open={filterOpen}
          setOpen={setFilterOpen}
          recalculateComps={recalculateComps}
        />

        <Wrapper className={styles.cardsWrapper}>
          <Grid item className="mb-8 sticky left-0 z-[1]">
            <PropertyCard
              property={selectedProperty}
              compsProperties={selectedComps}
            />
          </Grid>
          {selectedProperty.sales_comps?.data?.map((compsProperty, index) => (
            <Grid item key={index} className="mb-8 left-0">
              <CompsCard
                compsProperty={compsProperty}
                index={index}
                selected={selectedCompsIndexes?.includes(index)}
                toggle={() => handleToggle(index)}
                className={styles.compsCard}
              />
            </Grid>
          ))}
        </Wrapper>
      </Grid>
    ));
};

export default SalesComps;
