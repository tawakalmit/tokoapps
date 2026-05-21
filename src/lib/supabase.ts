import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types/database';

export function createSupabaseClient(fetch?: typeof globalThis.fetch, cookies?: any) {
  if (isBrowser()) {
    return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  }

  return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookies?.getAll() ?? [];
      },
      setAll(cookiesToSet: any[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies?.set(name, value, { ...options, path: '/' });
        });
      }
    },
    global: { fetch }
  });
}
