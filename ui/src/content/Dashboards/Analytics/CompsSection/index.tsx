import { Box, Card, Grid, Typography } from "@mui/material";
import GridTableField from "@/components/Grid/GridTableField";

import analyticsStyles from "../Analytics.module.scss";
import styles from "./CompsSection.module.scss";
import PropertyCard from "./PropertyCard";
import CompsCard from "./CompsCard";
import CompsProperty from "@/models/comps_property";
import styled from "@emotion/styled";
import { Height } from "@mui/icons-material";
import AnalyzedProperty, { Property } from "@/models/analyzedProperty";
import { setSelectedComps } from "@/store/slices/propertiesSlice";

const Wrapper = styled(Box)(({ theme }) => ({
  width: "10rem",
  overflow: "hidden",
}));

type CompsSectionProps = {
  property: AnalyzedProperty;
  selectedComps: Property[];
  setSelectedComps: (compsProperties: Property[]) => void;
};
const CompsSection = (props: CompsSectionProps) => {
  const handleToggle = (compsProperty: Property) => {
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

  return (
    <Grid className={`${analyticsStyles.sectionContainer}`}>
      <Typography className={styles.compsSectionInfo}>
        We found {props.property.CompsData?.length} comps that match your search
      </Typography>
      <Typography className={styles.compsSectionEditText}>
        Edit comps filter
      </Typography>

      <Wrapper className={styles.cardsWrapper}>
        <Grid item>
          <PropertyCard
            property={props.property}
            compsProperties={props.selectedComps}
          />
        </Grid>
        {props.property.CompsData?.map((compsProperty, index) => (
          <Grid item key={index}>
            <CompsCard
              compsProperty={compsProperty}
              index={index}
              selected={props.selectedComps.includes(compsProperty)}
              toggle={() =>
                handleToggle(compsProperty)}
            />
          </Grid>
        ))}
      </Wrapper>
    </Grid>
  );
};

export default CompsSection;
