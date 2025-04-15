import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public pages that don't require authentication
const publicPages = [
  '/',
  '/auth/register',
  '/auth/register/email',
  '/auth/register/profile',
  '/auth/login',
  '/auth/login/email',
  '/auth/register/success',
  '/user/account/recovery',
  '/landingpage',
  '/music',
  '/music/share',
  '/music/share/player',
];

export function middleware(request: NextRequest) {
  // Add this line to confirm middleware is running
  console.log('🔒 MIDDLEWARE RUNNING FOR PATH:', request.nextUrl.pathname);

  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const role = request.cookies.get('role')?.value
  const path = request.nextUrl.pathname;

  // Check if the current path is a public page (using startsWith for nested routes)
  const isPublicPage = publicPages.some(page =>
    path === page || path.startsWith(page + '/')
  );

  console.log('Path:', path, 'Public:', isPublicPage, 'LoggedIn:', isLoggedIn);

  // If user is not logged in and trying to access a protected page
  if (!isLoggedIn && !isPublicPage) {
    console.log('🔒 REDIRECTING TO LOGIN:', path);
    return NextResponse.redirect(new URL('/auth/login/email', request.url));
  }

  // If user is logged in and trying to access login/register pages
  if (isLoggedIn && (path.startsWith('/auth/login') || path.startsWith('/auth/register'))) {
    if (role === 'musician') {
      return NextResponse.redirect(new URL('/dashboard/musician', request.url));
    } else if (role === 'fan') {
      return NextResponse.redirect(new URL('/collection', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  // Role-based access control
  if (isLoggedIn && role) {
    // Musician-only routes
    if ((path.startsWith('/dashboard/musician') || path.startsWith('/user/musician')) &&
      role !== 'musician') {
      return NextResponse.redirect(new URL(role === 'fan' ? '/collection' : '/dashboard/admin', request.url));
    }

    // Admin-only routes
    if (path.startsWith('/dashboard/admin') && role !== 'admin') {
      // Allow admin to access musician profiles
      if (path.startsWith('/dashboard/admin/musician/')) {
        return NextResponse.redirect(new URL(role === 'musician' ? '/dashboard/musician' : '/collection', request.url));
      }
    }

    // Fan-only routes (if any)
    if (path.startsWith('/user/fan') && role !== 'fan') {
      return NextResponse.redirect(new URL(role === 'musician' ? '/dashboard/musician' : '/dashboard/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/user/:path*',
    '/dashboard/:path*',
    '/collection/:path*'
  ],
}; 