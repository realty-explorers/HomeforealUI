import PropertyPreview from '@/models/propertyPreview';
import { currencyFormatter } from '@/utils/converters';
import { FilteredComp } from '@/models/analyzedProperty';

const getPropertyPrice = (property: PropertyPreview) => {
  return property.price ?? property.priceGroup?.min ?? 0;
};

const marginPercentage = (property: PropertyPreview, strategyMode: string) => {
  const fieldName = strategyMode === 'ARV' ? 'arv25Price' : 'arvPrice';
  const strategyPrice = property?.[fieldName];
  const propertyPrice = getPropertyPrice(property);

  if (
    typeof strategyPrice !== 'number' ||
    strategyPrice <= 0 ||
    propertyPrice <= 0
  ) {
    return 0;
  }

  return ((strategyPrice - propertyPrice) / strategyPrice) * 100;
};

const getUnitsCount = (property: PropertyPreview) => {
  const dynamicProperty = property as PropertyPreview & Record<string, unknown>;
  const unitFields = [
    dynamicProperty.units,
    dynamicProperty.unitCount,
    dynamicProperty.unitsCount,
    dynamicProperty.totalUnits,
    dynamicProperty.numberOfUnits,
    dynamicProperty.number_of_units
  ];

  for (const rawValue of unitFields) {
    const units = Number(rawValue);
    if (Number.isFinite(units) && units > 0) {
      return units;
    }
  }

  return undefined;
};

const getCapRate = (property: PropertyPreview) => {
  const rawCapRate = Number(property.cap_rate);
  if (Number.isFinite(rawCapRate) && rawCapRate >= 0) {
    return rawCapRate;
  }
  return undefined;
};

const buildMultifamilyMarkerLabel = (property: PropertyPreview) => {
  const capRate = getCapRate(property);
  const capRateLabel =
    capRate !== undefined ? `Cap ${capRate.toFixed(1)}%` : 'Cap N/A';

  const propertyPrice = getPropertyPrice(property);
  const units = getUnitsCount(property);
  const secondLine =
    units && propertyPrice > 0
      ? `${currencyFormatter(Math.round(propertyPrice / units))}/u`
      : currencyFormatter(propertyPrice);

  return `${capRateLabel}\n${secondLine}`;
};

const generatePropertyGeoJson = (
  property: PropertyPreview,
  strategy: string,
  strategyType = 'FIX_AND_FLIP'
) => {
  if (strategyType === 'MULTIFAMILY') {
    const capRate = getCapRate(property) ?? 0;
    return {
      type: 'Feature',
      properties: {
        id: property.id,
        price: buildMultifamilyMarkerLabel(property),
        sortKey: -capRate
      },
      geometry: {
        type: 'Point',
        coordinates: [property.coordinates[0], property.coordinates[1], 0.0]
      }
    };
  }

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
      isARVCalculated: comp.isArv25
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
