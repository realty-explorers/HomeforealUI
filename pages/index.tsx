import {
  Box,
  Button,
  Card,
  Container,
  styled,
  Typography,
} from "@mui/material";
import type { ReactElement } from "react";
import BaseLayout from "src/layouts/BaseLayout";
import Link from "src/components/Link";
import Head from "next/head";
import Logo from "src/components/LogoSign";
import Hero from "src/content/Overview/Hero";
import NavBarComponent from "@/content/Overview/Hero/Navbar/NavBarComponent";
import styles from "../src/content/Overview/Hero/LandingPage.module.scss";
import clsx from "clsx";

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`,
);

function Overview() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto relative">
      <Head>
        <title>HomeFoReal App</title>
      </Head>

      <div className="hidden lg:flex">
        <NavBarComponent />
      </div>
      {/* <div className="h-16" /> */}
      <Hero />
    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
