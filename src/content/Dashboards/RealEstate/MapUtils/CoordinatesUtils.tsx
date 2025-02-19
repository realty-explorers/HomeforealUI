import PropertyPreview from '@/models/propertyPreview';
import CompData from '@/models/compData';
import { currencyFormatter } from '@/utils/converters';
import { FilteredComp } from '@/models/analyzedProperty';
import { string } from 'zod';

const marginPercentage = (property: PropertyPreview, strategyMode: string) => {
  const fieldName = strategyMode === 'ARV' ? 'arv25Price' : 'arvPrice';
  return (
    ((property?.[fieldName] > 0 && property[fieldName] - property.price) /
      property[fieldName]) *
    100
  );
};

const generatePropertyGeoJson = (
  property: PropertyPreview,
  strategy: string
) => {
  const percentage = marginPercentage(property, strategy);
  return {
    type: 'Feature',
    properties: {
      id: property.id, // Generate a random ID
      // price: `${currencyFormatter(property.sales_listing_price)}`,
      price: `↓ ${percentage.toFixed()}%`,
      sortKey: -percentage
    },
    geometry: {
      type: 'Point',
      coordinates: [property.coordinates[0], property.coordinates[1], 0.0]
    }
  };
};

const generateCompsGeoJson = (comp: FilteredComp) => {
  return {
    type: 'Feature',
    properties: {
      id: comp.id, // Generate a random ID
      index: comp.index + 1,
      isARVCalculated: comp.isArv25th
    },
    geometry: {
      type: 'Point',
      coordinates: [
        comp.location.geometry.coordinates[0],
        comp.location.geometry.coordinates[1],
        0.0
      ]
    }
  };
};

export { generateCompsGeoJson, generatePropertyGeoJson };
