import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://ufvtilwrfixuirhmzdhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnRpbHdyZml4dWlyaG16ZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjA5NjYsImV4cCI6MjA2MDEzNjk2Nn0.Xry-Wl4qqEhR4NM4bJ0vVZDERdjYoqSO9dYo19cnns4';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnRpbHdyZml4dWlyaG16ZGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU2MDk2NiwiZXhwIjoyMDYwMTM2OTY2fQ.Xry-Wl4qqEhR4NM4bJ0vVZDERdjYoqSO9dYo19cnns4';

// Create Supabase clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Convert a File object to a base64 string
 * @param file The file to convert
 * @returns A promise that resolves to the base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
