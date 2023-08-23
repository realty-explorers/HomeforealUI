import Property from '@/models/property';
import PropertyPhotos from './PropertyPhotos';
import { Card, CardContent, Grid } from '@mui/material';
import PropertyMainInfo from './PropertyMainInfo';
import PropertyDetails from './PropertyDetails';
import analyticsStyles from '../Analytics.module.scss';
import Deal from '@/models/deal';
import clsx from 'clsx';

type PropertyHeaderProps = {
  deal: Deal;
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
        <PropertyPhotos photos={props.deal?.property.images || []} />
      </div>
      <div className="flex">
        <PropertyMainInfo property={props.deal?.property || ({} as Property)} />
      </div>
      <div className="flex">
        <PropertyDetails property={props.deal?.property || ({} as Property)} />
      </div>
    </div>
  );
};

export default PropertyHeader;
