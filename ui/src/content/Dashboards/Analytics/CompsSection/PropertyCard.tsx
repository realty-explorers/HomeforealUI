import { Card, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';
import Image from '@/components/Photos/Image';
import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import Property from '@/models/property';

type PropertyCardProps = {
  property: Property;
};
const PropertyCard = (props: PropertyCardProps) => {
  return (
    <Card className={styles.propertyCard}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: '4rem' }}
      >
        <Typography className={styles.propertyHeader}>
          Target Property
        </Typography>
      </Grid>
      <Grid
        container
        justifyContent="center"
        padding={'0.5rem 1rem'}
        marginBottom={'2rem'}
      >
        <Image />
      </Grid>
      <Grid container justifyContent="center" rowGap={2}>
        <GridTableField
          size={12}
          fields={[
            { className: styles.propertyTableHeader, label: 'Feature' },
            { className: styles.propertyTableHeader, label: 'Subject' },
            {
              className: styles.propertyTableHeader,
              label: 'Comps AVG.'
            }
          ]}
        />
        {Array.from(Array(10)).map((_, i) => (
          <GridTableField
            key={i}
            size={12}
            fields={[
              { className: styles.propertyRowHeader, label: 'Listing Price' },
              { className: styles.propertyText, label: '$150,000' },
              { className: styles.propertyText, label: '$155,000' }
            ]}
          />
        ))}
      </Grid>
    </Card>
  );
};

export default PropertyCard;
