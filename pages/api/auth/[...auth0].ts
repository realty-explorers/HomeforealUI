import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";

console.log(process.env.AUTH0_SECRET);
// export default handleAuth();
export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE, // or AUTH0_AUDIENCE
      scope: process.env.AUTH0_SCOPE,
      // Add the `offline_access` scope to also get a Refresh Token
      // scope: "openid profile email read:products", // or AUTH0_SCOPE
    },
  }),
  async callback(req, res) {
    try {
      await handleCallback(req, res);
    } catch (error) {
      //TODO: create error page and redirect to logout from there
      console.log(error);
      res.redirect(
        `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?${new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID as string,
          returnTo: process.env.AUTH0_BASE_URL,
        })}`,
      )
        .end();
      // res.status(error.status || 500).end(error.message);
    }
  },
});
