
// Re-export supabase-related functions and types for easier imports
export * from './supabase';
export * from './types';
export * from './product-operations';
export * from './category-operations/index';
export * from './subcategory-operations/index';

// Re-export specific functions from auth modules to avoid ambiguity
export { signIn, signUp, getSession, isAdmin } from './auth-operations';
export { setupAdminUser } from './auth';

// Re-export user operations
export { getCurrentUser } from './user-operations';

// Export database setup functions
export * from './db-setup';

// Override the ProductWithRelations re-export to fix ambiguity
export type { ProductWithRelations } from './types';
