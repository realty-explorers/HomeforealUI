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
import AnalyzedProperty, { CompData } from "@/models/analyzedProperty";
import { useState } from "react";
import CompsFilter from "./CompsFilter";

const Wrapper = styled(Box)(({ theme }) => ({
  width: "10rem",
  overflow: "hidden",
}));

type SalesCompsProps = {
  property: AnalyzedProperty;
  selectedComps: CompData[];
  setSelectedComps: (compsProperties: CompData[]) => void;
};
const SalesComps = (props: SalesCompsProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleToggle = (compsProperty: CompData) => {
    if (props.selectedComps.includes(compsProperty)) {
      const filteredComps = props.selectedComps.filter((property) =>
        property !== compsProperty
      );
      props.setSelectedComps(filteredComps);
    } else {
      const newComps = [...props.selectedComps, compsProperty];
      props.setSelectedComps(newComps);
    }
  };

  return (props.property?.sales_comps?.data?.length > 0 &&
    (
      <Grid className={`${analyticsStyles.sectionContainer}`}>
        <Typography className={styles.compsSectionInfo}>
          We found {props.property.sales_comps?.data?.length}{" "}
          comps that match your search
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
          compsProperties={props.property.sales_comps?.data}
          setSelectedComps={props.setSelectedComps}
        />

        <Wrapper className={styles.cardsWrapper}>
          <Grid item className="mb-8 sticky left-0 z-[1]">
            <PropertyCard
              property={props.property}
              compsProperties={props.selectedComps}
            />
          </Grid>
          {props.property.sales_comps?.data?.map((compsProperty, index) => (
            <Grid item key={index} className="mb-8 left-0">
              <CompsCard
                compsProperty={compsProperty}
                index={index}
                selected={props.selectedComps?.includes(compsProperty)}
                toggle={() =>
                  handleToggle(compsProperty)}
                className={styles.compsCard}
              />
            </Grid>
          ))}
        </Wrapper>
      </Grid>
    ));
};

export default SalesComps;
