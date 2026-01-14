/**
 * Supabase connection utility
 * Handles connection to Supabase using the Supabase client
 * Optimized for serverless functions on Vercel
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Please define the NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey && !supabaseServiceKey) {
  throw new Error('Please define either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Client for public operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabase;

// Default export for backward compatibility
export default supabase;
