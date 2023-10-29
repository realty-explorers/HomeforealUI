import { CompData, FilteredComp } from "@/models/analyzedProperty";
import { Box, Button, Grid, Typography } from "@mui/material";
import CompsFilter from "./CompsFilter";
import TuneIcon from "@mui/icons-material/Tune";
import styled from "@emotion/styled";
import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import { useState } from "react";
import React from "react";

const Wrapper = styled(Box)(({ theme }) => ({
  width: "10rem",
  overflow: "hidden",
}));

type CompsSectionProps = {
  comps: CompData[];
  selectedComps: FilteredComp[];
  setSelectedComps: (comps: FilteredComp[]) => void;
  propertyCard: React.ReactNode;
  compCard: React.ReactElement;
};
const CompsSection = (
  { comps, selectedComps, setSelectedComps, propertyCard, compCard }:
    CompsSectionProps,
) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const selectedCompsIndexes = selectedComps?.map((comp) => comp.index);

  const handleToggle = (index: number) => {
    if (selectedCompsIndexes?.includes(index)) {
      const filteredComps = selectedComps.filter((property) =>
        property.index !== index
      );
      setSelectedComps(filteredComps);
    } else {
      const newSelectedComps = [...selectedComps, { ...comps?.[index], index }];
      setSelectedComps(newSelectedComps);
    }
  };
  const createCompCard = (compsProperty: CompData, index: number) => {
    const newCompCard = React.cloneElement(compCard, {
      compsProperty,
      index,
      selected: selectedCompsIndexes?.includes(index),
      toggle: () => handleToggle(index),
    });
    return newCompCard;
  };

  return (
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
        setSelectedComps={setSelectedComps}
        selectedComps={selectedComps}
      />

      <Wrapper className={styles.cardsWrapper}>
        <Grid item className="mb-8 sticky left-0 z-[1]">
          {propertyCard}
        </Grid>
        {comps?.map((compsProperty, index) => (
          <Grid item key={index} className="mb-8 left-0">
            {createCompCard(compsProperty, index)}
          </Grid>
        ))}
      </Wrapper>
    </Grid>
  );
};

export default CompsSection;
