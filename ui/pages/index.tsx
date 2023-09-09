import { Box, Card, Container, styled, Typography } from "@mui/material";
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

      <Hero />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="subtitle1">
          Crafted by{" "}
          <Link href="#" target="_blank" rel="noopener noreferrer">
            Sharon Fabin
          </Link>
        </Typography>
      </Container>
    </div>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
