import type { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';
import type { BuyboxSchemaData } from '@/schemas/BuyBoxSchemas';
import { defaults } from '@/schemas/defaults';

const getRangeFieldProperties = (
  min: number | undefined,
  max: number | undefined,
  defaultMin: number,
  defaultMax: number
) => {
  return {
    enabled: Boolean(min) || Boolean(max),
    min: min || defaultMin,
    max: max || defaultMax
  };
};

const getMinFieldProperties = (min: number | undefined, defaultMin: number) => {
  return {
    enabled: Boolean(min),
    value: min || defaultMin
  };
};

export const convertBuyboxWeights = (weights: Record<string, number>) => {
  const newWeights: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    newWeights[key] = value * 100;
  }
  return newWeights;
};

export const mapBuyBoxDataToForm = (
  buyboxData: BuyboxSchemaData
): BuyBoxFormData => {
  return {
    name: buyboxData.name,
    description: buyboxData.description,
    propertyCriteria: {
      propertyTypes: {
        enabled: Boolean(buyboxData.propertyCriteria.propertyTypes),
        items:
          buyboxData.propertyCriteria.propertyTypes || defaults.propertyTypes.default
      },
      beds: getRangeFieldProperties(
        buyboxData.propertyCriteria.minBeds,
        buyboxData.propertyCriteria.maxBeds,
        defaults.bedrooms.min,
        defaults.bedrooms.max
      ),
      baths: getRangeFieldProperties(
        buyboxData.propertyCriteria.minBaths,
        buyboxData.propertyCriteria.maxBaths,
        defaults.bathrooms.min,
        defaults.bathrooms.max
      ),
      area: getRangeFieldProperties(
        buyboxData.propertyCriteria.minArea,
        buyboxData.propertyCriteria.maxArea,
        defaults.area.min,
        defaults.area.max
      ),
      lotArea: getRangeFieldProperties(
        buyboxData.propertyCriteria.minLotArea,
        buyboxData.propertyCriteria.maxLotArea,
        defaults.lotSize.min,
        defaults.lotSize.max
      ),
      yearBuilt: getRangeFieldProperties(
        buyboxData.propertyCriteria.minYearBuilt,
        buyboxData.propertyCriteria.maxYearBuilt,
        defaults.yearBuilt.min,
        defaults.yearBuilt.max
      ),
      price: getRangeFieldProperties(
        buyboxData.propertyCriteria.minPrice,
        buyboxData.propertyCriteria.maxPrice,
        defaults.listingPrice.min,
        defaults.listingPrice.max
      )
    },
    strategy: {
      strategyType: buyboxData.strategy.strategyType || 'FIX_AND_FLIP',
      minArv: getMinFieldProperties(buyboxData.strategy.minArv, defaults.arv.min),
      minMargin: getMinFieldProperties(
        buyboxData.strategy.minMargin,
        defaults.margin.min
      ),
      preset: buyboxData.strategy.preset,
      primaryKpi: buyboxData.strategy.primaryKpi || {
        type: undefined,
        mode: 'minimum',
        minValue: undefined,
        maxValue: undefined,
        hardGateEnabled: false
      },
      stressPreset: buyboxData.strategy.stressPreset
    },
    multifamilyCriteria: buyboxData.multifamilyCriteria,
    targetLocations: buyboxData.targetLocations,
    weights: convertBuyboxWeights(buyboxData.weights)
  };
};
