import { type NextRequest } from 'next/server'
import { adminGuard } from '@/lib/middleware/admin-guard'
import { authGuard } from '@/lib/middleware/auth-guard'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    return adminGuard(request)
  }

  // 2. Default Auth Guard for other routes
  return authGuard(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
