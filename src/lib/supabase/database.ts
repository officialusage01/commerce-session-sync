
import { supabase } from './client';
import { Category, Subcategory, Product } from './types';
import { handleDatabaseError, getLocalData, saveLocalData } from './db-utils';
import { defaultCategories, defaultSubcategories } from './default-data';

// Re-export from db-setup module
export { createSQLFunctions, setupDatabase, initializeDatabase } from './db-setup';

// Re-export from category-operations module
export { getCategories } from './category-operations/index';

// Re-export from subcategory-operations module
export { getSubcategories } from './subcategory-operations/index';

// Re-export from product-operations module
export { 
  getProducts, 
  getFeaturedProducts, 
  getProduct, 
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct,
  type ProductWithRelations
} from './product-operations';

// Re-export from orders module
export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from './orders';
