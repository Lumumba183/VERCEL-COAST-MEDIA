import { createClient } from '@supabase/supabase-js';
import type { Database } from './database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side supabase instance
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side supabase instance (for API routes, server components)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
