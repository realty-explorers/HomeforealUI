import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

// First, handle the referral parameter without the withAuth wrapper
export async function middleware(req: NextRequestWithAuth) {
  const url = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (token) {
    return NextResponse.next();
  }

  const referral = url.searchParams.get('referral');
  if (referral) {
    console.log('Referral detected:', referral);
    const token = url.searchParams.get('token');
    const authUrl = new URL(
      `/auth/referral-handler?referral=${referral}&token=${token}`,
      req.url
    );
    const returnUrl = new URL(url);
    returnUrl.searchParams.delete('referral');
    authUrl.searchParams.set('returnTo', returnUrl.pathname + returnUrl.search);
    return NextResponse.redirect(authUrl);
  }

  // For non-referral requests, proceed with auth check
  // This will only run for protected routes defined in the matcher
  if (url.pathname.startsWith('/dashboards/real-estate')) {
    // Let withAuth handle this route
    return withAuth(req);
  }

  // For all other routes, just proceed normally
  return NextResponse.next();
}

// Separate withAuth middleware for protected routes
const withAuthMiddleware = withAuth(
  function onAuth(req: NextRequestWithAuth) {
    console.log('Checking for token');
    if (!req.nextauth.token) {
      console.log('No token found, redirecting to sign in');
      const url = req.nextUrl.clone();
      url.pathname = '/api/auth/signin/cognito';
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

// Update matcher to include all routes that might have the referral parameter
export const config = {
  matcher: [
    // Protected routes
    '/dashboards/:path*',
    // '/auth/:path*',
    '/managements/:path*',
    // Add any other routes that might have the referral parameter
    '/((?!api|_next/static|_next/image|favicon.ico|).*)'
  ]
};
