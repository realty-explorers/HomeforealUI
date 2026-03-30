import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MultifamilyAnalysisDrawer from '@/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer';
import AnalyzedProperty from '@/models/analyzedProperty';

const expenseItem = {
  expenseType: 'fixed',
  expenseRef: 'amount',
  expensePercentage: 0,
  expenseAmount: 0
};

const sampleProperty: AnalyzedProperty = {
  id: 'property-1',
  propertyId: 'property-1',
  buyboxId: 'buybox-1',
  analyzedDate: '2026-02-20',
  location: {
    address: '123 Market St',
    neighborhood: 'Downtown',
    street: 'Market St',
    zipCode: '78701',
    state: 'TX',
    city: 'Austin',
    geometry: {
      type: 'Point',
      coordinates: [-97.7431, 30.2672]
    }
  },
  listDate: '2026-02-10',
  price: 1250000,
  photos: {
    primary:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    all: [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  status: 'for_sale',
  type: 'multifamily',
  area: 24000,
  lotArea: 17000,
  yearBuilt: '1988',
  beds: 32,
  baths: 24,
  description: '24-unit value-add multifamily property',
  floors: 3,
  garages: 10,
  flags: {
    isPending: false,
    isForeclosure: false,
    isContingent: false
  },
  expenses: {
    fixedFee: { ...expenseItem, expenseAmount: 18000 },
    closingFee: { ...expenseItem, expenseAmount: 22000 },
    sellingFee: { ...expenseItem, expenseAmount: 35000 },
    rehab: { ...expenseItem, expenseAmount: 90000 }
  },
  loan: {
    amount: { ...expenseItem, expenseAmount: 875000 },
    downPayment: { ...expenseItem, expenseAmount: 375000 },
    closingCost: { ...expenseItem, expenseAmount: 22000 },
    interestRate: 6.5,
    duration: 360,
    totalPayment: 1990000
  },
  arvPrice: 1450000,
  arv25Price: 1520000,
  arvIds: ['arv-a', 'arv-b'],
  margin: 178000,
  marginPercentage: 14.2,
  arv25Percentage: 21.6,
  arvPercentage: 16,
  rentalCompsPrice: 131000,
  capRate: 6.2,
  noi: '78000',
  opportunities: ['Upside from unit renovations', 'Below-market in-place rents'],
  operationalExpenses: {
    propertyTax: { ...expenseItem, expenseAmount: 28000 },
    insurance: { ...expenseItem, expenseAmount: 9000 },
    maintenance: { ...expenseItem, expenseAmount: 21000 },
    management: { ...expenseItem, expenseAmount: 14000 },
    vacancy: { ...expenseItem, expenseAmount: 12000 }
  }
};

const meta: Meta<typeof MultifamilyAnalysisDrawer> = {
  title: 'Multifamily/RealEstate/MultifamilyAnalysisDrawer',
  component: MultifamilyAnalysisDrawer,
  parameters: {
    layout: 'fullscreen',
    testHarness: {
      useRedux: true,
      useNotifications: true,
      useSession: false
    }
  },
  args: {
    open: true,
    property: sampleProperty,
    onClose: fn()
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultOpen: Story = {};

export const EmptySelection: Story = {
  args: {
    property: undefined
  }
};

export const Closed: Story = {
  args: {
    open: false
  }
};
