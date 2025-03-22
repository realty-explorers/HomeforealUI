import { authenticateReferredUser, singinUser } from 'lib/auth/auth';
import { refreshAccessToken, updateRefreshToken } from 'lib/auth/tokens';
import { createUser, getUser, getUserByEmail } from 'lib/auth/user';
import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      id: 'referral',
      name: 'Referral Login',
      credentials: {
        token: { label: 'Token', type: 'text' },
        referral: { label: 'Referral', type: 'text' }
      },
      async authorize(credentials) {
        if (credentials.referral && credentials.token) {
          try {
            const { referral, token } = credentials;
            const user = await authenticateReferredUser(referral, token);

            if (user) {
              user.access_token = user.accessToken;
              user.id_token = user.idToken;
              user.refresh_token = user.refreshToken;
              user.id = user.userId;
              user.expires_at = user.expiresIn;
              return user;
            }
          } catch (error) {
            console.error('Token validation error:');
            throw new Error(
              error?.response?.data?.message || 'Token validation failed'
            );
          }
        }
        return null;
      }
    }),

    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const user = await singinUser(email, password);

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
          console.error('Authentication error:', error);
          throw new Error(
            error?.response?.data?.message || 'Authentication failed'
          );
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
          response_type: 'code',
          scope: 'openid email profile',
          identity_provider: 'Google'
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
          roles: token.roles,
          accessToken: token.accessToken,
          idToken: token.idToken,
          verified: token.verified,
          newUser: token.newUser
        },
        error: token.error
      };
    },

    async jwt({ token, user, account, session, trigger }) {
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
          userData = await createUser(
            user.id,
            user.email,
            user.source || 'realty-explorers',
            account.access_token || user.accessToken
          );
          // userData.newUser = true;
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
      if (trigger === 'update' && session?.user?.verified !== undefined) {
        token.verified = session.user.verified;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    }
  }
};

export default NextAuth(authOptions);
