
// Re-export supabase-related functions and types for easier imports
export * from './supabase';
export * from './types';
export * from './product-operations';
export * from './category-operations/index';
export * from './subcategory-operations/index';
export * from './auth-operations';
export * from './user-operations';
export * from './db-setup';
export * from './auth';

// Override the ProductWithRelations re-export to fix ambiguity
export { ProductWithRelations } from './types';
