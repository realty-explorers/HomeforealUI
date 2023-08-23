import Property from '@/models/property';
import { Chip, Grid, Typography } from '@mui/material';
import styles from './PropertyHeaderStyles.module.scss';

type PropertyMainInfoProps = {
  property: Property;
};
const PropertyMainInfo = (props: PropertyMainInfoProps) => {
  return (
    <>
      <Grid container rowGap={1}>
        <Grid container item xs={12}>
          <Typography
            className={styles.infoHeader}
            sx={{ marginRight: '2rem' }}
          >
            Listing Price
          </Typography>
          <Typography className={styles.infoHeader}>
            {props.property.price}$
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
