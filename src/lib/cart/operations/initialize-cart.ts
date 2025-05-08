
import { useState, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { CartItem } from '../types';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { cleanInvalidCartItems, getCartItems } from '../../supabase/cart';
import { CartOperationsState, CartOperationsActions } from './types';

export const useInitializeCart = (userId: string | null) => {
  const [sessionCartItems, setSessionCartItems] = useSessionStorage<CartItem[]>('cart-items', []);
  const [items, setItems] = useState<CartItem[]>(sessionCartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const state: CartOperationsState = {
    items,
    isLoading,
    error
  };
  
  const actions: CartOperationsActions = {
    setItems,
    setIsLoading,
    setError
  };

  // Use useCallback to prevent unnecessary re-renders
  const initializeCart = useCallback(async () => {
    try {
      // Prevent multiple initializations running at once
      if (isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      if (userId) {
        // If logged in, get cart from database and sync with session
        await cleanInvalidCartItems(userId);
        const cartItems = await getCartItems(userId);
        // Use functional updates to ensure we're working with the most current state
        setItems(cartItems);
        setSessionCartItems(cartItems);
      } else if (sessionCartItems.length > 0) {
        // If not logged in but we have session items, use those
        setItems(sessionCartItems);
      } else {
        // Explicitly set empty array to ensure consistent state
        setItems([]);
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
      setError('Failed to initialize cart');
    } finally {
      setIsLoading(false);
    }
  }, [userId, sessionCartItems, isLoading, setSessionCartItems]);

  return {
    state,
    actions,
    sessionCartItems,
    setSessionCartItems,
    initializeCart
  };
};
