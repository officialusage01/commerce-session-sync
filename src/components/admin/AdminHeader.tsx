
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-8">
      <div className="p-3 bg-primary/10 rounded-full mr-4">
        <Shield className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and system settings</p>
      </div>
    </div>
  );
};

export default AdminHeader;
