import { createClient } from '@supabase/supabase-js';

// Environment variables must be prefixed with VITE_ for Vite to expose them in the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials have been supplied (either locally or in Vercel)
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    '%c[PharmNexia]%c Supabase credentials not found in environment. Using robust in-memory mock store. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to link your database.',
    'color: #00A86B; font-weight: bold;',
    'color: inherit;'
  );
}

// Export the initialized Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export default supabase;
