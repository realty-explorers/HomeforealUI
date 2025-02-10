import AnalyzedProperty from "@/models/analyzedProperty";
import { Grid, Typography } from "@mui/material";
import styles from "./PropertyHeaderStyles.module.scss";

type PropertyDetailsProps = {
  property: AnalyzedProperty;
};
const PropertyDetails = (props: PropertyDetailsProps) => {
  return (
    <>
      <Grid container>
        <Typography className={styles.detailsText}>
          Just off the Bellville square you will find this historic 1880’s
          3-story Victorian Eastlake home sitting on a one-acre corner lot. This
          home has original wood trim, long leaf pine floors, transoms, 12’
          ceilings, stained glass windows, claw foot bathtubs, milk glass light
          fixtures and more. MAIN HOUSE: The 3398 square feet includes the 1st
          and 2nd floors. The 3rd floor has an additional 926 SF (not included
          in total) that had been used for bedrooms and a game room.
        </Typography>
      </Grid>
    </>
  );
};

export default PropertyDetails;
