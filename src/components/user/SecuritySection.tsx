
import React from 'react';
import { Lock, Key } from 'lucide-react';
import Button from '@/components/ui-components/Button';

interface SecuritySectionProps {
  onChangePassword: () => void;
  onLogoutAllDevices: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ 
  onChangePassword, 
  onLogoutAllDevices 
}) => {
  return (
    <div className="glass p-6 rounded-xl border border-border/40 animate-slide-in">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Lock className="h-5 w-5 mr-2 text-primary" />
        Security Settings
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Password Management
          </h3>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onChangePassword}
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Sessions
          </h3>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={onLogoutAllDevices}
          >
            <Lock className="h-4 w-4 mr-2" />
            Log Out All Devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
