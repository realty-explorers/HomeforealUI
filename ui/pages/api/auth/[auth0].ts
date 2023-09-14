import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

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
});
