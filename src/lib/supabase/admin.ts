
import { signUp } from './auth';
import { supabase } from './client';

// Create admin user
export const createAdminUser = async () => {
  try {
    console.log("Creating admin user...");
    // Check if admin exists first
    const { data: existingAdmin, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'testad1@mailinator.com')
      .single();
    
    if (!checkError && existingAdmin) {
      console.log("Admin user already exists");
      
      // Ensure role is set to admin, even if it exists
      if (existingAdmin.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingAdmin.id);
        
        if (updateError) {
          console.error("Error updating existing user to admin role:", updateError);
        } else {
          console.log("Updated existing user to admin role");
        }
      }
      
      return;
    }
    
    // Admin doesn't exist, try to create it
    const { data, error } = await signUp('testad1@mailinator.com', 'Admin123$');
    
    if (error) {
      console.error("Error creating admin user:", error);
      return;
    }
    
    if (data?.user) {
      console.log("Admin user created with ID:", data.user.id);
      
      // Update role to admin in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
      
      if (updateError) {
        console.error("Error updating admin role:", updateError);
      } else {
        console.log("Admin role assigned successfully");
      }
    }
  } catch (err) {
    console.error("Error in createAdminUser:", err);
  }
};
