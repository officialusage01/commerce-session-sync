
import { CartItem } from '../types';
import { clearCart as clearCartItems } from '../../supabase/cart';
import { CartOperationsState, CartOperationsActions } from './types';

export const useClearCart = (
  userId: string | null,
  state: CartOperationsState,
  actions: CartOperationsActions,
  setSessionCartItems: (items: CartItem[]) => void
) => {
  const { setItems, setIsLoading, setError } = actions;

  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (userId) {
        // If logged in, clear cart in database
        const success = await clearCartItems(userId);
        
        if (!success) {
          setError('Failed to clear cart');
          setIsLoading(false);
          return;
        }
      }
      
      // Clear both state and session storage regardless of login status
      setItems([]);
      setSessionCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleClearCart };
};
