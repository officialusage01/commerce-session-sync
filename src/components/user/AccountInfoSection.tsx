
import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import EmailSection from './EmailSection';

interface AccountInfoSectionProps {
  user: any | null;
  profile: UserProfile | null;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ user, profile }) => {
  return (
    <div className="glass p-6 rounded-xl border border-border/40 animate-slide-in">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Mail className="h-5 w-5 mr-2 text-primary" />
        Account Information
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            User ID
          </label>
          <div className="flex">
            <input
              type="text"
              value={user?.id || ''}
              readOnly
              className="block w-full p-2 rounded-md border border-input bg-muted/20 text-muted-foreground"
            />
          </div>
        </div>
        
        <EmailSection 
          userEmail={user?.email || ''} 
          userId={user?.id}
        />
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            User Role
          </label>
          <div className="flex items-center p-2 border border-input rounded-md bg-muted/20">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            <span className="capitalize">{profile?.role || 'User'}</span>
            {profile?.role === 'admin' && (
              <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Admin Access
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoSection;
