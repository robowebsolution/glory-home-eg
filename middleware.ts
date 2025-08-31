import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // Only run Supabase auth checks for admin routes
  if (!pathname.startsWith('/admin')) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request's cookies.
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Also update the response's cookies to delete it.
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Safe timeout guard around session fetching to avoid hanging
  async function getSessionSafe(timeoutMs = 1500) {
    try {
      const result = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('session-timeout')), timeoutMs)),
      ] as const);
      // @ts-expect-error result shape when from supabase
      return (result?.data?.session ?? null) as unknown | null;
    } catch (_) {
      return null;
    }
  }

  const session = (await getSessionSafe()) as any;

  // Check admin status safely
  async function isAdminSafe(userId: string | undefined, timeoutMs = 1500): Promise<boolean> {
    if (!userId) return false;
    try {
      const result = await Promise.race([
        supabase.from('admin_users').select('user_id').eq('user_id', userId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('admin-check-timeout')), timeoutMs)),
      ] as const);
      // @ts-expect-error result may be tuple from race
      return !!(result && !result.error && result.data);
    } catch (_) {
      return false;
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const admin = await isAdminSafe(session.user?.id);
    if (!admin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect logged-in users from login page to dashboard
  if (pathname === '/admin/login' && session) {
    const admin = await isAdminSafe(session.user?.id);
    if (admin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  // Run middleware only on admin routes to avoid unnecessary work on public pages
  matcher: ['/admin/:path*'],
}