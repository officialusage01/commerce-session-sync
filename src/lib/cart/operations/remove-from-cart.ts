
import { CartItem } from '../types';
import { removeFromCart as removeCartItem } from '../../supabase/cart';
import { CartOperationsState, CartOperationsActions } from './types';

export const useRemoveFromCart = (
  userId: string | null,
  state: CartOperationsState,
  actions: CartOperationsActions,
  setSessionCartItems: (items: CartItem[]) => void
) => {
  const { items } = state;
  const { setItems, setIsLoading, setError } = actions;

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      // Optimistic update for better UX
      const updatedItems = items.filter(item => item.id !== itemId);
      
      // Update state immediately
      setItems(updatedItems);
      
      setIsLoading(true);
      setError(null);
      
      if (userId) {
        // If logged in, remove from database
        const success = await removeCartItem(userId, itemId);
        
        if (!success) {
          // If DB operation failed, revert optimistic update
          setError('Failed to remove item from cart');
          setItems(items);
          return;
        }
      }
      
      // Sync session storage with current state
      setSessionCartItems(updatedItems);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      
      // Revert to original state on error
      setItems(items);
      setSessionCartItems(items);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRemoveFromCart };
};
