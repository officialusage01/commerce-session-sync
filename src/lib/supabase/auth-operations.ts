
import { supabase, supabaseAdmin } from './client';

/**
 * Signs in a user with email and password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Signs out the current user
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

/**
 * Sets up an admin user (for demo purposes)
 */
export const setupAdminUser = async () => {
  try {
    // First check if user exists using admin client
    const { data: existingUser } = await supabaseAdmin.auth.signInWithPassword({
      email: 'admin@shopstory.com',
      password: 'shopstory123'
    });
    
    if (existingUser.user) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user using admin client
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
      email: 'admin@shopstory.com',
      password: 'shopstory123',
      options: {
        data: { role: 'admin' }
      }
    });
    
    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      return;
    }

    if (signUpData.user) {
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Setup admin user error:', error);
  }
};

/**
 * Initialize database with tables and demo data
 */
export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    console.log('Initializing database...');
    
    // The actual implementation would typically call database setup functions
    // This is a placeholder function that would be implemented in db-setup.ts
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};
