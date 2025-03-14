import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPages = [
  '/auth/register',
  '/auth/register/email',
  '/auth/login',
  '/auth/login/email',
  '/auth/register/success',
  '/landingpage',
];

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const path = request.nextUrl.pathname;

  // If user is not logged in and trying to access a protected page
  if (!isLoggedIn && !publicPages.includes(path)) {
    return NextResponse.redirect(new URL('/auth/login/email', request.url))
  }

  // If user is logged in and trying to access login/register pages
  if (isLoggedIn && (path.startsWith('/auth/login') || path === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 