import type { Meta, StoryObj } from '@storybook/react';
import MultifamilyTabsSkeleton from '@/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import type { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Discovery',
  'Strategy',
  'Quality Gates'
];

const setupTabs = ['Defaults', 'Stress Test'];

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
    title: 'Multifamily Discovery',
    description:
      'Configure discovery filters, quality gates, and ranking preferences for multifamily opportunities.',
    tabs: criteriaTabs,
    mode: 'criteria'
  }
};

export const Setup: Story = {
  args: {
    title: 'Multifamily Defaults',
    description:
      'Set defaults used only when listing and document data are missing.',
    tabs: setupTabs,
    mode: 'setup'
  }
};
