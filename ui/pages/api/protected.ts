import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function myApiRoute(req, res) {
  const { accessToken } = await getAccessToken(req, res);
  res.json({ accessToken });
  // res.json({ protected: "My Secret", id: accessToken });
});
