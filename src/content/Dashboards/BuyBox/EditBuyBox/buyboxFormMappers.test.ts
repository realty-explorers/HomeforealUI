import { formBuyBoxSchema } from '@/schemas/BuyBoxFormSchema';
import { buyboxSchema, getDefaultBuyBoxData } from '@/schemas/BuyBoxSchemas';
import type { BuyboxSchemaData } from '@/schemas/BuyBoxSchemas';
import { mapBuyBoxDataToForm } from './buyboxFormMappers';

describe('buyboxFormMappers', () => {
  it('preserves multifamily fields through save and reopen roundtrip', () => {
    const defaultBuyBoxData = getDefaultBuyBoxData();

    const initialApiPayload = buyboxSchema.parse({
      ...defaultBuyBoxData,
      name: 'Multifamily Roundtrip BuyBox',
      targetLocations: [
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
      ],
      strategy: {
        ...defaultBuyBoxData.strategy,
        strategyType: 'MULTIFAMILY'
      },
      multifamilyCriteria: {
        ...defaultBuyBoxData.multifamilyCriteria,
        unitMix: [
          {
            unitType: '2BR / 1BA',
            units: 12,
            avgRent: 1850,
            avgSqft: 870
          }
        ],
        rentRoll: {
          ...defaultBuyBoxData.multifamilyCriteria.rentRoll,
          physicalOccupancyPct: 94,
          economicOccupancyPct: 91
        }
      },
      multifamilySetup: {
        ...defaultBuyBoxData.multifamilySetup,
        capitalStack: {
          ...defaultBuyBoxData.multifamilySetup.capitalStack,
          purchasePrice: 2100000
        },
        riskAndNotes: {
          ...defaultBuyBoxData.multifamilySetup.riskAndNotes,
          notes: 'Roundtrip notes are preserved'
        }
      }
    });

    const formValuesBeforeSave = mapBuyBoxDataToForm(initialApiPayload);
    const saveResult = formBuyBoxSchema.safeParse(formValuesBeforeSave);

    expect(saveResult.success).toBe(true);
    if (!saveResult.success) {
      return;
    }

    const persistedApiPayload = saveResult.data as BuyboxSchemaData;
    const formValuesAfterReopen = mapBuyBoxDataToForm(persistedApiPayload);

    expect(formValuesAfterReopen.strategy.strategyType).toBe('MULTIFAMILY');
    expect(formValuesAfterReopen.multifamilyCriteria.unitMix).toHaveLength(1);
    expect(formValuesAfterReopen.multifamilyCriteria.unitMix[0].unitType).toBe(
      '2BR / 1BA'
    );
    expect(
      formValuesAfterReopen.multifamilySetup.riskAndNotes.notes
    ).toBe('Roundtrip notes are preserved');

    const firstWeightKey = Object.keys(formValuesBeforeSave.weights)[0];
    expect(formValuesAfterReopen.weights[firstWeightKey]).toBe(
      formValuesBeforeSave.weights[firstWeightKey]
    );
  });
});
