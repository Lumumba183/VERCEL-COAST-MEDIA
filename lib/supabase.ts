import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/** Browser/anon client — safe for client components and public reads. */
export function getAnonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server admin client — uses the service role key (bypasses RLS).
 * Falls back to the anon key when the service key is not configured,
 * in which case RLS policies govern access.
 * NEVER import this in a client component.
 */
export function getServiceClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
