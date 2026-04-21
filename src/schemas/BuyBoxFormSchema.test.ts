import {
  BuyBoxFormData,
  formBuyBoxSchema,
  getDefaultBuyBoxFormData
} from './BuyBoxFormSchema';

const createValidFormData = (): BuyBoxFormData => {
  const data = getDefaultBuyBoxFormData() as BuyBoxFormData;

  data.name = 'Multifamily Smoke Test';
  data.targetLocations = [
    {
      display: 'Austin, TX 78701',
      type: 'zipCode',
      address: null,
      street: null,
      neighborhood: null,
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      latitude: 30.2672,
      longitude: -97.7431
    }
  ];

  return data;
};

describe('formBuyBoxSchema multifamily smoke', () => {
  it('parses valid multifamily payload', () => {
    const data = createValidFormData();
    data.strategy.strategyType = 'MULTIFAMILY';

    data.multifamilyCriteria.discovery = {
      ...data.multifamilyCriteria.discovery,
      assetTypes: ['MULTIFAMILY'],
      minUnits: 10,
      maxUnits: 150,
      minAskingPrice: 1000000,
      maxAskingPrice: 15000000,
      minPricePerUnit: 50000,
      maxPricePerUnit: 250000,
      minYearBuilt: 1970,
      maxYearBuilt: 2020,
      minOccupancyPct: 80,
      maxOccupancyPct: 98,
      renovationAppetite: 'MODERATE',
      dealQualityGates: {
        requireOm: 'REQUIRED',
        requireRentRoll: 'PREFERRED',
        requireT12: 'OPTIONAL'
      },
      rankingPreset: 'BALANCED',
      rankingWeights: {
        yield: 25,
        upside: 25,
        discount: 25,
        risk: 15,
        docs: 10
      }
    };

    data.multifamilyCriteria.unitMix = [
      {
        unitType: '2BR / 1BA',
        units: 12,
        avgRent: 1850,
        avgSqft: 870
      }
    ];

    const result = formBuyBoxSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.strategy.strategyType).toBe('MULTIFAMILY');
      expect(result.data.multifamilyCriteria.unitMix).toHaveLength(1);
      expect(result.data.multifamilyCriteria.discovery.rankingPreset).toBe('BALANCED');
    }
  });

  it('fails when required identity/location fields are missing', () => {
    const data = getDefaultBuyBoxFormData();

    const result = formBuyBoxSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldsInError = result.error.issues.map((issue) => issue.path.join('.'));
      expect(fieldsInError).toContain('name');
      expect(fieldsInError).toContain('targetLocations');
    }
  });
});
