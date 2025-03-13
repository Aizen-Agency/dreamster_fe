import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPages = [
  '/auth/register',
  '/auth/login',
  '/auth/login/email',
  '/',
  '/landingpage',
  '/select-plan',
  '/checkout'
];

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const path = request.nextUrl.pathname;

  if (!isLoggedIn && !publicPages.includes(path)) {
    return NextResponse.redirect(new URL('/landingpage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 