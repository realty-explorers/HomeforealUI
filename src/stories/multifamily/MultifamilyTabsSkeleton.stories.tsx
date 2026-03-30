import type { Meta, StoryObj } from '@storybook/react';
import MultifamilyTabsSkeleton from '@/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import type { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Deal Filters',
  'Strategy',
  'Quality Gates'
];

const underwritingTabs = [
  'Income',
  'Expenses',
  'Utilities'
];

const stressTabs = ['Stress Test'];

const reviewTabs = ['Review'];

const StoryFormWrapper = (
  args: ComponentProps<typeof MultifamilyTabsSkeleton>
) => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-full overflow-x-hidden bg-[#f8f9fb] p-4">
        <MultifamilyTabsSkeleton {...args} />
      </div>
    </FormProvider>
  );
};

const meta: Meta<typeof MultifamilyTabsSkeleton> = {
  title: 'Multifamily/BuyBox/MultifamilyTabsSkeleton',
  component: MultifamilyTabsSkeleton,
  parameters: {
    layout: 'fullscreen',
    testHarness: {
      useRedux: false,
      useSession: false,
      useNotifications: false,
      useTooltips: false
    }
  },
  render: (args) => <StoryFormWrapper {...args} />
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Criteria: Story = {
  args: {
    title: 'Deal Filters',
    description: 'Set the deal profile you want us to search for.',
    tabs: criteriaTabs
  }
};

export const UnderwritingIncome: Story = {
  args: {
    title: 'Underwriting Assumptions',
    description: 'Configure income, expense, and utility assumptions for underwriting.',
    tabs: underwritingTabs,
    mode: 'underwriting'
  }
};

export const StressTesting: Story = {
  args: {
    title: 'Stress Testing',
    description: 'Test your strategy against adverse market conditions.',
    tabs: stressTabs,
    mode: 'stress'
  }
};

export const Review: Story = {
  args: {
    title: 'Review & Save',
    description: 'Review your BuyBox configuration before saving.',
    tabs: reviewTabs,
    mode: 'review'
  }
};
