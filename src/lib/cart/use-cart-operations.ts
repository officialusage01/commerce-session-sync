
import { useCallback } from 'react';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { CartItem } from './types';
import { 
  useInitializeCart,
  useAddToCart,
  useRemoveFromCart,
  useUpdateQuantity,
  useClearCart,
  useCheckout,
  CartOperationsResult
} from './operations';

export const useCartOperations = (userId: string | null): CartOperationsResult => {
  // Initialize the cart state and actions
  const { 
    state, 
    actions,
    sessionCartItems,
    setSessionCartItems,
    initializeCart
  } = useInitializeCart(userId);
  
  // Create handlers for cart operations
  const { handleAddToCart } = useAddToCart(
    userId, 
    state, 
    actions, 
    setSessionCartItems
  );
  
  const { handleRemoveFromCart } = useRemoveFromCart(
    userId, 
    state, 
    actions, 
    setSessionCartItems
  );
  
  const { handleUpdateQuantity } = useUpdateQuantity(
    userId, 
    state, 
    actions, 
    setSessionCartItems
  );
  
  const { handleClearCart } = useClearCart(
    userId, 
    state, 
    actions, 
    setSessionCartItems
  );
  
  const { handleCheckout } = useCheckout(
    userId, 
    state, 
    actions, 
    handleClearCart
  );

  // Memoize the results to maintain stable references
  return {
    ...state,
    ...actions,
    initializeCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
    handleCheckout
  };
};
