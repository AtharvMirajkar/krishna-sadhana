import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from './lib/auth';

export const runtime = 'nodejs';

const protectedRoutes = ['/mantras', '/tracker'];
const authRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route);

  if (isProtectedRoute) {
    try {
      const user = await getCurrentUser();

      if (!user) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Redirect to login on error
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute) {
    try {
      const user = await getCurrentUser();

      if (user) {
        // Redirect to mantras if already authenticated
        return NextResponse.redirect(new URL('/mantras', request.url));
      }
    } catch (error) {
      // Continue to auth page if error (let client handle it)
      console.error('Auth check error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
