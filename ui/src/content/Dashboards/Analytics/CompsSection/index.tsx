import Property from '@/models/property';
import { Box, Card, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';

import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import PropertyCard from './PropertyCard';
import CompsCard from './CompsCard';
import CompsProperty from '@/models/comps_property';
import styled from '@emotion/styled';
import { Height } from '@mui/icons-material';

const Wrapper = styled(Box)(({ theme }) => ({
  width: '10rem',
  overflow: 'hidden',
  '&::-webkit-scrollbar': {
    height: '0.3rem'
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,.1)'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,1)'
  }
}));

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

      <Wrapper className={styles.cardsWrapper}>
        <Grid item>
          <PropertyCard property={{} as Property} />
        </Grid>
        {Array.from(Array(10)).map((_, i) => (
          <Grid item key={i}>
            <CompsCard compsProperty={{} as CompsProperty} index={i + 1} />
          </Grid>
        ))}
      </Wrapper>
    </Grid>
  );
};

export default CompsSection;
