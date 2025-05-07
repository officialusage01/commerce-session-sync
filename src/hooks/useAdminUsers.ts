
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/types';

export function useAdminUsers(isAdmin: boolean, tableExists: boolean | null) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    newUsersToday: 0
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all users from profiles table
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!tableExists) {
        throw new Error('Profiles table does not exist');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users: ' + error.message);
        setErrorMessage(error.message);
        throw error;
      }
      
      return data as UserProfile[];
    },
    enabled: isAdmin && tableExists === true, // Only run query if user is admin and table exists
    retry: 1, // Only retry once to avoid too many error messages
  });

  useEffect(() => {
    if (users) {
      const adminCount = users.filter(user => user.role === 'admin').length;
      const today = new Date().toISOString().split('T')[0];
      const newUsers = users.filter(user => {
        if (!user.created_at) return false;
        return user.created_at.startsWith(today);
      }).length;
      
      setStats({
        totalUsers: users.length,
        adminUsers: adminCount,
        newUsersToday: newUsers
      });
    }
  }, [users]);

  return {
    users,
    isLoading,
    error,
    refetch,
    stats,
    errorMessage
  };
}
