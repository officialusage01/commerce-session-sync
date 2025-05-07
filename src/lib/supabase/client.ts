
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://kfdmmtsahqikhhlwutcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZG1tdHNhaHFpa2hobHd1dGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDI1NTQsImV4cCI6MjA1ODM3ODU1NH0.asQvhdZ7uG8V358HYJva30UcE1HztD95wTXPb2APTmE';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Log client initialization for debugging
console.log("Supabase client initialized with URL:", supabaseUrl);
