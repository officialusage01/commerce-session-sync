
// Re-export everything from database.ts
export * from './database';
export * from './types';
export { supabase } from './client';
export { signIn, signOut, getCurrentUser } from './auth';
