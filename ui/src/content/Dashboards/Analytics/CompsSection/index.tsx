import Property from '@/models/property';
import { Box, Card, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';

import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import PropertyCard from './PropertyCard';
import CompsCard from './CompsCard';
import CompsProperty from '@/models/comps_property';

type CompsSectionProps = {
  property: Property;
};
const CompsSection = (props: CompsSectionProps) => {
  return (
    <Grid className={`${analyticsStyles.sectionContainer}`}>
      <Typography className={styles.compsSectionInfo}>
        We found 15 comps that match your search
      </Typography>
      <Typography className={styles.compsSectionEditText}>
        Edit comps filter
      </Typography>

      <Box className={styles.cardsWrapper}>
        <Grid item>
          <PropertyCard property={{} as Property} />
        </Grid>
        {Array.from(Array(10)).map((_, i) => (
          <Grid item key={i}>
            <CompsCard compsProperty={{} as CompsProperty} index={i + 1} />
          </Grid>
        ))}
      </Box>
    </Grid>
  );
};

export default CompsSection;
