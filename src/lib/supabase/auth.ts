
import { supabase } from './client';

// Custom email template options
const emailOptions = {
  emailRedirectTo: `${window.location.origin}/login`,
  data: {
    emailConfirmTemplate: {
      subject: 'Welcome to Our App! Please Verify Your Email',
      emailContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin-bottom: 10px;">Email Verification</h1>
            <p style="color: #4b5563; font-size: 16px;">Thank you for signing up!</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 15px;">Please verify your email address to continue:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="{{ .ConfirmationURL }}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">{{ .ConfirmationURL }}</p>
          </div>
          <div style="text-align: center; color: #9ca3af; font-size: 13px;">
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>© 2023 Our App. All rights reserved.</p>
          </div>
        </div>
      `
    }
  }
};

// Sign up function with custom email template
export const signUp = async (email: string, password: string) => {
  try {
    // Check if email already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email);
    
    if (existingUsers && existingUsers.length > 0) {
      return { error: { message: 'Email already in use' } };
    }
    
    // Sign up with custom email template
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: emailOptions
    });
    
    if (data?.user && !error) {
      // Create a profile record with default non-admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            role: 'non-admin', // Default role for new users
          }
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
    
    return { data, error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Error signing in:", error);
      return { error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error("Error in signIn:", err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

// Sign out function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      return { error };
    }
    
    return { error: null };
  } catch (err) {
    console.error("Error in signOut:", err);
    return { error: { message: 'An unexpected error occurred' } };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
