import { NextResponse, type NextRequest } from 'next/server';
import { authGuard } from './auth-guard';

/**
 * Guard for admin routes.
 * Verifies the secret admin cookie and protects the /admin path.
 * 
 * Logic:
 * 1. Checks for 'admin_session' cookie.
 * 2. Compares it with ADMIN_ACCESS_KEY environment variable.
 * 3. If invalid, redirects to homepage.
 * 4. If valid, proceeds to authGuard to ensure session freshness.
 * 
 * @param request - The incoming request
 * @returns The response (Redirect or Next)
 */
export async function adminGuard(request: NextRequest): Promise<NextResponse> {
  const adminCookie = request.cookies.get('admin_session')?.value;
  const adminKey = process.env.ADMIN_ACCESS_KEY;

  // Verify if cookie matches key
  if (!adminCookie || adminCookie !== adminKey) {
     return NextResponse.redirect(new URL('/', request.url));
  }
  
  // URL Rewrite Logic (Placeholder for future requirements)
  // Currently, we just protect the route. 
  // If we needed to rewrite, we would do it here.
  
  // Proceed to Auth Guard to maintain Supabase session
  return authGuard(request);
}
