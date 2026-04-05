import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { SnackbarProvider } from 'notistack';
import EditBuyBoxDialog from '@/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog';
import type BuyBox from '@/models/buybox';

const meta: Meta<typeof EditBuyBoxDialog> = {
  title: 'BuyBox/EditBuyBoxDialog',
  component: EditBuyBoxDialog,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <Story />
        </SnackbarProvider>
      </Provider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof EditBuyBoxDialog>;

// Mock multifamily buybox for testing
const mockMultifamilyBuybox: BuyBox = {
  id: 'test-multifamily-buybox',
  userAccess: 'edit',
  createdAt: new Date(),
  updatedAt: new Date(),
  parameters: {
    name: 'Test Multifamily BuyBox',
    description: 'A test buybox for multifamily strategy',
    strategy: {
      strategyType: 'MULTIFAMILY',
      preset: 'VALUE_ADD',
      primaryKpi: {
        type: 'rent_upside',
        mode: 'minimum',
        minValue: 10,
        hardGateEnabled: true
      }
    },
    targetLocations: [
      {
        display: 'California',
        type: 'state',
        state: 'CA'
      }
    ],
    propertyCriteria: {}
  }
};

export const MultifamilyGeneral: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 1: General - BuyBox name and description fields'
      }
    }
  }
};

export const MultifamilyStrategy: Story = {
  args: {
    buybox: {
      ...mockMultifamilyBuybox,
      parameters: {
        ...mockMultifamilyBuybox.parameters,
        strategy: {
          strategyType: 'MULTIFAMILY'
        }
      }
    },
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 2: Strategy - Select strategy preset and configure primary KPI'
      }
    }
  }
};

export const MultifamilyLocation: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 3: Location - Configure target locations for deal search'
      }
    }
  }
};

export const MultifamilyDealFilters: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 4: Deal Filters - Set supporting filters (Asset Type, Units, Price, etc.)'
      }
    }
  }
};

export const MultifamilyQualityGates: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 5: Quality Gates - Configure document requirements (OM, Rent Roll, T12)'
      }
    }
  }
};

export const MultifamilyUnderwriting: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 6: Underwriting - Configure income, expenses, and utility assumptions'
      }
    }
  }
};

export const MultifamilyStressTest: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 7: Stress Test - Test strategy against adverse market conditions'
      }
    }
  }
};

export const MultifamilyReview: Story = {
  args: {
    buybox: mockMultifamilyBuybox,
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 8: Review - Review BuyBox configuration before saving'
      }
    }
  }
};

// Create new buybox (no initial data)
export const CreateNewMultifamily: Story = {
  args: {
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Create new BuyBox - Empty form for creating a new multifamily BuyBox'
      }
    }
  }
};

// View-only mode
export const ViewOnlyMode: Story = {
  args: {
    buybox: {
      ...mockMultifamilyBuybox,
      userAccess: 'viewer'
    },
    showEditBuybox: true,
    setShowEditBuybox: () => {}
  },
  parameters: {
    docs: {
      description: {
        story: 'View-only mode - BuyBox displayed without edit capabilities'
      }
    }
  }
};
