
import React from 'react';
import { toast } from 'sonner';
import { createProfilesTable } from '@/lib/supabase/database';

interface SetupInstructionsProps {
  errorMessage: string | null;
  isCreatingTable: boolean;
  handleCreateTable: () => Promise<void>;
  setTableExists: React.Dispatch<React.SetStateAction<boolean | null>>;
  setCheckingProfilesTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({
  errorMessage,
  isCreatingTable,
  handleCreateTable,
  setTableExists,
  setCheckingProfilesTable,
}) => {
  return (
    <div className="glass rounded-xl p-8 border border-border/40 mt-8">
      <h2 className="text-xl font-semibold mb-4">Setup Required</h2>
      <p className="mb-4">The profiles table is missing in your Supabase database. You need to create it to manage users.</p>
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
          Error: {errorMessage}
        </div>
      )}
      <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-6 overflow-auto">
        <p className="mb-2">-- Create profiles table in Supabase SQL editor:</p>
        <p>CREATE TABLE IF NOT EXISTS profiles (</p>
        <p>  id UUID PRIMARY KEY REFERENCES auth.users(id),</p>
        <p>  email TEXT NOT NULL,</p>
        <p>  role TEXT DEFAULT 'non-admin',</p>
        <p>  created_at TIMESTAMPTZ DEFAULT now(),</p>
        <p>  updated_at TIMESTAMPTZ DEFAULT now()</p>
        <p>);</p>
      </div>
      <div className="flex gap-4">
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleCreateTable}
          disabled={isCreatingTable}
        >
          {isCreatingTable ? 'Creating Table...' : 'Create Table Automatically'}
        </button>
        <button 
          className="border border-border px-4 py-2 rounded-md"
          onClick={() => {
            setTableExists(null);
            setCheckingProfilesTable(true);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
        >
          Refresh After Setup
        </button>
      </div>
    </div>
  );
};

export default SetupInstructions;
