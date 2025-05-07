
import { supabase } from '../client';
import { createProfilesTable } from './tables';

// Add a more robust function to force testad1@mailinator.com as admin
export const ensureTestAdminUser = async () => {
  try {
    console.log("Ensuring testad1@mailinator.com has admin role...");
    
    // Skip admin API call which will always fail in the browser
    // Instead, directly check the profiles table
    try {
      // Check if profiles table exists
      const { data: profiles, error: tableError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'testad1@mailinator.com')
        .maybeSingle();
      
      if (tableError) {
        console.log("Profiles table doesn't exist or can't be accessed, trying to create it first");
        await createProfilesTable();
      }
      
      if (profiles) {
        console.log("Found test admin user:", profiles.id);
        
        // Update the user in profiles table if role is not admin
        if (profiles.role !== 'admin') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', profiles.id);
          
          if (updateError) {
            console.error("Error updating to admin role:", updateError);
          } else {
            console.log("Successfully set testad1@mailinator.com as admin");
          }
        } else {
          console.log("User already has admin role");
        }
      } else {
        console.log("Test admin user not found in profiles, will be created on next login");
      }
    } catch (err) {
      console.error("Error accessing profiles table:", err);
    }
  } catch (error) {
    console.error('Error in ensureTestAdminUser:', error);
  }
};

// Call this function when the app starts
setTimeout(() => {
  ensureTestAdminUser().catch(err => {
    console.error('Failed to set testad1@mailinator.com as admin:', err);
  });
}, 3000);
