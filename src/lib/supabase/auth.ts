
import { supabase, supabaseAdmin } from './client';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

/**
 * Get the current user session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { data: null, error };
  }
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return { isAdmin: !!data, error: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error };
  }
}

/**
 * Set up admin user using the admin client
 */
export const setupAdminUser = async () => {
  try {
    // First check if user exists
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: 'admin@shopstory.com',
      password: 'shopstory123'
    });
    
    if (userData.user) {
      console.log('Admin user already exists');
      
      // Ensure there's an entry in the admins table
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
        
      if (!adminData) {
        // Add user to admins table if not there
        await supabase
          .from('admins')
          .insert([{ user_id: userData.user.id }]);
        console.log('Added user to admins table');
      }
      
      return { success: true, message: 'Admin user already exists' };
    }
    
    // If login fails, try to create the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@shopstory.com',
      password: 'shopstory123',
      options: {
        data: { role: 'admin' }
      }
    });
    
    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      return { success: false, error: signUpError };
    }

    if (signUpData.user) {
      // Add user to admins table
      await supabase
        .from('admins')
        .insert([{ user_id: signUpData.user.id }]);
        
      console.log('Admin user created and added to admins table');
      return { success: true, message: 'Admin user created successfully' };
    }
    
    return { success: false, message: 'Failed to create admin user' };
  } catch (error) {
    console.error('Setup admin user error:', error);
    return { success: false, error };
  }
};
