import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
// import Link from "src/components/Link";
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

const pages = [
  {
    title: 'Search',
    href: '/dashboards/real-estate'
  },
  {
    title: 'BuyBox',
    href: '/dashboards/buybox'
  }
];

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <div>
      <ListWrapper className="hidden md:flex" ref={ref}>
        <Logo />
        <List disablePadding component={Box} display="flex">
          {pages.map((page, index) => (
            <ListItem
              key={index}
              classes={{ root: 'MuiListItem-indicators' }}
              className={clsx([pathname === page.href && 'active'])}
              component={Link}
              button
              href={page.href}
            >
              <ListItemText
                primaryTypographyProps={{
                  noWrap: true,
                  fontFamily: 'var(--font-poppins)'
                }}
                primary={page.title}
              />
            </ListItem>
          ))}
        </List>
      </ListWrapper>
      <Box className="grow flex md:hidden">
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => setMenuOpen(!menuOpen)}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={ref.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' }
          }}
        >
          {pages.map((page, index) => (
            <MenuItem
              key={index}
              href={page.href}
              component={Link}
              onClick={() => setMenuOpen(false)}
            >
              <Typography textAlign="center">{page.title}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </div>
  );
}

export default HeaderMenu;
