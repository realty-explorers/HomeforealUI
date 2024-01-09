import { useContext, useState } from "react";

import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  useTheme,
} from "@mui/material";
import { SidebarContext } from "src/contexts/SidebarContext";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SvgIcon from "@mui/material/SvgIcon";

const HomeIcon = (props) => {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17.99V14.99"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

const ProfileIcon = () => {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1605 10.87C12.0605 10.86 11.9405 10.86 11.8305 10.87C9.45055 10.79 7.56055 8.84 7.56055 6.44C7.56055 3.99 9.54055 2 12.0005 2C14.4505 2 16.4405 3.99 16.4405 6.44C16.4305 8.84 14.5405 10.79 12.1605 10.87Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.1607 14.56C4.7407 16.18 4.7407 18.82 7.1607 20.43C9.9107 22.27 14.4207 22.27 17.1707 20.43C19.5907 18.81 19.5907 16.17 17.1707 14.56C14.4307 12.73 9.9207 12.73 7.1607 14.56Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

type BottomNavigationProps = {};
const BottomNavigation = (props: BottomNavigationProps) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();
  const pathname = usePathname();

  const getValue = () => {
    switch (pathname) {
      case "/":
        return 0;
      case "/dashboards/real-estate":
        return 1;
      case "/dashboards/buybox":
        return 2;
      case "/management/profile":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="flex md:hidden bottom-0 w-full z-[1]">
      <MuiBottomNavigation
        showLabels
        className="w-full bg-[rgba(255,255,255,0.95)] shadow-[0px_0px_5px_rgba(0,0,0,0.5)]"
        value={getValue()}
        // value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          href="/"
          className="font-poppins font-bold"
        />
        <BottomNavigationAction
          label="Search"
          icon={<SearchIcon />}
          href="/dashboards/real-estate"
          className="font-poppins font-bold"
        />
        <BottomNavigationAction
          label="BuyBox"
          icon={<Inventory2RoundedIcon />}
          href="/dashboards/buybox"
          className="font-poppins font-bold"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<ProfileIcon />}
          href="/management/profile"
          className="font-poppins font-bold"
        />
      </MuiBottomNavigation>
    </div>
  );
};

export default BottomNavigation;
