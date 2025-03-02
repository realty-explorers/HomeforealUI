import { refreshAccessToken, updateRefreshToken } from 'lib/auth/tokens';
import {
  authenticateProjoUser,
  createUser,
  getUser,
  getUserByEmail
} from 'lib/auth/user';
import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        token: { label: 'Token', type: 'text' },
        email: { label: 'Email', type: 'email' }
      },
      async authorize(credentials) {
        if (credentials.token) {
          try {
            // Validate token with your backend
            // const response = await fetch('', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ token: credentials.token })
            // });
            const user = await authenticateProjoUser(
              credentials.email,
              credentials.token
            );

            // const user = await response.json();

            if (user) {
              user.access_token = user.accessToken;
              user.id_token = user.idToken;
              user.refresh_token = user.refreshToken;
              user.id = user.userId;
              user.expires_at = user.expiresIn;
              user.email = credentials.email;
              return user;
            }
          } catch (error) {
            console.error('Token validation error:');
          }
        }
        return null;
      }
    }),
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
    newUser: '/auth/new-user',
    signIn: '/auth/signin'
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
        let userData;
        if (user.accessToken) {
          userData = await getUserByEmail(user.email, user.accessToken);
        } else {
          userData = await getUser(
            user.id,
            account.access_token || user.accessToken
          );
        }
        // userData.newUser = true;
        if (!userData) {
          console.log('User not found, creating user');
          console.log('user', user);
          userData = await createUser(
            user.id,
            user.email,
            account.access_token || user.accessToken
          );
          console.log('Created user:', userData);
          userData.newUser = true;
        }
        if (!userData) {
          throw new Error('Failed to create user');
        }
        console.log('trying to update refresh token');
        await updateRefreshToken(
          user.id,
          account.access_token || user.accessToken,
          account.refresh_token || user.refreshToken
        );

        return {
          ...token,
          ...userData,
          accessToken: account.access_token || user.accessToken,
          idToken: account.id_token || user.idToken,
          refreshToken: account.refresh_token || user.refreshToken,
          expiresAt: account.expires_at * 1000 || user.expiresIn * 1000
          // user
        };
      } else if (user && !account) {
        console.log('user', user);
        throw new Error('User not authenticated');
        // let userData = await getUser(user.id, user.accessToken);
        // if (!userData) {
        //   userData = await createUser(user.id, user.accessToken);
        //   console.log('Created user:', userData);
        //   userData.newUser = true;
        // }
        // if (!userData) {
        //   throw new Error('Failed to create user');
        // }
        // return {
        //   ...token,
        //   ...userData,
        //   user
        // };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    }
  }
};

export default NextAuth(authOptions);
