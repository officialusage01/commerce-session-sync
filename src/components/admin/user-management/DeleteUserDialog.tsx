
import React from 'react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { deleteUser } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: string | null;
  setUserToDelete: (userId: string | null) => void;
  isUpdating: string | null;
  onSuccess: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onOpenChange,
  userToDelete,
  setUserToDelete,
  isUpdating,
  onSuccess
}) => {
  // Handle user deletion with proper error handling
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Note: isUpdating state is managed in the parent component
      await deleteUser(userToDelete);
      toast.success('User account deleted successfully');
      
      onOpenChange(false);
      setUserToDelete(null);
      onSuccess(); // Refresh user list after deletion
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <p className="font-medium">
              This will delete:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>User profile information</li>
              <li>Authentication data (email/password)</li>
              <li>All posts, comments, and other content created by the user</li>
              <li>Associated permissions and settings</li>
            </ul>
            <p className="text-amber-600 text-sm mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
              <strong>Note:</strong> Complete authentication removal might require Supabase admin panel 
              access in some cases due to API limitations.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteUser}
            className="bg-red-500 hover:bg-red-600"
            disabled={isUpdating === userToDelete}
          >
            {isUpdating === userToDelete ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
