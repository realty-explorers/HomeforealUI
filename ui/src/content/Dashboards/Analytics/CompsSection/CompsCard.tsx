import { Card, Checkbox, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';
import Image from '@/components/Photos/Image';
import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import Property from '@/models/property';
import CompsProperty from '@/models/comps_property';
import styled from '@emotion/styled';

const CheckBoxWhite = styled(Checkbox)(({ theme }) => ({
  color: 'white'
}));

type CompsCardProps = {
  index: number;
  compsProperty: CompsProperty;
};
const CompsCard = (props: CompsCardProps) => {
  return (
    <Card className={styles.compsCard}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: '4rem' }}
      >
        <CheckBoxWhite title="Select this property" />
        <Typography className={styles.propertyHeader}>
          Comp {props.index}
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
            { className: styles.propertyTableHeader, label: 'Comps' }
          ]}
        />
        {Array.from(Array(10)).map((_, i) => (
          <GridTableField
            key={i}
            size={12}
            fields={[
              { className: styles.propertyRowHeader, label: 'Listing Price' },
              { className: styles.propertyText, label: '$150,000' }
            ]}
          />
        ))}
      </Grid>
    </Card>
  );
};

export default CompsCard;
