
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserRole } from '@/lib/supabase/database';
import { UserProfile } from '@/lib/types';

export function useAuthState() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Force admin role for testad1@mailinator.com
  const checkAndSetAdminRole = (email: string, id: string, role: string) => {
    if (email === 'testad1@mailinator.com') {
      console.log('Force setting admin role for testad1@mailinator.com');
      setIsAdmin(true);
      setProfile(prev => ({
        ...(prev || { id, email, role: 'admin' }),
        role: 'admin'
      }));
      return 'admin';
    }
    setIsAdmin(role === 'admin');
    return role;
  };

  // Check for active session on initial load
  useEffect(() => {
    console.log("AuthProvider initialized, checking session");
    let isActive = true; // Flag to prevent state updates after unmount
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isActive && isLoading) {
        console.error("Auth session check timed out after 10 seconds");
        setIsLoading(false);
        setAuthError(new Error("Authentication timed out"));
      }
    }, 10000);

    const checkSession = async () => {
      try {
        console.log("Checking auth session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (!isActive) return; // Prevent updates if component unmounted
        
        if (error) {
          console.error("Session check error:", error);
          setAuthError(error);
          setIsLoading(false);
          return;
        }
        
        if (data.session?.user) {
          console.log("User found in session:", data.session.user.id);
          setUser(data.session.user);
          
          // Fetch the user's profile with role
          try {
            const userEmail = data.session.user.email || '';
            const userId = data.session.user.id;
            
            let role = await getUserRole(userId);
            
            // Override role for testad1@mailinator.com
            role = checkAndSetAdminRole(userEmail, userId, role);
            
            console.log("User role:", role);
            
            if (isActive) {
              setProfile({
                id: userId,
                email: userEmail,
                role: role,
              });
            }
          } catch (err) {
            console.error("Error getting user role:", err);
            // Set default profile even if role fetch fails to prevent loading state
            if (isActive) {
              setProfile({
                id: data.session.user.id,
                email: data.session.user.email || '',
                role: 'non-admin',
              });
            }
          }
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (isActive) setAuthError(error as Error);
      } finally {
        console.log("Auth check completed, setting isLoading to false");
        if (isActive) setIsLoading(false);
      }
    };

    checkSession();
    
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array to run only once on mount

  // Listen for auth state changes
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (!isActive) return; // Prevent updates if component unmounted
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in:", session.user.id);
          setUser(session.user);
          
          try {
            const userEmail = session.user.email || '';
            const userId = session.user.id;
            
            let role = await getUserRole(userId);
            
            // Override role for testad1@mailinator.com
            role = checkAndSetAdminRole(userEmail, userId, role);
            
            console.log("User role after sign in:", role);
            
            if (isActive) {
              setProfile({
                id: userId,
                email: userEmail,
                role: role,
              });
            }
          } catch (err) {
            console.error("Error getting user role on auth change:", err);
            // Set default profile even if role fetch fails
            if (isActive) {
              setProfile({
                id: session.user.id,
                email: session.user.email || '',
                role: 'non-admin',
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          if (isActive) {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        if (isActive) setAuthError(error as Error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return {
    user,
    setUser,
    profile,
    setProfile,
    isAdmin,
    setIsAdmin,
    isLoading,
    setIsLoading,
    authError
  };
}
