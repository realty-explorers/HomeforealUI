import {
  Box,
  Button,
  Card,
  Container,
  styled,
  Typography
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import Link from 'src/components/Link';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import NavBarComponent from '@/content/Overview/Hero/Navbar/NavBarComponent';
import styles from '../src/content/Overview/Hero/LandingPage.module.scss';
import clsx from 'clsx';

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const host = req.headers.host?.split(':')[0] || '';
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const isAppHost = host === 'app.realtyexplorers.com';

  if (!isLocalHost && !isAppHost) {
    return {
      props: {}
    };
  }

  const referral = Array.isArray(query.referral)
    ? query.referral[0]
    : query.referral;

  if (typeof referral === 'string' && referral.length > 0) {
    const token = Array.isArray(query.token) ? query.token[0] : query.token;
    const searchParams = new URLSearchParams({ referral });

    if (typeof token === 'string' && token.length > 0) {
      searchParams.set('token', token);
    }

    searchParams.set('returnTo', '/');

    return {
      redirect: {
        destination: `/auth/referral-handler?${searchParams.toString()}`,
        permanent: false
      }
    };
  }

  return {
    redirect: {
      destination: '/auth/signin?callbackUrl=/dashboards/real-estate',
      permanent: false
    }
  };
};

function Overview() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto relative">
      <Head>
        <title>Realty Explorers</title>
      </Head>

      <div className="hidden lg:flex">
        <NavBarComponent />
      </div>
      {/* <div className="h-16" /> */}
      <Hero />
    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
