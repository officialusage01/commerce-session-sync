
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { CartItem } from '../types';

interface CartAuthResult {
  userId: string | null;
  setUserId: (id: string | null) => void;
  initializeAuthState: () => Promise<string | null>;
  setupAuthListener: (
    onLogin: (userId: string) => Promise<void>,
    onLogout: (sessionItems: CartItem[]) => void
  ) => () => void;
}

/**
 * Hook to handle cart authentication state
 */
export const useCartAuth = (sessionCartItems: CartItem[]): CartAuthResult => {
  const [userId, setUserId] = useState<string | null>(null);
  
  // Initialize auth state by checking if user is logged in
  const initializeAuthState = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        return user.id;
      }
      return null;
    } catch (err) {
      console.error('Error initializing auth state:', err);
      return null;
    }
  }, []);

  // Set up auth state change listener
  const setupAuthListener = useCallback((
    onLogin: (userId: string) => Promise<void>,
    onLogout: (sessionItems: CartItem[]) => void
  ) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const newUserId = session.user.id;
        setUserId(newUserId);
        // Re-initialize cart on login
        onLogin(newUserId);
      } else {
        setUserId(null);
        // If logged out but we have session storage items, use those
        onLogout(sessionCartItems);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionCartItems]);

  return {
    userId,
    setUserId,
    initializeAuthState,
    setupAuthListener,
  };
};
