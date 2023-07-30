import ThemedButton from '@/components/Buttons/ThemedButton';
import Property from '@/models/property';
import { Box, Grid } from '@mui/material';

const Image = (props: any) => {
  return (
    <Box
      {...props}
      width="100%"
      height="100%"
      borderRadius="0.5rem"
      component="img"
      alt="The house from the offer."
      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
    />
  );
};

const ViewMore = () => {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%   ' }}>
      <Image sx={{ opacity: '0.5' }} />
      <ThemedButton
        text="See More"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};

type PropertyPhotosProps = {
  property: Property;
};
const PropertyPhotos = (props: PropertyPhotosProps) => {
  return (
    <>
      <Grid
        container
        sx={{ height: '100%' }}
        alignItems="center"
        columnSpacing={3}
      >
        <Grid item xs={8} sx={{ height: '100%' }}>
          <Image />
        </Grid>
        <Grid item xs={4} container sx={{ height: '100%' }} rowGap={3}>
          <Grid item xs={12}>
            <Image />
          </Grid>
          <Grid item xs={12}>
            <ViewMore />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PropertyPhotos;
