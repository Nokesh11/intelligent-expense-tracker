import { createClient } from '@supabase/supabase-js';

// These are safe to be public — they are the "anon" (unauthenticated) keys
// Access is controlled by Row Level Security (RLS) policies in Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please copy .env.example to .env and fill in your credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist auth session using Expo SecureStore (more secure than AsyncStorage)
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type SupabaseClient = typeof supabase;
