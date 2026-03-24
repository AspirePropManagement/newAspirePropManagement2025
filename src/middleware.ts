import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface AuthUser {
  id: string
  role: string
  email: string
}

function getAuthUser(req: NextRequest): AuthUser | null {
  const cookie = req.cookies.get('auth-user')?.value
  if (!cookie) return null
  try {
    return JSON.parse(decodeURIComponent(cookie))
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const authUser = getAuthUser(req)
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/demo']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If no session and trying to access protected route, redirect to auth
  if (!authUser && !isPublicRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access auth page, redirect to role dashboard
  if (authUser && pathname.startsWith('/auth')) {
    let redirectPath = '/dashboard'

    switch (authUser.role) {
      case 'ADMIN':
        redirectPath = '/admin'
        break
      case 'AGENT':
        redirectPath = '/agent'
        break
      case 'BUYER':
        redirectPath = '/buyer'
        break
      case 'BUILDER':
        redirectPath = '/builder'
        break
      case 'OWNER':
        redirectPath = '/owner'
        break
    }

    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = redirectPath
    return NextResponse.redirect(redirectUrl)
  }

  // For authenticated users, check role-based access
  if (authUser) {
    const role = authUser.role

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    if (pathname.startsWith('/agent') && !['ADMIN', 'AGENT'].includes(role)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    if (pathname.startsWith('/buyer') && !['ADMIN', 'AGENT', 'BUYER'].includes(role)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    if (pathname.startsWith('/builder') && !['ADMIN', 'AGENT', 'BUILDER'].includes(role)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    if (pathname.startsWith('/owner') && !['ADMIN', 'AGENT', 'OWNER'].includes(role)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
