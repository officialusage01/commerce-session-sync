
import React from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { updateUserProfile } from '@/lib/supabase';

export const useUserTableActions = () => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle password reset request
  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset');
    }
  };

  // Apply all pending role changes
  const applyChanges = async (
    pendingChanges: Record<string, string>,
    setIsUpdating: (state: string | null) => void,
    setPendingChanges: (changes: Record<string, string>) => void,
    onRefetch: () => void
  ) => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      setIsUpdating("saving");
      
      // Process all role changes sequentially
      for (const [userId, newRole] of Object.entries(pendingChanges)) {
        await updateUserProfile(userId, { role: newRole });
      }
      
      toast.success(`User role updates applied successfully`);
      setPendingChanges({});
      onRefetch(); // Refresh user list after update
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user roles');
    } finally {
      setIsUpdating(null);
    }
  };

  // Cancel all pending changes
  const cancelChanges = (
    pendingChanges: Record<string, string>,
    setPendingChanges: (changes: Record<string, string>) => void
  ) => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info("No changes to cancel");
      return;
    }
    
    setPendingChanges({});
    toast.info("Changes canceled");
  };

  return {
    formatDate,
    handleResetPassword,
    applyChanges,
    cancelChanges
  };
};
