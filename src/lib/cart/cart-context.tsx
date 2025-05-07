
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../supabase/client';
import { CartContextType, CartItem } from './types';
import { useCartOperations } from './use-cart-operations';
import { calculateTotalItems, calculateTotalPrice } from './cart-utils';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  
  const {
    items,
    setItems,
    isLoading,
    error,
    initializeCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
    handleCheckout
  } = useCartOperations(userId);

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await initializeCart();
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
      }
    };

    initializeAuthState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        // Re-initialize cart on login
        initializeCart();
      } else {
        setUserId(null);
        setItems([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const totalItems = calculateTotalItems(items);
  const totalPrice = calculateTotalPrice(items);

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
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
