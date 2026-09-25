import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { cookie: cookieHeader }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward cookies from backend
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROXY_ERROR', message: 'Authentication service unavailable' } },
      { status: 503 }
    );
  }
}