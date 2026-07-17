import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables from Vite (client-side) or process.env (server-side/fallback)
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '') as string;
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '') as string;

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not fully configured. ' +
    'Initializing Supabase client with safe fallback placeholders to prevent application startup crashes.'
  );
}

// Initialize Supabase Client with fallback values to avoid throwing on empty strings
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key'
);

/**
 * Returns the Supabase client if fully configured, or throws a descriptive error.
 */
export function getSupabase() {
  if (!isConfigured) {
    throw new Error(
      'Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }
  return supabase;
}
