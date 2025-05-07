import { supabase, supabaseAdmin } from './client';

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

// Set up admin user
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
