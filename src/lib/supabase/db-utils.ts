
import { supabase } from './client';

// Helper function for error handling
export const handleDatabaseError = (error: unknown, operation: string): void => {
  console.error(`Error during ${operation}:`, error);
};

// Enhanced error handling with fallback data
export const getLocalData = <T>(key: string, defaultData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error retrieving local data for ${key}:`, error);
    return defaultData;
  }
};

export const saveLocalData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving local data for ${key}:`, error);
  }
};

// REST API Table Creation
export const createTableWithRESTAPI = async (tableName: string, sqlStatement: string): Promise<boolean> => {
  try {
    const supabaseUrl = 'https://ufvtilwrfixuirhmzdhj.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnRpbHdyZml4dWlyaG16ZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjA5NjYsImV4cCI6MjA2MDEzNjk2Nn0.Xry-Wl4qqEhR4NM4bJ0vVZDERdjYoqSO9dYo19cnns4';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sql: sqlStatement })
    });
    
    if (!response.ok) {
      console.error(`Error creating ${tableName} table with REST API:`, await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    handleDatabaseError(error, `creating ${tableName} table with REST API`);
    return false;
  }
};
