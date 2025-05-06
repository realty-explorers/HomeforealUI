import '../styles/globals.css';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import store from '@/store/store';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { SessionProvider, useSession } from 'next-auth/react';
import clsx from 'clsx';
import {
  nunito,
  oleoScript,
  playfairDisplay,
  poppins
} from '@/components/Fonts';
import { TooltipProvider } from '@/components/ui/tooltip';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import dynamic from 'next/dynamic';

// Dynamically import the PostHogUserIdentifier to ensure it only runs on client
const PostHogUserIdentifier = dynamic(
  () => import('../src/components/Analytics/PostHogUserIdentifier'),
  { ssr: false }
);

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface HomeforealAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function HomeforealApp(props: HomeforealAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.debug();
        }
      },
      debug: process.env.NODE_ENV === 'development'
    });

    const handleRouteChange = () => {
      posthog.capture('$pageview');
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <Provider store={store}>
      <PostHogProvider client={posthog}>
        <CacheProvider value={emotionCache}>
          {/* <UserProvider> */}
          <Head>
            <title>Realty Explorers</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
          </Head>
          <SessionProvider session={pageProps.session}>
            <SidebarProvider>
              <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <SnackbarProvider>
                    <TooltipProvider>
                      <CssBaseline />
                      {/* PostHog user identification */}
                      <PostHogUserIdentifier />
                      <div
                        className={clsx([
                          poppins.variable,
                          playfairDisplay.variable,
                          oleoScript.variable,
                          nunito.variable
                        ])}
                      >
                        {getLayout(<Component {...pageProps} />)}
                      </div>
                    </TooltipProvider>
                  </SnackbarProvider>
                </LocalizationProvider>
              </ThemeProvider>
            </SidebarProvider>
          </SessionProvider>
          {/* </UserProvider> */}
        </CacheProvider>
      </PostHogProvider>
    </Provider>
  );
}

export default HomeforealApp;
