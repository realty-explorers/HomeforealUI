import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { useRef, useState } from "react";
// import Link from "src/components/Link";
import Link from "next/link";

import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(["color", "fill"])};
            
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
`,
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <List disablePadding component={Box} display="flex">
          <Logo />
          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            className={clsx([
              pathname === "/dashboards/real-estate" && "active",
            ])}
            component={Link}
            button
            href="/dashboards/real-estate"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Search"
            />
          </ListItem>
          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            className={clsx([pathname === "/dashboards/buybox" && "active"])}
            component={Link}
            button
            href="/dashboards/buybox"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="BuyBox"
            />
          </ListItem>
        </List>
      </ListWrapper>
      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={Link} href="/">
          Overview
        </MenuItem>
      </Menu>
    </>
  );
}

export default HeaderMenu;
