import Property from '@/models/property';
import PropertyPhotos from './PropertyPhotos';
import { Card, CardContent, Grid } from '@mui/material';
import PropertyMainInfo from './PropertyMainInfo';
import PropertyDetails from './PropertyDetails';
import analyticsStyles from '../Analytics.module.scss';
import Deal from '@/models/deal';
import clsx from 'clsx';
import AnalyzedProperty from '@/models/analyzedProperty';
import MarginInfo from './MarginInfo';
import PropertyTags from './PropertyTags';

type PropertyHeaderProps = {
  property: AnalyzedProperty;
};
const PropertyHeader = (props: PropertyHeaderProps) => {
  return (
    <div
      className={clsx([
        analyticsStyles.sectionContainer,
        'flex flex-col w-full h-auto'
      ])}
    >
      <div className="flex">
        <PropertyPhotos photos={props.property.photos.all} />
      </div>
      <PropertyTags property={props.property} />
      <PropertyMainInfo property={props.property || ({} as AnalyzedProperty)} />
    </div>
  );
};

export default PropertyHeader;
