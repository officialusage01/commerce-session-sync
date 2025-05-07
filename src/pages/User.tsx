import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, createProfilesTable, deleteUser } from '@/lib/supabase';
import AccountInfoSection from '@/components/user/AccountInfoSection';
import SecuritySection from '@/components/user/SecuritySection';
import PasswordSection from '@/components/user/PasswordSection';
import DangerZone from '@/components/user/DangerZone';

const UserPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Log out from all devices
  const handleLogoutAllDevices = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Logged out from all devices');
      // The auth state change will trigger a redirect to the login page
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out from all devices');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    try {
      if (!user?.id) {
        toast.error('User ID not found');
        return;
      }
      
      // Use the deleteUser function which now ensures profiles table exists
      await deleteUser(user.id);
      
      toast.success('Account deleted successfully');
      // The auth state change will trigger a redirect to the login page
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-xl p-8 border border-border/40 animate-blur-in">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-1 inline-block">
                User Profile
              </span>
              <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
              <p className="text-muted-foreground">View and manage your account settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <AccountInfoSection user={user} profile={profile} />

            {isChangingPassword ? (
              <PasswordSection 
                userEmail={user?.email || ''} 
                onCancel={() => setIsChangingPassword(false)} 
              />
            ) : (
              <SecuritySection 
                onChangePassword={() => setIsChangingPassword(true)}
                onLogoutAllDevices={handleLogoutAllDevices}
              />
            )}
            
            <DangerZone onDeleteAccount={handleDeleteAccount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
