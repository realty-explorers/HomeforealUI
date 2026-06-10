import PropertyPreview from '@/models/propertyPreview';
import { currencyFormatter } from '@/utils/converters';
import { FilteredComp } from '@/models/analyzedProperty';
import type { Feature, Point } from 'geojson';

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

// 0..3 — drives tier-aware text color, halo and size in the marker
// layer (see layers.ts). Higher tier = stronger deal.
const marginTier = (percentage: number): number => {
  if (percentage >= 70) return 3;
  if (percentage >= 50) return 2;
  if (percentage >= 30) return 1;
  return 0;
};

const capRateTier = (capRate: number): number => {
  if (capRate >= 10) return 3;
  if (capRate >= 7) return 2;
  if (capRate >= 5) return 1;
  return 0;
};

type PropertyFeatureProps = {
  id: string;
  price: string;
  // Optional leading glyph (e.g. "↓ ") rendered at a smaller font-scale
  // in the marker layer to cue "under market" without dominating the
  // percentage. Empty string when the metric doesn't carry that meaning
  // (multifamily cap-rate marker).
  arrow: string;
  sortKey: number;
  tier: number;
  // Numeric fields for heatmap weighting. Strings above stay for the
  // marker pill label; these are independent so layers can use either.
  priceValue: number;
  dealValue: number;
};

const generatePropertyGeoJson = (
  property: PropertyPreview,
  strategy: string,
  strategyType = 'FIX_AND_FLIP'
): Feature<Point, PropertyFeatureProps> => {
  const rawPrice = getPropertyPrice(property);

  if (strategyType === 'MULTIFAMILY') {
    const capRate = getCapRate(property) ?? 0;
    const units = getUnitsCount(property);
    const pricePerUnit = units && rawPrice > 0 ? rawPrice / units : rawPrice;
    return {
      type: 'Feature',
      properties: {
        id: property.id,
        price: buildMultifamilyMarkerLabel(property),
        arrow: '',
        sortKey: -capRate,
        tier: capRateTier(capRate),
        priceValue: pricePerUnit,
        dealValue: capRate
      },
      geometry: {
        type: 'Point',
        coordinates: [property.coordinates[0], property.coordinates[1], 0.0]
      }
    };
  }

  const percentage = marginPercentage(property, strategy);
  // ↓ glyph cues "under market" at a glance — the percentage is how
  // much below the ARV/strategy price the listing sits. Rendered at a
  // smaller font-scale in the marker layer so it doesn't compete with
  // the number itself.
  return {
    type: 'Feature',
    properties: {
      id: property.id,
      price: `${percentage.toFixed()}%`,
      arrow: '↓ ',
      sortKey: -percentage,
      tier: marginTier(percentage),
      priceValue: rawPrice,
      dealValue: percentage
    },
    geometry: {
      type: 'Point',
      coordinates: [property.coordinates[0], property.coordinates[1], 0.0]
    }
  };
};

const generateCompsGeoJson = (
  comp: FilteredComp
): Feature<Point, { id: string; index: number; isARVCalculated: boolean }> => {
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
