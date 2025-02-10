import { Card, Divider, Grid, Typography } from '@mui/material';
import GridTableField from '@/components/Grid/GridTableField';
import Image from '@/components/Photos/Image';
import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import AnalyzedProperty, { CompData } from '@/models/analyzedProperty';
import { priceFormatter } from '@/utils/converters';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

const gridRows = (property: AnalyzedProperty) => [
  {
    label: 'Rental Price',
    value: priceFormatter(property.price),
    averageProperty: 'price',
    averageFormatter: priceFormatter
  },
  {
    label: 'Bedrooms',
    value: property['beds'],
    averageProperty: 'beds'
  },
  {
    label: 'Bathrooms',
    value: property['baths'],
    averageProperty: 'baths'
  },
  {
    label: 'Lot Sqft',
    value: property.lot_area,
    averageProperty: 'lot_area'
  },
  {
    label: 'Building Sqft',
    value: property['area'],
    averageProperty: 'area'
  },
  {
    label: 'Floors',
    value: property['floors'],
    averageProperty: 'floors'
  },
  {
    label: 'Garages',
    value: property.garages,
    averageProperty: 'garages'
  },
  {
    label: 'Year Built',
    value:
      typeof property.year_built === 'string'
        ? property.year_built.slice(0, 4)
        : property.year_built,
    averageProperty: 'year_built'
  },
  // {
  //   label: "Neighborhood",
  //   value: "neighborhood",
  // },
  {
    label: 'Location',
    value: `${property.location.neighborhood}`,
    className: 'truncate col-span-2'
  },
  {
    label: 'Rent/Sqft',
    value: `${(property.price / property.area).toFixed()}`
  }
];

const defaultImage =
  'https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q=';

type PropertyCardRentalProps = {
  property: AnalyzedProperty;
  compsProperties: CompData[];
};

const PropertyCardRental = (props: PropertyCardRentalProps) => {
  const [cardImage, setCardImage] = useState(
    props.property.photos.primary || defaultImage
  );

  useEffect(() => {
    setCardImage(props.property.photos.primary || defaultImage);
  }, [props.property.photos.primary]);
  const calcCompsAverage = (propertyName: string) => {
    if (!props.compsProperties || props.compsProperties.length < 1) return '';
    const values = props.compsProperties
      .map((comp) => comp[propertyName])
      .filter((comp) => typeof comp === 'number');
    if (values.length < 1) return '';
    return (values.reduce((acc, curr) => acc + curr) / values.length).toFixed();
  };

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
        <img
          src={
            cardImage ||
            'https://media.istockphoto.com/id/1145840259/vector/home-flat-icon-pixel-perfect-for-mobile-and-web.jpg?s=612x612&w=0&k=20&c=2DWK30S50TbctWwccYw5b-uR6EAksv1n4L_aoatjM9Q='
          }
          className="h-44 rounded-lg aspect-video object-cover"
          onError={() => setCardImage(defaultImage)}
        />
      </Grid>
      <div className="grid grid-cols-3 gap-y-4">
        <div>
          <Typography className={styles.propertyTableHeader}>
            Feature
          </Typography>
        </div>
        <div>
          <Typography className={styles.propertyTableHeader}>
            Subject
          </Typography>
        </div>
        <div>
          <Typography className={styles.propertyTableHeader}>
            Comps AVG.
          </Typography>
        </div>
        {gridRows(props.property).map((property, index) => {
          const averageLabel = property.averageProperty
            ? property.averageFormatter
              ? property.averageFormatter(
                  calcCompsAverage(property.averageProperty)
                )
              : calcCompsAverage(property.averageProperty)
            : '';
          return (
            <React.Fragment key={index}>
              <div className="text-white">
                <Typography className={styles.propertyRowHeader}>
                  {property.label}
                </Typography>
              </div>

              <div className="text-white">
                <Typography
                  className={clsx([styles.propertyText, property.className])}
                >
                  {property.value}
                </Typography>
              </div>

              <div className="text-white">
                <Typography className={styles.propertyText}>
                  {averageLabel}
                </Typography>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* <Grid container justifyContent="center" rowGap={2}> */}
      {/*     size={12} */}
      {/*     fields={[ */}
      {/*       { className: styles.propertyTableHeader, label: "Feature" }, */}
      {/*       { className: styles.propertyTableHeader, label: "Subject" }, */}
      {/*       { */}
      {/*         className: styles.propertyTableHeader, */}
      {/*         label: "Comps AVG.", */}
      {/*       }, */}
      {/*     ]} */}
      {/*   /> */}
      {/*   {gridRows(props.property).map((property, index) => { */}
      {/*     const averageLabel = property.averageProperty */}
      {/*       ? property.averageFormatter */}
      {/*         ? property.averageFormatter( */}
      {/*           calcCompsAverage(property.averageProperty), */}
      {/*         ) */}
      {/*         : calcCompsAverage(property.averageProperty) */}
      {/*       : ""; */}
      {/*     return ( */}
      {/*       <GridTableField */}
      {/*         key={index} */}
      {/*         size={12} */}
      {/*         fields={[ */}
      {/*           { className: styles.propertyRowHeader, label: property.label }, */}
      {/*           { */}
      {/*             className: styles.propertyText, */}
      {/*             label: `${property.value}`, */}
      {/*           }, */}
      {/*           { */}
      {/*             className: styles.propertyText, */}
      {/*             label: `${averageLabel}`, */}
      {/*             // label: "meow", */}
      {/*           }, */}
      {/*         ]} */}
      {/*       /> */}
      {/*     ); */}
      {/*   })} */}
      {/* </Grid> */}
    </Card>
  );
};

export default PropertyCardRental;
