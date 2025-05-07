
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Key } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserTableRowProps {
  profile: UserProfile;
  currentUserId: string | undefined;
  isUpdating: string | null;
  pendingChanges: Record<string, string>;
  onRoleChange: (userId: string, newRole: string) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string) => void;
  formatDate: (dateString: string | null) => string;
  getEffectiveRole: (userId: string, currentRole: string) => string;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ 
  profile, 
  currentUserId, 
  isUpdating, 
  pendingChanges, 
  onRoleChange, 
  onResetPassword, 
  onDeleteUser,
  formatDate,
  getEffectiveRole
}) => {
  return (
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
            onValueChange={(value) => onRoleChange(profile.id, value)}
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
              <DropdownMenuItem onClick={() => onResetPassword(profile.email)}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500" 
                onClick={() => onDeleteUser(profile.id)}
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
  );
};

export default UserTableRow;
