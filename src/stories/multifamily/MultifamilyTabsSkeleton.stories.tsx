import type { Meta, StoryObj } from '@storybook/react';
import MultifamilyTabsSkeleton from '@/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import type { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'BuyBox Filters',
  'Strategy',
  'Quality Gates'
];

const setupTabs = ['Underwriting Assumptions', 'Stress Testing'];

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
    title: 'BuyBox Filters',
    description: 'Set the deal profile you want us to search for.',
    tabs: criteriaTabs,
    mode: 'criteria'
  }
};

export const Setup: Story = {
  args: {
    title: 'Underwriting Assumptions',
    description:
      'These values are used only when listings and documents do not provide them.',
    tabs: setupTabs,
    mode: 'setup'
  }
};
