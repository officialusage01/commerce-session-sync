
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AdminError: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Error loading admin dashboard</h3>
            <p className="text-sm mt-1">Please check the console for more details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminError;
