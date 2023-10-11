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
    <div className="flex flex-col w-full h-full">
      <Head>
        <title>HomeFoReal App</title>
      </Head>

      <div className="flex h-[60px] w-full">
        <div className="flex justify-between w-full">
          <div className="flex px-6">
            <a href="#">
              <Logo />
            </a>
          </div>
          <div className="flex justify-between items-center px-6">
            <Button
              className={clsx([
                "bg-primary hover:bg-secondary text-white px-6 py-2 h-12 font-bold text-xl",
                styles.startButton,
              ])}
              href="/dashboards/real-estate"
            >
              Get Started
            </Button>
            {/* <div> */}
            {/*   <NavBarComponent /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="flex grow">
        <Hero />
      </div>
    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
