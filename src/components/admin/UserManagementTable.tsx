
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash, Key, Users } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { updateUserProfile, deleteUser } from '@/lib/supabase';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/supabase';

interface UserManagementTableProps {
  users: UserProfile[];
  currentUserId: string | undefined;
  onRefetch: () => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ 
  users, 
  currentUserId,
  onRefetch 
}) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Track role changes instead of immediately applying them
  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges({
      ...pendingChanges,
      [userId]: newRole
    });
  };

  // Apply all pending role changes
  const applyChanges = async () => {
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
  const cancelChanges = () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info("No changes to cancel");
      return;
    }
    
    setPendingChanges({});
    toast.info("Changes canceled");
  };

  // Handle user deletion with proper error handling
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsUpdating(userToDelete);
      await deleteUser(userToDelete);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      onRefetch(); // Refresh user list after deletion
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsUpdating(null);
    }
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

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get effective role (pending or current)
  const getEffectiveRole = (userId: string, currentRole: string) => {
    return pendingChanges[userId] || currentRole;
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/40 animate-blur-in mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        User Management
      </h2>
      
      <ScrollArea className="h-[calc(100vh-400px)] w-full rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((profile) => (
                  <TableRow key={profile.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={profile.role === 'admin' ? 'bg-primary/10 text-primary' : ''}>
                            {profile.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{profile.id.substring(0, 8)}...</p>
                          {profile.id === currentUserId && (
                            <span className="text-xs text-muted-foreground">(You)</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{profile.email}</TableCell>
                    <TableCell>
                      {currentUserId !== profile.id ? (
                        <Select
                          disabled={isUpdating !== null}
                          value={getEffectiveRole(profile.id, profile.role)}
                          onValueChange={(value) => handleRoleChange(profile.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="non-admin">Non-Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {profile.role} (you)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell>
                      {currentUserId !== profile.id ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isUpdating !== null}>
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>User Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleResetPassword(profile.email)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500" 
                              onClick={() => {
                                setUserToDelete(profile.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4 text-red-500" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground px-2">Current user</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      {/* Save/Cancel buttons at bottom of screen */}
      {Object.keys(pendingChanges).length > 0 && (
        <div className="flex justify-end gap-2 sticky bottom-0 pt-4 mt-4 border-t border-border/40 bg-background">
          <Button 
            variant="outline" 
            onClick={cancelChanges}
            disabled={isUpdating !== null}
          >
            Cancel
          </Button>
          <Button 
            onClick={applyChanges}
            disabled={isUpdating !== null}
          >
            {isUpdating === "saving" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-500 hover:bg-red-600"
              disabled={isUpdating === userToDelete}
            >
              {isUpdating === userToDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagementTable;
