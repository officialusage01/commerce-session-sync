
import { useState, useEffect } from 'react';
import { createProfilesTable } from '@/lib/supabase/database';
import { toast } from 'sonner';

export function useProfilesTable() {
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [checkingProfilesTable, setCheckingProfilesTable] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const setupProfilesTable = async () => {
      try {
        setCheckingProfilesTable(true);
        console.log("Checking and creating profiles table if needed...");
        
        // Try to create profiles table
        const result = await createProfilesTable();
        if (result) {
          console.log('Profiles table exists or was created successfully');
          setTableExists(true);
        } else {
          console.log('Failed to ensure profiles table exists');
          setTableExists(false);
          setErrorMessage('Could not create profiles table. Check console for details.');
        }
      } catch (err) {
        console.error('Error checking/creating profiles table:', err);
        setTableExists(false);
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setCheckingProfilesTable(false);
      }
    };

    setupProfilesTable();
  }, []);

  const handleCreateTable = async () => {
    setIsCreatingTable(true);
    setErrorMessage(null);
    try {
      console.log("Creating profiles table...");
      const result = await createProfilesTable();
      if (result) {
        toast.success('Profiles table created successfully');
        setTableExists(true);
      } else {
        toast.error('Failed to create profiles table');
        setErrorMessage('Failed to create profiles table. Check console for details.');
      }
    } catch (err: any) {
      console.error('Error creating profiles table:', err);
      toast.error('Error creating profiles table: ' + (err.message || String(err)));
      setErrorMessage(err.message || String(err));
    } finally {
      setIsCreatingTable(false);
    }
  };

  return {
    tableExists,
    setTableExists,
    isCreatingTable,
    checkingProfilesTable,
    setCheckingProfilesTable,
    errorMessage,
    handleCreateTable
  };
}
