import AnalyzedProperty from "@/models/analyzedProperty";
import { priceFormatter } from "@/utils/converters";
import { Chip, Grid, Typography } from "@mui/material";
import styles from "./PropertyHeaderStyles.module.scss";

type PropertyMainInfoProps = {
  property: AnalyzedProperty;
};
const PropertyMainInfo = (props: PropertyMainInfoProps) => {
  return (
    <>
      <Grid container rowGap={1}>
        <Grid container item xs={12}>
          <Typography
            className={styles.infoHeader}
            sx={{ marginRight: "2rem" }}
          >
            Listing Price
          </Typography>
          <Typography className={styles.infoHeader}>
            {priceFormatter(props.property.listing_price)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Chip label="Active" color="success" size="small" />
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.infoDescription}>
            {props.property.address}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default PropertyMainInfo;
