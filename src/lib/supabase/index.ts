
// Re-export supabase-related functions and types for easier imports
export * from './supabase';
export * from './types';
export * from './product-operations';
export * from './category-operations/index';
export * from './subcategory-operations/index';

// Export auth functions
export * from './auth';

// Export database setup functions
export * from './db-setup';

// Override the ProductWithRelations re-export to fix ambiguity
export type { ProductWithRelations } from './types';
