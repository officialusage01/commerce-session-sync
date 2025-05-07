
import { supabase } from '../client';
import { createProfilesTable } from './tables';

// Function to get user role
export const getUserRole = async (userId: string) => {
  if (!userId) {
    console.error('getUserRole called with empty userId');
    return 'non-admin';
  }
  
  try {
    console.log(`Getting role for user: ${userId}`);
    // Check if the user has a profile
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log('Error fetching user role or user profile not found:', error);
      
      // If user doesn't have a profile, create one
      try {
        // Get user data to create a profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Create profile for the user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              email: userData.user.email || '',
              role: 'non-admin' // Default role
            }]);
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            console.log('Created new profile for user');
          }
          
          // Check if this is our test admin user and set role accordingly
          if (userData.user.email === 'testad1@mailinator.com') {
            console.log('Setting testad1@mailinator.com as admin');
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', userId);
            
            if (updateError) {
              console.error('Error updating to admin role:', updateError);
              return 'admin'; // Force admin role for this email
            } else {
              console.log('Updated to admin role successfully');
              return 'admin';
            }
          }
          
          // Return default role
          return 'non-admin';
        }
      } catch (err) {
        console.error('Error creating profile for user:', err);
      }
      
      // If this is our test admin user, force admin role
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email === 'testad1@mailinator.com') {
        return 'admin';
      }
      
      // If something goes wrong, return a default role
      return 'non-admin';
    }
    
    // If this is our test admin user, force admin role
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === 'testad1@mailinator.com') {
      if (data?.role !== 'admin') {
        // Update to admin if not already
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId);
      }
      return 'admin';
    }
    
    console.log(`User role found: ${data?.role || 'non-admin'}`);
    // If everything is successful, return the actual role
    return data?.role || 'non-admin';
  } catch (error) {
    console.error('Unexpected error in getUserRole:', error);
    
    // Always check for our test admin user
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === 'testad1@mailinator.com') {
      return 'admin';
    }
    
    // Always return a default role to prevent loading states
    return 'non-admin';
  }
};
