import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
      roles?: string[] | string;
      accessToken?: string;
      idToken?: string;
      verified?: boolean;
      newUser?: boolean;
      user?: {
        verified?: boolean;
      };
    };
    error?: string;
  }

  interface User {
    id?: string;
    roles?: string[] | string;
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    verified?: boolean;
    newUser?: boolean;
    referral?: string;
    expiresIn?: number;
    userId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles?: string[] | string;
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    verified?: boolean;
    newUser?: boolean;
    error?: string;
    accessTokenExpires?: number;
  }
}

export {};
