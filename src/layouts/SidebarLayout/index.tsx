'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { alpha, Box, lighten, styled, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import Script from 'next/script';
import IntroDialog from '@/components/Modals/Intro/IntroDialog';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { setShowVerificationDialog } from '@/store/slices/authSlice';
import { useLazyCheckUserVerifiedQuery } from '@/store/services/userApi';

const drawerWidth = 240;

const MainWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open'
})<any>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  // paddingLeft: `calc(${theme.spacing(7)} + 1px)`,
  transition: theme.transitions.create(['width', 'padding'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  ...(open &&
    {
      // marginLeft: drawerWidth,
      // width: `calc(100% - ${drawerWidth}px)`,
      // paddingLeft: drawerWidth
    })
}));

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const { data, status, update } = useSession();
  const dispatch = useAppDispatch();

  const [getVerification, verificationStatus] = useLazyCheckUserVerifiedQuery();

  useEffect(() => {
    if (!data?.user) return;
    const fetchVerification = async () => {
      const response = await getVerification({}).unwrap();
      if (response === true) {
        update({
          ...data,
          user: {
            ...data.user,
            verified: true
          }
        });
        // window.location.reload();
      } else {
        dispatch(setShowVerificationDialog(true));
      }
      console.log('response', response);
      return response === true;
    };
    if (!data?.user?.verified) {
      fetchVerification();
    }
  }, [data?.user?.verified]);

  return (
    <div className="flex flex-col h-[100dvh] w-full">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-SP38P408N4" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-SP38P408N4');
        `}
      </Script>
      <Header open={open} setOpen={setOpen} />
      <main className="flex w-full grow z-0" id="main">
        {children}
      </main>
      <IntroDialog />
      <BottomNavigation />
    </div>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;
