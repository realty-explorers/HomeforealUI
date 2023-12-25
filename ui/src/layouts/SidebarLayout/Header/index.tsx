import { useContext } from "react";

import {
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  IconButton,
  lighten,
  Stack,
  styled,
  Tooltip,
  useTheme,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import { SidebarContext } from "src/contexts/SidebarContext";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";

import HeaderButtons from "./Buttons";
import HeaderUserbox from "./Userbox";
import HeaderMenu from "./Menu";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import Logo from "@/components/Logo";

const drawerWidth = 240;
// height: ${theme.header.height};
// color: ${theme.header.textColor};
// padding: ${theme.spacing(0, 2)};
// right: 0;
// z-index: 6;
// background-color: ${alpha(theme.header.background, 0.95)};
// backdrop-filter: blur(3px);
// position: fixed;
// justify-content: space-between;
// width: 100%;
// @media (min-width: ${theme.breakpoints.values.lg}px) {
//     left: ${theme.sidebar.width};
//     width: auto;
// }

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const Header = (props: HeaderProps) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();

  return (
    <div className="flex h-14 justify-between items-center shadow-[0px_1px_5px_0px_rgba(0,0,0,0.5)] bg-[rgba(255,255,255,0.95)] z-[1]">
      <HeaderMenu />
      <div className="flex md:hidden">
        <Logo />
      </div>

      <HeaderUserbox />
    </div>
  );
};

export default Header;
