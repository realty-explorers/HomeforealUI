import AnalyzedProperty from '@/models/analyzedProperty';
import { priceFormatter, priceGroupFormatter } from '@/utils/converters';
import { Chip, Grid, Typography } from '@mui/material';
import styles from './PropertyHeaderStyles.module.scss';

type PropertyMainInfoProps = {
  property: AnalyzedProperty;
};
const PropertyMainInfo = (props: PropertyMainInfoProps) => {
  return (
    <>
      <Grid container rowGap={1}>
        <Grid container item xs={12}>
          {/* <Typography */}
          {/*   className={styles.infoHeader} */}
          {/*   sx={{ marginRight: "2rem" }} */}
          {/* > */}
          {/*   Listing Price */}
          {/* </Typography> */}
          <Typography className={styles.infoHeader}>
            {priceGroupFormatter(
              props.property.price,
              props.property.priceGroup
            )}
            {/* {priceFormatter(props.property.price)} */}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.infoDescription}>
            {`${props.property.location.address}, ${props.property.location.city}, ${props.property.location.state} ${props.property.location.zipCode}`}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default PropertyMainInfo;
