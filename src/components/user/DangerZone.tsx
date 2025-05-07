
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui-components/Button';

interface DangerZoneProps {
  onDeleteAccount: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
  return (
    <div className="glass p-6 rounded-xl border border-border/40 animate-slide-in">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-red-600">
        <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
        Danger Zone
      </h2>
      
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          These actions are destructive and cannot be reversed. Please proceed with caution.
        </p>
        <Button
          variant="outline"
          className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onDeleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
