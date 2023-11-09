import { useContext } from "react";

import {
  alpha,
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

const drawerWidth = 240;
const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`,
);
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
    <HeaderWrapper
      display="flex"
      alignItems="center"
      className="flex h-14"
      sx={{
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.5)",
        zIndex: 1,
      }}
    >
      <HeaderMenu />
      <div className="flex items-center">
        <HeaderButtons />
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: "none", xs: "inline-block" },
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle
                ? <MenuTwoToneIcon fontSize="small" />
                : <CloseTwoToneIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
