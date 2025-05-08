
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartContextType, CartItem } from './types';
import { useCartOperations } from './use-cart-operations';
import { calculateTotalItems, calculateTotalPrice } from './cart-utils';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { useCartAuth } from './hooks/use-cart-auth';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [sessionCartItems, setSessionCartItems] = useSessionStorage<CartItem[]>('cart-items', []);
  
  // Extract auth logic to custom hook
  const { 
    userId,
    initializeAuthState,
    setupAuthListener
  } = useCartAuth(sessionCartItems);
  
  const {
    items,
    isLoading,
    error,
    initializeCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
    handleCheckout
  } = useCartOperations(userId);

  // Memoize cart totals calculations to prevent unnecessary re-renders
  const totalItems = React.useMemo(() => calculateTotalItems(items), [items]);
  const totalPrice = React.useMemo(() => calculateTotalPrice(items), [items]);

  // Update session storage when cart items change, but throttle updates
  useEffect(() => {
    // Only update if there are items and they don't match session storage
    if (items && JSON.stringify(items) !== JSON.stringify(sessionCartItems)) {
      setSessionCartItems(items);
    }
  }, [items, setSessionCartItems]);

  // Initialize cart from session storage or database
  useEffect(() => {
    const initialize = async () => {
      try {
        const loggedInUserId = await initializeAuthState();
        if (loggedInUserId) {
          await initializeCart();
        } else if (sessionCartItems.length > 0) {
          // If not logged in but we have session storage items, use those
          // Don't reinitialize if items are already loaded
          if (items.length === 0) {
            initializeCart();
          }
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
      }
    };

    initialize();

    // Set up auth state change listener
    const unsubscribe = setupAuthListener(
      // onLogin callback
      async (newUserId) => {
        await initializeCart();
      },
      // onLogout callback
      (sessionItems) => {
        if (sessionItems && sessionItems.length > 0) {
          initializeCart();
        }
      }
    );

    return unsubscribe;
  }, [initializeAuthState, setupAuthListener, initializeCart, sessionCartItems]);

  // Provide stable object reference to minimize re-renders
  const contextValue = React.useMemo(() => ({
    items,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    checkout: handleCheckout,
    totalItems,
    totalPrice,
    isLoading,
    error
  }), [
    items, 
    handleAddToCart, 
    handleRemoveFromCart, 
    handleUpdateQuantity, 
    handleClearCart, 
    handleCheckout,
    totalItems,
    totalPrice,
    isLoading,
    error
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
