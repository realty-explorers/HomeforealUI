import * as React from 'react';
import { darken } from '@mui/material';
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  alpha
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

const SidebarLink = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'open'
})<any>(({ theme, open }) => ({
  minHeight: 48,
  justifyContent: open ? 'initial' : 'center',
  px: 2.5,

  '& .MuiListItemIcon-root': {
    color: theme.colors.alpha.trueWhite[30]
    // fontSize: theme.typography.pxToRem(20)
  },
  '&.active, &:hover': {
    backgroundColor: alpha(theme.colors.alpha.trueWhite[100], 0.06),
    color: theme.colors.alpha.trueWhite[100],
    '& .MuiListItemIcon-root': {
      color: theme.colors.alpha.trueWhite[100]
    }
  }
}));

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const Sidebar = (props: SidebarProps) => {
  const theme = useTheme();

  const toggleOpen = () => {
    props.setOpen(!props.open);
  };

  return (
    // <Box sx={{ display: 'flex' }}>
    //   <CssBaseline />
    //   <AppBar position="fixed" open={open}>
    //     <Toolbar>
    //       <IconButton
    //         color="inherit"
    //         aria-label="open drawer"
    //         onClick={handleDrawerOpen}
    //         edge="start"
    //         sx={{
    //           marginRight: 5,
    //           ...(open && { display: 'none' })
    //         }}
    //       >
    //         <MenuIcon />
    //       </IconButton>
    //       <Typography variant="h6" noWrap component="div">
    //         Mini variant drawer
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>

    <Drawer
      variant="permanent"
      open={props.open}
      sx={{
        '.MuiDrawer-paper': {
          background:
            theme.palette.mode === 'dark'
              ? theme.colors.alpha.white[100]
              : darken(theme.colors.alpha.black[100], 0.5),
          color: theme.colors.alpha.trueWhite[70]
        }
      }}
    >
      <DrawerHeader>
        <IconButton onClick={toggleOpen}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{}}>
        {['Overview', 'Real Estate', 'Analytics', 'Buy Boxes'].map(
          (text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <SidebarLink>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: props.open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: props.open ? 1 : 0 }}
                />
              </SidebarLink>
            </ListItem>
          )
        )}
      </List>
      <Divider />
    </Drawer>
    //   <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    //     <DrawerHeader />
    //     <Typography paragraph>
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    //       eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
    //       dolor purus non enim praesent elementum facilisis leo vel. Risus at
    //       ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
    //       quisque non tellus. Convallis convallis tellus id interdum velit
    //       laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
    //       adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
    //       integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
    //       eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
    //       quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
    //       vivamus at augue. At augue eget arcu dictum varius duis at consectetur
    //       lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
    //       faucibus et molestie ac.
    //     </Typography>
    //     <Typography paragraph>
    //       Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
    //       ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
    //       elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
    //       sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
    //       mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
    //       risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
    //       purus viverra accumsan in. In hendrerit gravida rutrum quisque non
    //       tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
    //       morbi tristique senectus et. Adipiscing elit duis tristique
    //       sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
    //       eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
    //       posuere sollicitudin aliquam ultrices sagittis orci a.
    //     </Typography>
    //   </Box>
    // </Box>
  );
};

export default Sidebar;
