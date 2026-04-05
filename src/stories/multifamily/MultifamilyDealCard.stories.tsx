import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MultifamilyDealCard from '@/content/Dashboards/RealEstate/MapComponents/CardsPanel/MultifamilyDealCard';
import PropertyPreview from '@/models/propertyPreview';

const sampleProperty: PropertyPreview = {
  id: 'preview-1',
  address: '450 Lakeview Ave, Austin, TX 78701',
  coordinates: [-97.7428, 30.2704],
  price: 1980000,
  arvPrice: 2250000,
  arv25Price: 2380000,
  cap_rate: '6.8',
  image:
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
  area: 28500,
  status: 'for_sale',
  propertyType: 'multifamily',
  beds: 40,
  baths: 32,
  listDate: new Date('2026-01-22'),
  masked: false,
  priceGroup: {
    min: 1900000,
    max: 2050000
  }
};

const missingMetricsProperty: PropertyPreview = {
  ...sampleProperty,
  id: 'preview-2',
  cap_rate: 'N/A',
  price: undefined,
  priceGroup: {
    min: 1500000,
    max: 1700000
  }
};

const meta: Meta<typeof MultifamilyDealCard> = {
  title: 'Multifamily/RealEstate/MultifamilyDealCard',
  component: MultifamilyDealCard,
  parameters: {
    layout: 'centered',
    testHarness: {
      useRedux: false,
      useSession: false,
      useNotifications: false,
      useTooltips: false
    }
  },
  args: {
    property: sampleProperty,
    selectProperty: fn(),
    deselectProperty: fn(),
    setOpenMoreDetails: fn(),
    selected: false
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true
  }
};

export const MissingMetrics: Story = {
  args: {
    property: missingMetricsProperty
  }
};
