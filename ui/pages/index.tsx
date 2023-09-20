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
        <title>Homforeal App</title>
      </Head>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
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
        </Container>
      </HeaderWrapper>
      <Hero />
      {/* <Container maxWidth="lg" sx={{ mt: 8 }}> */}
      {/*   <Typography textAlign="center" variant="subtitle1"> */}
      {/*     Crafted by{" "} */}
      {/*     <Link href="#" target="_blank" rel="noopener noreferrer"> */}
      {/*       Sharon Fabin */}
      {/*     </Link> */}
      {/*   </Typography> */}
      {/* </Container> */}
    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
