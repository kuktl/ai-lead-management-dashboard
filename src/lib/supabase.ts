import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Keep the Functions client synchronized with the current Supabase access token.
// This is important for Edge Functions that perform their own user validation.
if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    supabase.functions.setAuth(data.session?.access_token ?? '');
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    supabase.functions.setAuth(session?.access_token ?? '');
  });
}
