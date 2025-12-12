import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { adminGuard } from '@/lib/middleware/admin-guard'
import { routing } from '@/src/navigation'

const intlMiddleware = createMiddleware(routing)

interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    return adminGuard(request)
  }

  // 2. Geo-based Locale Detection
  const country = (request as NextRequestWithGeo).geo?.country || request.headers.get('x-vercel-ip-country')
  const preferredLocale = country === 'CN' ? 'zh' : 'en'
  
  // Override accept-language to force detection
  const headers = new Headers(request.headers)
  headers.set('accept-language', preferredLocale)
  
  const newRequest = new NextRequest(request.url, {
    headers,
    // Preserve other request properties if needed, but NextRequest ctor handles most
  })

  // 3. Internationalization Middleware
  return intlMiddleware(newRequest)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
