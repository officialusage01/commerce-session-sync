
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import our refactored components
import UserTableRow from './UserTableRow';
import DeleteUserDialog from './DeleteUserDialog';
import PendingChangesFooter from './PendingChangesFooter';
import { useUserTableActions } from './UserTableActions';

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

  // Use our actions hook
  const { 
    formatDate, 
    handleResetPassword, 
    applyChanges, 
    cancelChanges 
  } = useUserTableActions();

  // Track role changes instead of immediately applying them
  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges({
      ...pendingChanges,
      [userId]: newRole
    });
  };

  // Handle delete button click
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
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
                  <UserTableRow
                    key={profile.id}
                    profile={profile}
                    currentUserId={currentUserId}
                    isUpdating={isUpdating}
                    pendingChanges={pendingChanges}
                    onRoleChange={handleRoleChange}
                    onResetPassword={handleResetPassword}
                    onDeleteUser={handleDeleteUser}
                    formatDate={formatDate}
                    getEffectiveRole={getEffectiveRole}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      {/* Save/Cancel buttons at bottom of screen */}
      <PendingChangesFooter
        pendingChanges={pendingChanges}
        isUpdating={isUpdating}
        onCancel={() => cancelChanges(pendingChanges, setPendingChanges)}
        onSave={() => applyChanges(pendingChanges, setIsUpdating, setPendingChanges, onRefetch)}
      />
      
      {/* Delete confirmation dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        isUpdating={isUpdating}
        onSuccess={onRefetch}
      />
    </div>
  );
};

export default UserManagementTable;
