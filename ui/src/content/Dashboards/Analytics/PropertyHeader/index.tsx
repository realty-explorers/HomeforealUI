import Property from '@/models/property';
import PropertyPhotos from './PropertyPhotos';
import { Card, CardContent, Grid } from '@mui/material';
import PropertyMainInfo from './PropertyMainInfo';
import PropertyDetails from './PropertyDetails';

type PropertyHeaderProps = {
  property: Property;
};
const PropertyHeader = (props: PropertyHeaderProps) => {
  return (
    <Card>
      <CardContent>
        <Grid container rowGap={3}>
          <Grid item xs={12}>
            <PropertyPhotos property={props.property} />
          </Grid>
          <Grid item xs={12}>
            <PropertyMainInfo property={props.property} />
          </Grid>
          <Grid item xs={12}>
            <PropertyDetails property={props.property} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PropertyHeader;
