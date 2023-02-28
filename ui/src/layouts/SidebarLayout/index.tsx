import { FC, ReactNode, useState } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import Header from './Header';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();

  // const search = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await findDeals(
  //       searchData.location['metaData'].regionId,
  //       searchData.distance,
  //       searchData.underComps,
  //       parseInt(searchData.arv.min),
  //       parseInt(searchData.arv.max),
  //       parseInt(searchData.price.min),
  //       parseInt(searchData.price.max),
  //       searchData.lastSold
  //     );
  //     if (response.status === 200) {
  //       setSearchResults(response.data);
  //       alert('done');
  //     } else throw Error(response.data);
  //   } catch (error) {
  //     console.log(JSON.stringify(error));
  //     alert(JSON.stringify(error));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">{children}</Box>
        </Box>
      </Box>
    </>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;
