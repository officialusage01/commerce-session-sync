
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Shield, Settings, User, Bell, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoginData = async () => {
      if (user) {
        // This would typically fetch more user data from Supabase
        // For this demo, we'll just use the auth metadata
        const { data, error } = await supabase
          .from('profiles')
          .select('updated_at')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setLastLoginAt(new Date(data.updated_at).toLocaleString());
        }
      }
    };

    fetchLoginData();
  }, [user]);

  // Handler for profile settings button
  const handleProfileSettings = () => {
    navigate('/user');
    toast.success('Navigated to profile settings');
  };

  // Handler for password change button
  const handleChangePassword = async () => {
    try {
      if (!user?.email) {
        toast.error('Email not found');
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/user`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset');
    }
  };

  // Handler for user management button (admin only)
  const handleManageUsers = () => {
    if (isAdmin) {
      navigate('/admin');
      toast.success('Navigated to user management');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-xl p-8 border border-border/40 animate-blur-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 inline-block">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </span>
              <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.email}</h1>
              <p className="text-muted-foreground mt-1">
                {lastLoginAt ? `Last login: ${lastLoginAt}` : 'First time logging in? Welcome!'}
              </p>
            </div>
            {isAdmin && (
              <div className="mt-4 md:mt-0">
                <div className="glass px-4 py-2 rounded-md border border-border/60 flex items-center gap-2 text-primary">
                  <Shield size={18} />
                  <span>Admin privileges active</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-xl border border-border/40 hover:shadow-md transition-all animate-slide-in">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-md mr-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Your Profile</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium capitalize">{profile?.role || 'User'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium text-xs truncate max-w-[180px]">{user?.id}</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-border/40 hover:shadow-md transition-all animate-slide-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-md mr-3">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <p className="text-muted-foreground">
                View your recent account activity and security events.
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm">Successful login</span>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm">Profile updated</span>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </li>
              </ul>
            </div>

            <div className="glass p-6 rounded-xl border border-border/40 hover:shadow-md transition-all animate-slide-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-md mr-3">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  className="w-full py-2 px-4 bg-primary/5 hover:bg-primary/10 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2"
                  onClick={handleProfileSettings}
                >
                  <User className="h-4 w-4" />
                  Update profile settings
                </button>
                <button 
                  className="w-full py-2 px-4 bg-primary/5 hover:bg-primary/10 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2"
                  onClick={handleChangePassword}
                >
                  <Key className="h-4 w-4" />
                  Change password
                </button>
                {isAdmin && (
                  <button 
                    className="w-full py-2 px-4 bg-primary/5 hover:bg-primary/10 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2"
                    onClick={handleManageUsers}
                  >
                    <Shield className="h-4 w-4" />
                    Manage users
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-12 animate-blur-in" style={{ animationDelay: '300ms' }}>
            <p className="text-muted-foreground">
              This is a protected dashboard page that requires authentication.
              {isAdmin 
                ? ' As an admin, you have access to all features including the Admin page.' 
                : ' You can access user-specific features but not admin features.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
