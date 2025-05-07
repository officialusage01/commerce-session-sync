
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/lib/types';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

// Create the context with default values
const defaultContextValue: AuthContextType = {
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  signUp: async () => ({ error: new Error("Auth not initialized") }),
  signIn: async () => ({ error: new Error("Auth not initialized") }),
  signOut: async () => { console.error("Auth not initialized") },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Ensure hook is only called within a function component
  const { 
    user, profile, isAdmin, isLoading 
  } = useAuthState();
  
  const { 
    signUp, signIn, signOut 
  } = useAuthActions();

  // Combine the state and actions for the context value
  const contextValue: AuthContextType = {
    user,
    profile,
    isAdmin,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // This should never happen now with our default values
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
