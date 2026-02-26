import EditBuyBoxDialog from './EditBuyBoxDialog';
import type BuyBox from '@/models/buybox';
import { buyboxSchema, getDefaultBuyBoxData } from '@/schemas/BuyBoxSchemas';
import type { BuyboxSchemaData } from '@/schemas/BuyBoxSchemas';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockEnqueueSnackbar = jest.fn();
const mockDispatch = jest.fn();
const mockCreateBuyBox = jest.fn();
const mockUpdateBuyBox = jest.fn();
const mockDeleteBuyBox = jest.fn();
const mockUseCreateBuyBoxMutation = jest.fn();
const mockUseUpdateBuyBoxMutation = jest.fn();
const mockUseDeleteBuyBoxMutation = jest.fn();

jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar })
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}));

jest.mock('../../../../store/services/buyboxApiService', () => ({
  buyBoxApi: {
    util: {
      updateQueryData: jest.fn()
    }
  },
  useCreateBuyBoxMutation: (...args: any[]) =>
    mockUseCreateBuyBoxMutation(...args),
  useUpdateBuyBoxMutation: (...args: any[]) =>
    mockUseUpdateBuyBoxMutation(...args),
  useDeleteBuyBoxMutation: (...args: any[]) =>
    mockUseDeleteBuyBoxMutation(...args)
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <svg {...props} />,
  Loader2: (props: any) => <svg {...props} />,
  RotateCcw: (props: any) => <svg {...props} />,
  Save: (props: any) => <svg {...props} />
}));

jest.mock('./Sections/LocationCoverage/LocationCoverage', () => {
  return function LocationCoverageMock() {
    return <div data-testid="location-coverage-mock">Location Coverage</div>;
  };
});

jest.mock('./Sections/GeneralSection', () => {
  return function GeneralSectionMock() {
    return <div data-testid="general-section-mock">General Section</div>;
  };
});

jest.mock('./Sections/InvestmentStrategy', () => {
  return function InvestmentStrategyMock() {
    return <div data-testid="investment-strategy-mock">Investment Strategy</div>;
  };
});

jest.mock('./Sections/PropertyCriteria', () => {
  return function PropertyCriteriaMock() {
    return <div data-testid="property-criteria-mock">Property Criteria</div>;
  };
});

jest.mock('./Sections/AdjustComparables', () => {
  return function AdjustComparablesMock() {
    return <div data-testid="adjust-comparables-mock">Adjust Comparables</div>;
  };
});

jest.mock('./InvestmentCriteria', () => {
  return function InvestmentCriteriaMock() {
    return null;
  };
});

jest.mock('./ComparablePreferences', () => {
  return function ComparablePreferencesMock() {
    return null;
  };
});

jest.mock('./SimilarityChart', () => {
  return function SimilarityChartMock() {
    return null;
  };
});

jest.mock('./Sections/AdjustComparable', () => {
  return function AdjustComparableMock() {
    return null;
  };
});

jest.mock('./EditBuyboxDialogTitle', () => {
  return function EditBuyboxDialogTitleMock() {
    return <div data-testid="dialog-title-mock">Dialog Title</div>;
  };
});

jest.mock('./Sections/MultifamilyTabsSkeleton', () => {
  const { useFormContext } = require('react-hook-form');

  return function MultifamilyTabsSkeletonMock({ mode }: { mode: 'criteria' | 'setup' }) {
    const { register } = useFormContext();

    if (mode === 'setup') {
      return (
        <div>
          <label htmlFor="multifamily-notes-input">Notes</label>
          <input
            id="multifamily-notes-input"
            aria-label="Notes"
            {...register('multifamilySetup.riskAndNotes.notes')}
          />
        </div>
      );
    }

    return <div data-testid="multifamily-criteria-mock">Multifamily Criteria</div>;
  };
});

const buildMultifamilyParameters = (notes: string): BuyboxSchemaData => {
  const defaultData = getDefaultBuyBoxData();

  return buyboxSchema.parse({
    ...defaultData,
    name: 'Multifamily Dialog Roundtrip',
    description: 'Integration test buybox',
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
      ...defaultData.strategy,
      strategyType: 'MULTIFAMILY'
    },
    multifamilyCriteria: {
      ...defaultData.multifamilyCriteria,
      discovery: {
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
      },
      unitMix: [
        {
          unitType: '2BR / 1BA',
          units: 12,
          avgRent: 1850,
          avgSqft: 870
        }
      ]
    },
    multifamilySetup: {
      ...defaultData.multifamilySetup,
      riskAndNotes: {
        ...defaultData.multifamilySetup.riskAndNotes,
        notes
      }
    }
  });
};

const buildBuyBox = (parameters: BuyboxSchemaData): BuyBox => ({
  id: 'buybox-1',
  userAccess: 'edit',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  parameters
});

describe('EditBuyBoxDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    mockCreateBuyBox.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ id: 'created-buybox' })
    });
    mockUpdateBuyBox.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ id: 'buybox-1' })
    });
    mockDeleteBuyBox.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({})
    });

    mockUseCreateBuyBoxMutation.mockReturnValue([mockCreateBuyBox, {}]);
    mockUseUpdateBuyBoxMutation.mockReturnValue([mockUpdateBuyBox, {}]);
    mockUseDeleteBuyBoxMutation.mockReturnValue([mockDeleteBuyBox, {}]);
  });

  it('submits multifamily updates and rehydrates saved values when reopened', async () => {
    const user = userEvent.setup();
    const setShowEditBuybox = jest.fn();
    const initialBuybox = buildBuyBox(
      buildMultifamilyParameters('Initial multifamily note')
    );

    const { rerender } = render(
      <EditBuyBoxDialog
        buybox={initialBuybox}
        showEditBuybox
        setShowEditBuybox={setShowEditBuybox}
      />
    );

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /^next$/i }));
    }

    const notesInput = (await screen.findByLabelText(/^notes$/i)) as HTMLInputElement;

    await user.clear(notesInput);
    await user.type(notesInput, 'Updated multifamily roundtrip note');

    await user.click(screen.getByRole('button', { name: /save & finish/i }));

    await waitFor(() => {
      expect(mockUpdateBuyBox).toHaveBeenCalledTimes(1);
    });

    const submittedUpdateArgs = mockUpdateBuyBox.mock.calls[0][0];

    expect(submittedUpdateArgs.id).toBe('buybox-1');
    expect(submittedUpdateArgs.parameters.strategy.strategyType).toBe('MULTIFAMILY');
    expect(submittedUpdateArgs.parameters.multifamilySetup.riskAndNotes.notes).toBe(
      'Updated multifamily roundtrip note'
    );
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('BuyBox Saved', {
      variant: 'success'
    });
    expect(setShowEditBuybox).toHaveBeenCalledWith(false);

    const reopenedBuybox = buildBuyBox(
      submittedUpdateArgs.parameters as BuyboxSchemaData
    );

    rerender(
      <EditBuyBoxDialog
        buybox={reopenedBuybox}
        showEditBuybox
        setShowEditBuybox={setShowEditBuybox}
      />
    );

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /^next$/i }));
    }

    expect(await screen.findByLabelText(/^notes$/i)).toHaveValue(
      'Updated multifamily roundtrip note'
    );
  });
});
