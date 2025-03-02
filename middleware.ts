import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

// First, handle the referral parameter without the withAuth wrapper
export function middleware(req: NextRequestWithAuth) {
  const url = req.nextUrl;

  // Check for referral parameter first, before any auth checks
  if (url.searchParams.get('referral') === 'projo') {
    console.log('Referral from projo detected, redirecting to handler');

    // Create auth handler URL with returnTo parameter
    const authUrl = new URL('/auth/referral-handler', req.url);

    // Store the original path (without the referral parameter)
    const returnUrl = new URL(url);
    returnUrl.searchParams.delete('referral');

    // Set the returnTo parameter to the cleaned original path
    authUrl.searchParams.set('returnTo', returnUrl.pathname + returnUrl.search);

    return NextResponse.redirect(authUrl);
  }

  // For non-referral requests, proceed with auth check
  // This will only run for protected routes defined in the matcher
  if (url.pathname.startsWith('/dashboards/real-estate')) {
    // Let withAuth handle this route
    return withAuth(req, 'cognito');
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
    '/dashboards/real-estate',
    // Add any other routes that might have the referral parameter
    '/((?!api|_next/static|_next/image|favicon.ico|auth/handler).*)'
  ]
};
