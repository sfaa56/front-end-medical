import { NextRequest, NextResponse } from 'next/server'

import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/','/overview','/plans','/message','/projects','/agency','/Properties','/amenities']
const publicRoutes = [ '/sign-in']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;


  console.log('Path:', path);
  console.log('Session:', cookie);   
  console.log('Is Protected Route:', isProtectedRoute);
  console.log('Is Public Route:', isPublicRoute);
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL('sign-in', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    cookie 
  ) {
    return NextResponse.redirect(new URL('/overview', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.ico$).*)'],
}