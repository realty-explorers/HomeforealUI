import '../styles/globals.css';
import { ReactElement, ReactNode } from 'react';
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
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { SessionProvider } from 'next-auth/react';
import clsx from 'clsx';
import {
  nunito,
  oleoScript,
  playfairDisplay,
  poppins
} from '@/components/Fonts';

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

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        {/* <UserProvider> */}
        <Head>
          <title>Homeforeal App</title>
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
                  <CssBaseline />
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
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SidebarProvider>
        </SessionProvider>
        {/* </UserProvider> */}
      </CacheProvider>
    </Provider>
  );
}

export default HomeforealApp;
