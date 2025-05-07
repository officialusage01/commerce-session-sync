import { toast } from 'sonner';
import { supabase } from '../client';

// Function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<{
  email: string;
  role: string;
}>) => {
  try {
    console.log(`Updating profile for user: ${userId}`, updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + error.message);
      throw error;
    }
    
    console.log('Profile updated successfully', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// Function to delete a user and all associated data
export const deleteUser = async (userId: string) => {
  try {
    console.log(`Deleting user: ${userId}`);
    
    // First delete any related data (posts, comments, etc.)
    try {
      // Delete user posts if they exist
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', userId);
      
      if (postsError && postsError.code !== '42P01') { // Ignore "relation does not exist" errors
        console.error('Error deleting user posts:', postsError);
        toast.warning('Some user content may not have been deleted completely.');
      } else {
        console.log('User posts deleted successfully or table does not exist');
      }
      
      // Delete user comments if they exist
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('user_id', userId);
      
      if (commentsError && commentsError.code !== '42P01') { // Ignore "relation does not exist" errors
        console.error('Error deleting user comments:', commentsError);
        toast.warning('Some user content may not have been deleted completely.');
      } else {
        console.log('User comments deleted successfully or table does not exist');
      }
      
      // Add more related tables here as needed
      
    } catch (relatedDataError) {
      console.error('Error deleting related data:', relatedDataError);
      toast.warning('Some related user data may not have been deleted completely.');
    }
    
    // Delete user sessions to force logout
    try {
      const { error: sessionError } = await supabase.auth.admin.signOut(userId);
      
      if (sessionError) {
        console.error('Error invalidating user sessions:', sessionError);
      } else {
        console.log('User sessions invalidated successfully');
      }
    } catch (sessionError) {
      console.error('Error invalidating sessions:', sessionError);
    }
    
    // Delete the profile entry in our database
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error deleting profile:', profileError);
      toast.error('Failed to delete user profile: ' + profileError.message);
      throw profileError;
    }
    
    console.log('Profile deleted successfully');
    
    // Finally delete from auth.users (needs admin rights)
    try {
      // This requires admin privileges to work
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        
        // Try alternative approach - using RPC function that admins can set up
        try {
          const { error: rpcError } = await supabase.rpc('delete_user_auth', {
            user_id: userId
          });
          
          if (rpcError) {
            console.error('Error calling delete_user_auth RPC:', rpcError);
            toast.warning('Auth record may still exist. Full deletion requires server-side action.');
          } else {
            console.log('Auth user deleted successfully via RPC');
            toast.success('User completely deleted');
          }
        } catch (rpcCallError) {
          console.error('RPC call failed:', rpcCallError);
          toast.warning('Auth record deletion may need admin intervention.');
        }
      } else {
        console.log('Auth user deleted successfully');
        toast.success('User completely deleted');
      }
    } catch (authDeleteError) {
      console.error('Admin delete failed:', authDeleteError);
      toast.warning('Auth record deletion may require admin intervention.');
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};
