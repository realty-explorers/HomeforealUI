import { createUser, getUser } from 'lib/auth/user';
import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_ATdpsnUA7',
      checks: ['nonce'],
      authorization: {
        params: {
          scope: 'openid email profile' // Recommended scopes
        }
      }
    })
    // ...add more providers here
  ],

  pages: {
    newUser: '/auth/new-user'
    // signIn: '/auth/signin'
    // error: "/auth/error",
  },
  callbacks: {
    // async jwt({ token, user, account }) {
    //   console.log("jwt", token);
    //   console.log("user", user);
    //   console.log("account", account);
    //   if (account) {
    //     token.accessToken = account.access_token;
    //     token.idToken = account.id_token;
    //     token.refreshToken = account.refresh_token;
    //   }
    //   return { ...token, ...user };
    // },
    // async session({ session, token, user }) {
    //   console.log("session", session);
    //   console.log("token", token);
    //   session.user = token as any;
    //   return session;
    // },
    async session({ token, session, account }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          accessToken: token.accessToken,
          idToken: token.idToken,
          verified: token.verified,
          newUser: token.newUser
        },
        error: token.error
      };
    },

    async jwt({ token, user, account }) {
      console.log('**** jwt ****');
      if (account && user) {
        let userData = await getUser(user.id, account.access_token);
        // userData.newUser = true;
        if (!userData) {
          userData = await createUser(user.id, account.access_token);
          console.log('Created user:', userData);
          userData.newUser = true;
        }
        if (!userData) {
          throw new Error('Failed to create user');
        }
        return {
          ...token,
          ...userData,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000,
          user
        };
      }

      // Subsequent requests - return existing tokens
      return token;
    }
  }
};

export default NextAuth(authOptions);
