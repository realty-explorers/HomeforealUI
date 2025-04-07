import React from 'react';
import type { Preview } from '@storybook/react';
import { TestHarness } from './decorators/TestHarness';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    testHarness: {
      useRedux: true,
      useNotifications: true,
      useSession: true,
      reduxState: {},
      session: null
    }
  },
  decorators: [
    (Story, context) => (
      <TestHarness {...context.parameters.testHarness}>
        <Story />
      </TestHarness>
    )
  ]
};

export default preview;
