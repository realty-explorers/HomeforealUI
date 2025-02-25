'use client';

import { useEffect, useRef, useState } from 'react';

import NextLink from 'next/link';

import useSWR from 'swr';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
// import { useUser } from "@auth0/nextjs-auth0/client";
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setToken } from '@/store/slices/authSlice';
import { signOut, useSession } from 'next-auth/react';
import VerificationAlertBadge from './VerificationAlertBadge';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  // const { data, status } = useSession({
  //   required: true
  // });
  // const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
  //   useAuth0();
  // const { user, isLoading } = useUser();
  const { data, status } = useSession();
  const user = data?.user;
  // const user = {
  //   name: 'John Doe',
  //   picture: '/static/images/avatars/1.jpg',
  //   user_roles: 'Admin'
  // };
  const avatar = '/static/images/avatars/avatar2.png';

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const fetcher = async (uri) => {
    const response = await fetch(uri);
    return response.json();
  };

  const dispatch = useDispatch();
  // const { data, error } = useSWR('/api/protected', fetcher);
  const { token } = useSelector(selectAuth);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  useEffect(() => {
    if (data) {
      //     //TODO: move this to a requireAuth wrapper, and check state of authSlice to see if you need to login
      //     //      and refetch and accessToken
      dispatch(setToken(data.user.accessToken));
    }
    //   } else if (3 == 1) {
    //     // if (data.error === 'ERR_EXPIRED_ACCESS_TOKEN') {
    //     // signOut();
    //     // location.href = '/api/auth/logout';
    //     // }
    //   }
    //
  }, [data]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    const awsDoman =
      'https://us-east-2atdpsnua7.auth.us-east-2.amazoncognito.com';
    const logoutUrl = `${awsDoman}/logout?client_id=f9c39cp5p9pmstb1a45lun2n4&logout_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_URL
    )}`;
    window.location.href = logoutUrl;
  };

  return (
    <>
      <div className="flex items-center">
        {user && !user.verified && <VerificationAlertBadge />}
        <UserBoxButton
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          id="meow"
        >
          <Avatar
            variant="rounded"
            alt={user?.name || user?.email}
            src={user?.image || avatar}
          />

          {/* <Hidden mdDown> */}
          {/*   <UserBoxText> */}
          {/*     <UserBoxLabel variant="body1"> */}
          {/*       {user?.name || user?.email} */}
          {/*     </UserBoxLabel> */}
          {/*     <UserBoxDescription variant="body2"></UserBoxDescription> */}
          {/*   </UserBoxText> */}
          {/* </Hidden> */}
          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
          </Hidden>
        </UserBoxButton>
        <Popover
          anchorEl={ref.current}
          onClose={handleClose}
          open={isOpen}
          onClick={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuUserBox sx={{ minWidth: 210 }} display="flex">
            <Avatar
              variant="rounded"
              alt={user?.name || user?.email}
              src={user?.image || avatar}
            />
            <UserBoxText className="flex items-center">
              <UserBoxLabel variant="body1">
                {user?.name || user?.email}
              </UserBoxLabel>
              <UserBoxDescription variant="body2">
                {/* {user?.user_roles} */}
              </UserBoxDescription>
            </UserBoxText>
          </MenuUserBox>
          <Divider sx={{ mb: 0 }} />
          <List sx={{ p: 1 }} component="nav">
            <NextLink href="/management/profile" passHref>
              <ListItem button>
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText primary="My Profile" />
              </ListItem>
            </NextLink>

            {/* <NextLink href="/management/profile/settings" passHref> */}
            {/*   <ListItem button> */}
            {/*     <AccountTreeTwoToneIcon fontSize="small" /> */}
            {/*     <ListItemText primary="Account Settings" /> */}
            {/*   </ListItem> */}
            {/* </NextLink> */}
          </List>
          <Divider />
          <Box sx={{ m: 1 }}>
            <Button
              color="primary"
              fullWidth
              // href="/api/auth/logout"
              onClick={handleSignOut}
            >
              <LockOpenTwoToneIcon sx={{ mr: 1 }} />
              Sign out
            </Button>
          </Box>
        </Popover>
      </div>
    </>
  );
}

export default HeaderUserbox;
