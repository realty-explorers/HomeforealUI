// Wizard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Wizard from '@/content/Dashboards/Analytics/Offer2';
import { getDefaultSession } from '@/utils/session';

const meta: Meta<typeof Wizard> = {
  title: 'Forms/Wizard',
  component: Wizard,
  parameters: {
    testHarness: {
      useRedux: true,
      useSession: true,
      reduxState: {
        properties: {
          selectedProperty: {
            propertyId: 'property123',
            price: 500000,
            address: '123 Main St'
          }
        }
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Wizard>;

// Auth user story
export const LoggedInUser: Story = {
  args: {
    open: true,
    onClose: () => console.log('Dialog closed')
  },
  parameters: {
    testHarness: {
      session: {
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com'
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24 hours from now
      }
    }
  }
};

// User not logged in
export const LoggedOutUser: Story = {
  args: {
    open: true,
    onClose: () => console.log('Dialog closed')
  },
  parameters: {
    testHarness: {
      session: null
    }
  }
};
