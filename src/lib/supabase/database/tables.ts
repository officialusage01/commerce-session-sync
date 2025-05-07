
import { supabase } from '../client';
import { toast } from 'sonner';

// Create profiles table in Supabase using simple insert approach
export const createProfilesTable = async () => {
  try {
    console.log("Attempting to create profiles table or verify it exists...");
    
    // First try to execute a simple query to check if table exists
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log("Profiles table exists, found data:", data);
      return true; // Table exists, no need to create it
    }
    
    console.log("Profiles table doesn't exist or error occurred:", error);
    
    // Since we can't create tables directly from the client, let's try a different approach
    // Execute raw SQL to create the table
    const { error: sqlError } = await supabase.rpc('create_profiles_table');
    
    if (!sqlError) {
      console.log("Created profiles table with SQL function");
      return true;
    } else {
      console.error("Error creating profiles table with RPC:", sqlError);
      
      // Fallback to insert approach
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'testad1@mailinator.com',
            role: 'admin'
          }
        ]);
      
      if (!insertError) {
        console.log("Created profiles table with admin user");
        return true;
      } else {
        console.error("Error creating profiles table:", insertError);
        
        // If this method fails, user will need to manually create the profiles table in Supabase
        console.log("Please create the profiles table manually in Supabase with:");
        console.log(`
          id: uuid references auth.users primary key,
          email: text not null,
          role: text not null default 'non-admin',
          created_at: timestamptz default now(),
          updated_at: timestamptz default now()
        `);
        return false;
      }
    }
  } catch (err) {
    console.error('Error in createProfilesTable function:', err);
    return false;
  }
};
