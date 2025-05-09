
// Re-export supabase-related types for easier imports
export * from './types';
export * from './client';
export * from './product-operations';
export * from './category-operations/index';
export * from './subcategory-operations/index';

// We're not exporting from './supabase' directly anymore to avoid ambiguity
// Instead, let's explicitly import and re-export what we need from it
import { createSQLFunctions, setupDatabase, initializeDatabase } from './db-setup';
export { createSQLFunctions, setupDatabase, initializeDatabase };

// Export auth functions
export * from './auth';

// Export database setup functions
export * from './db-setup';

// Override the ProductWithRelations re-export to fix ambiguity
export type { ProductWithRelations } from './product-operations/types';
