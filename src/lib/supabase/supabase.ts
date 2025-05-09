import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
);
