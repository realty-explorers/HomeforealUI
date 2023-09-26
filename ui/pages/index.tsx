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
import styles from '../src/content/Overview/Hero/LandingPage.module.scss'

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`,
);

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
    <div className="w-full">
      <Head>
        <title>HomeFoReal App</title>
      </Head>

      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent='space-between' >
            <Box>
              <Logo />
            </Box>
            <Box display='flex' alignItems='center' width="57%" justifyContent='space-between' >
              <Box>
                <NavBarComponent />
              </Box>
              <Box display='flex' alignItems='center'>
                <Box display='flex' alignItems='center' mt={1.5} >
                  <a href="#" className={`text-base mr-3 ${styles.navFont}`}>
                    <b>Sign Up</b>
                  </a>
                </Box>
                <Box>
                  <Button
                    component={Link}
                    href="/dashboards/real-estate"
                    className="bg-[#590D82] text-white text-2xl font-poppins p-4 w-56 hover:bg-[#9747FF]"
                  >
                    Get Started
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Hero />

    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
