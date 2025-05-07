
import React from 'react';
import AdminHeader from './AdminHeader';

interface AdminErrorStateProps {
  error: any;
  refetch: () => void;
  handleCreateTable: () => Promise<void>;
  isCreatingTable: boolean;
}

const AdminErrorState: React.FC<AdminErrorStateProps> = ({ 
  error, 
  refetch,
  handleCreateTable,
  isCreatingTable 
}) => {
  return (
    <div className="glass rounded-xl p-8 border border-border/40 mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4 text-red-500">Error Loading Admin Dashboard</h2>
      <p className="mb-4">
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md"
          onClick={() => refetch()}
        >
          Try Again
        </button>
        <button
          className="border border-border px-4 py-2 rounded-md"
          onClick={handleCreateTable}
          disabled={isCreatingTable}
        >
          {isCreatingTable ? 'Creating Table...' : 'Recreate Profiles Table'}
        </button>
      </div>
    </div>
  );
};

export default AdminErrorState;
