import { createBrowserClient } from '@supabase/ssr';

/**
 * INFRASTRUCTURE — Supabase Browser Client
 * Use this in Client Components ('use client').
 * Creates a fresh client per call; @supabase/ssr handles cookie sync.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
