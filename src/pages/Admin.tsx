
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { ScrollArea } from "@/components/ui/scroll-area";

// Import refactored hooks
import { useProfilesTable } from '@/hooks/useProfilesTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';

// Import refactored components
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCardGrid from '@/components/admin/StatsCardGrid';
import UserManagementTable from '@/components/admin/user-management/UserManagementTable';
import SetupInstructions from '@/components/admin/SetupInstructions';
import AdminErrorState from '@/components/admin/AdminErrorState';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  // Use our custom hooks
  const {
    tableExists,
    setTableExists,
    isCreatingTable,
    checkingProfilesTable,
    setCheckingProfilesTable,
    errorMessage,
    handleCreateTable
  } = useProfilesTable();

  const {
    users,
    isLoading,
    error,
    refetch,
    stats
  } = useAdminUsers(isAdmin, tableExists);

  if (checkingProfilesTable) {
    return <LoadingScreen />;
  }

  // Show setup instructions if profiles table doesn't exist
  if (tableExists === false) {
    return (
      <div className="pt-24 pb-16 min-h-screen animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          <SetupInstructions
            errorMessage={errorMessage}
            isCreatingTable={isCreatingTable}
            handleCreateTable={handleCreateTable}
            setTableExists={setTableExists}
            setCheckingProfilesTable={setCheckingProfilesTable}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          <AdminErrorState 
            error={error}
            refetch={refetch}
            handleCreateTable={handleCreateTable}
            isCreatingTable={isCreatingTable}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen animate-fade-in">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <AdminHeader />
          <StatsCardGrid stats={stats} />
          <UserManagementTable 
            users={users || []} 
            currentUserId={user?.id} 
            onRefetch={refetch} 
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Admin;
