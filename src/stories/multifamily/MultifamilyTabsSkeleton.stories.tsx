import type { Meta, StoryObj } from '@storybook/react';
import MultifamilyTabsSkeleton from '@/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import type { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Unit Mix',
  'Rent Roll',
  'Income Assumptions',
  'Expense Assumptions',
  'Utilities'
];

const setupTabs = [
  'Capital Stack',
  'Loan Assumptions',
  'Renovation & CapEx',
  'Exit Scenario',
  'Risk & Notes'
];

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
    title: 'Multifamily Criteria',
    description:
      'Configure underwriting assumptions for unit mix, rent roll, and operating profile.',
    tabs: criteriaTabs,
    mode: 'criteria'
  }
};

export const Setup: Story = {
  args: {
    title: 'Multifamily Setup',
    description:
      'Define capital stack, debt assumptions, and risk scenarios for the investment model.',
    tabs: setupTabs,
    mode: 'setup'
  }
};
