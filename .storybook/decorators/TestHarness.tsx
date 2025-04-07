import React from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../src/store/store';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '../../src/components/ui/tooltip';

// Default mock store with initial state
const createMockStore = (customState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...customState
    }
  });
};

export const TestHarness = ({
  children,
  useRedux = true,
  useTooltips = true,
  useNotifications = true,
  useSession = true,
  theme = 'light',
  reduxState = {},
  notistackProps = { maxSnack: 3 },
  session = null
}) => {
  // Create store with custom state if provided
  const store = useRedux ? createMockStore(reduxState) : null;

  // Conditional wrapping based on parameters
  let content = children;

  if (useSession) {
    content = <SessionProvider session={session}>{content}</SessionProvider>;
  }

  if (useTooltips) {
    content = <TooltipProvider>{content}</TooltipProvider>;
  }

  if (useNotifications) {
    content = (
      <SnackbarProvider {...notistackProps}>{content}</SnackbarProvider>
    );
  }

  if (useRedux && store) {
    content = <Provider store={store}>{content}</Provider>;
  }

  return <div>{content}</div>;
};
