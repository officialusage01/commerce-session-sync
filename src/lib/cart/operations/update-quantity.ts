
import { CartItem } from '../types';
import { updateCartItem } from '../../supabase/cart';
import { CartOperationsState, CartOperationsActions } from './types';

export const useUpdateQuantity = (
  userId: string | null,
  state: CartOperationsState,
  actions: CartOperationsActions,
  setSessionCartItems: (items: CartItem[]) => void
) => {
  const { items } = state;
  const { setItems, setIsLoading, setError } = actions;

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    // Don't do anything if quantity is invalid
    if (newQuantity <= 0) {
      // Let the remove handler deal with this case
      return;
    }
    
    try {
      // Find the item to update
      const itemIndex = items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        console.error('Cart Operations - Item not found:', itemId);
        return;
      }
      
      const item = items[itemIndex];
      
      // Check stock availability
      if (newQuantity > item.product.stock) {
        setError(`Only ${item.product.stock} units available`);
        toast.error(`Only ${item.product.stock} units available`);
        return;
      }
      
      // Apply optimistic update for better UX
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...item,
        quantity: newQuantity
      };
      
      // Update UI immediately
      setItems(updatedItems);
      setIsLoading(true);
      setError(null);
      
      if (userId) {
        // If logged in, update in database
        try {
          const updatedItem = await updateCartItem(userId, itemId, newQuantity);
          
          if (!updatedItem && newQuantity > 0) {
            // If DB update failed, revert optimistic update
            setError('Failed to update quantity');
            toast.error('Failed to update quantity');
            setItems(items);
            setSessionCartItems(items);
            return;
          }
          
          // If item was successfully updated, sync with the latest state
          const finalItems = [...items];
          if (updatedItem) {
            finalItems[itemIndex] = updatedItem;
          } else {
            // Item was removed (quantity = 0)
            finalItems.splice(itemIndex, 1);
          }
          
          setItems(finalItems);
          setSessionCartItems(finalItems);
        } catch (err) {
          console.error('Error updating cart item in database:', err);
          // Revert optimistic update on error
          setError('Failed to update quantity');
          toast.error('Failed to update quantity');
          setItems(items);
          setSessionCartItems(items); 
        }
      } else {
        // For non-logged users, just update session storage
        setSessionCartItems(updatedItems);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
      
      // Revert to original state on error
      setItems(items);
      setSessionCartItems(items);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUpdateQuantity };
};

// Add missing import
import { toast } from "sonner";
