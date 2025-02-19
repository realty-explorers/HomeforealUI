// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(req: NextRequestWithAuth) {
  if (!req.nextauth.token) {
    const url = req.nextUrl.clone();
    url.pathname = '/api/auth/signin/cognito';
    url.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ['/dashboards/real-estate']
};
