import { supabase } from './client';
import { Category, Subcategory, Product } from './types';
import { handleDatabaseError, getLocalData, saveLocalData } from './db-utils';
import { defaultCategories, defaultSubcategories } from './default-data';

// Re-export from db-setup module
export { createSQLFunctions, setupDatabase, initializeDatabase } from './db-setup';

// Re-export from category-operations module
export { getCategories, createCategory, updateCategory, deleteCategory } from './category-operations';

// Re-export from subcategory-operations module
export { getSubcategories, createSubcategory, updateSubcategory } from './subcategory-operations';

// Re-export from product-operations module
export { 
  getProducts, 
  getFeaturedProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from './product-operations';
