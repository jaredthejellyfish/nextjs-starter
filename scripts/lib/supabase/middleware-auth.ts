import { type CookieOptions, createServerClient } from '@supabase/ssr';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
          } as RequestCookie);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          } as RequestCookie);
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          } as RequestCookie);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          } as RequestCookie);
        },
      },
    },
  );

  // refreshing the auth token
  await supabase.auth.getUser();

  return response;
}
