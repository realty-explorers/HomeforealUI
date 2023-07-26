import Property from '@/models/property';
import { Grid } from '@mui/material';

type PropertyDetailsProps = {
  property: Property;
};
const PropertyDetails = (props: PropertyDetailsProps) => {
  return (
    <>
      <Grid container>
        <Grid item xs={8}></Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </>
  );
};

export default PropertyDetails;
