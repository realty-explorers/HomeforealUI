"use client";

import { FC, ReactNode, useState } from "react";
import { alpha, Box, lighten, styled, useTheme } from "@mui/material";
import PropTypes from "prop-types";

import Sidebar from "./Sidebar";
import Header from "./Header";

const drawerWidth = 240;

const MainWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<any>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  // paddingLeft: `calc(${theme.spacing(7)} + 1px)`,
  transition: theme.transitions.create(["width", "padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open &&
    {
      // marginLeft: drawerWidth,
      // width: `calc(100% - ${drawerWidth}px)`,
      // paddingLeft: drawerWidth
    }),
}));

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* <Sidebar open={open} setOpen={setOpen} /> */}
      <Header open={open} setOpen={setOpen} />
      <main className="flex flex-grow w-full">
        {children}
      </main>
    </div>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node,
};

export default SidebarLayout;
