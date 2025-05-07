
// Re-export everything from the modules
export { supabase, convertFileToBase64 } from './client';
export type { Category, Subcategory, Product } from './types';
export { signIn, signOut, getCurrentUser, setupAdminUser } from './auth';
export { 
  getCategories, 
  getSubcategories, 
  getProducts,
  getFeaturedProducts,
  getProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  createSQLFunctions,
  setupDatabase,
  initializeDatabase
} from './database';
export { initializeDemoData } from './demo-data';
export { uploadImage } from './upload';

// Initialize database when importing this module
import { createSQLFunctions, setupDatabase, initializeDatabase } from './database';
import { initializeDemoData } from './demo-data';

// Check if we've already attempted initialization
const INIT_FLAG = 'shopstory_db_initialized';

// Run the setup and initialization with better sequencing
console.log('Starting database initialization');

const initDatabase = async () => {
  try {
    // Check if we've already run initialization this session
    if (sessionStorage.getItem(INIT_FLAG)) {
      console.log('Database initialization already attempted this session');
      return;
    }
    
    // Mark as initialized to prevent multiple attempts
    sessionStorage.setItem(INIT_FLAG, 'true');
    
    const sqlFunctionsCreated = await createSQLFunctions();
    
    if (sqlFunctionsCreated) {
      console.log('SQL functions created successfully, setting up database');
      await setupDatabase();
      
      // Give more time for tables to be created before inserting demo data
      setTimeout(async () => {
        try {
          await initializeDemoData();
          console.log('Demo data initialization attempted');
        } catch (error) {
          console.error('Error initializing demo data:', error);
        }
      }, 2000);
    } else {
      console.warn('Failed to create SQL functions, trying manual table creation');
      setTimeout(async () => {
        try {
          const tablesCreated = await initializeDatabase();
          
          if (tablesCreated) {
            console.log('Tables created manually, initializing demo data');
            setTimeout(async () => {
              try {
                await initializeDemoData();
                console.log('Demo data initialization attempted');
              } catch (error) {
                console.error('Error initializing demo data:', error);
              }
            }, 2000);
          } else {
            console.warn('Failed to create tables manually, falling back to local storage');
            // We'll continue using localStorage fallback in the data access methods
          }
        } catch (error) {
          console.error('Error during manual table creation:', error);
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Start the initialization process
initDatabase();

export const initializeSupabase = async () => {
  try {
    // Create SQL functions
    const functionsCreated = await createSQLFunctions();
    if (!functionsCreated) {
      throw new Error('Failed to create SQL functions');
    }

    // Initialize database
    const tablesCreated = await initializeDatabase();
    if (!tablesCreated) {
      throw new Error('Failed to initialize database');
    }

    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return false;
  }
};
