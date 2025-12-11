import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Admin Route Protection & Rewriting
  if (pathname.startsWith('/admin')) {
    const adminPath = process.env.ADMIN_ACCESS_PATH;
    
    // If admin path is not configured, block all admin access
    if (!adminPath) {
       console.error('ADMIN_ACCESS_PATH is not set in environment variables.');
       return new NextResponse(null, { status: 404 });
    }

    const expectedPrefix = `/admin/${adminPath}`;
    
    // Check if the request matches the secure admin path
    if (pathname === expectedPrefix || pathname.startsWith(`${expectedPrefix}/`)) {
        // Rewrite the URL to the internal admin path
        // e.g. /admin/SECRET/dashboard -> /admin/dashboard
        const internalPath = pathname.replace(expectedPrefix, '/admin') || '/admin';
        
        const url = request.nextUrl.clone();
        url.pathname = internalPath;
        
        const response = NextResponse.rewrite(url);
        
        // Pass the secret path to the layout via header
        response.headers.set('x-admin-path', adminPath);
        
        // Set a session cookie for Server Actions to verify access
        response.cookies.set('admin_access', adminPath, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        
        return response;
    } else {
        // Invalid Admin Path - Block access and show 404
        // This hides the existence of the admin panel
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        return NextResponse.rewrite(url, { status: 404 });
    }
  }

  // 2. Existing Supabase Auth for non-admin routes (Session Refresh)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
