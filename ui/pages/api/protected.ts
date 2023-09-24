import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(
  async function myApiRoute(req, res) {
    try {
      const { accessToken } = await getAccessToken(req, res);

      res.json({ accessToken });
    } catch (e) {
      res.json({
        error: e.code,
      });
    }
    // res.json({ protected: "My Secret", id: accessToken });
  },
);
