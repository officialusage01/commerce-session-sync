
// Re-export the Supabase client
export { supabase } from './client';

// Re-export auth methods
export { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser 
} from './auth';

// Re-export database methods
export {
  createProfilesTable,
  updateUserProfile,
  deleteUser,
  getUserRole,
  ensureTestAdminUser
} from './database';

// Re-export RLS utilities
export { checkRlsEnabled } from './database/setup-rls';

// Re-export admin methods
export { createAdminUser } from './admin';

// Initialize database and admin user
import { createProfilesTable } from './database';
import { createAdminUser } from './admin';
import { supabase } from './client';

// Create tables and setup
const initDatabase = async () => {
  try {
    // Try to create the profiles table
    await createProfilesTable();
    
    // Create stock_images table if it doesn't exist
    const { error: stockImagesError } = await supabase.rpc('create_stock_images_table');
    if (stockImagesError) {
      console.error('Failed to initialize stock_images table:', stockImagesError);
      
      // If RPC fails, try a direct SQL query as fallback
      const { error: sqlError } = await supabase.from('stock_images').select('id').limit(1);
      if (sqlError && sqlError.code !== '42P01') { // 42P01 means relation doesn't exist
        console.error('Failed to access stock_images table:', sqlError);
      }
    }
    
    // Update stock_images table if needed
    const { error: updateStockImagesError } = await supabase.rpc('update_stock_images_table');
    if (updateStockImagesError) {
      console.error('Failed to update stock_images table:', updateStockImagesError);
    }
  } catch (err) {
    console.error('Failed to initialize database tables:', err);
  }
};

// Initialize tables
initDatabase();

// Try to create admin user after initialization
setTimeout(() => {
  createAdminUser().catch(err => {
    console.error('Failed to create admin user:', err);
  });
}, 2000); // Wait for 2 seconds to ensure profiles table is created first
