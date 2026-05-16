import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req });

  const referer = req.headers.get('referer');
  const hostname = req.nextUrl.origin;

  // List of sensitive pages where we want to block direct URL entry
  const isSensitivePath = path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/checkoutpage');

  // If someone tries to enter the URL directly in the browser (no referer)
  // or comes from an external site (referer doesn't match our origin)
  if (isSensitivePath && (!referer || !referer.startsWith(hostname))) {
    // Show them the 404 page instead of the real content
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }

  const isAdminPath = path.startsWith('/admin');
  const isDashboardPath = path.startsWith('/dashboard');

  // 2. Auth & Role-based Redirect Logic
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }
  }

  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/checkoutpage/:path*',
  ],
};
