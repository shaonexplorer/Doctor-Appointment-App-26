import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/env';

/**
 * Rewrite cookie domain from localhost:4000 to localhost (without port)
 * so cookies are shared across all localhost ports (3000, 4000, etc.)
 */
function rewriteCookieDomain(setCookieHeader: string): string {
  return setCookieHeader
    .split(',')
    .map((cookie) => {
      // Replace Domain=localhost:4000 or Domain=localhost:3000 with Domain=localhost
      return cookie.replace(/Domain=localhost:\d+/gi, 'Domain=localhost');
    })
    .join(', ');
}

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { cookie: cookieHeader }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward any Set-Cookie headers from backend (e.g., session refresh) with rewritten domain
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', rewriteCookieDomain(setCookie));
    }

    return nextResponse;
  } catch (error) {
    console.error('Me proxy error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROXY_ERROR', message: 'Authentication service unavailable' } },
      { status: 503 }
    );
  }
}