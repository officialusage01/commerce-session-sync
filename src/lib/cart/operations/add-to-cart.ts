
import { supabase } from '../../supabase/client';
import { CartItem } from '../types';
import { addToCart as addItemToCart } from '../../supabase/cart';
import { toast } from "sonner";
import { CartOperationsState, CartOperationsActions } from './types';

export const useAddToCart = (
  userId: string | null,
  state: CartOperationsState,
  actions: CartOperationsActions,
  setSessionCartItems: (items: CartItem[]) => void
) => {
  const { items } = state;
  const { setItems, setIsLoading, setError } = actions;

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if item already exists in cart (either session or DB)
      const existingItemIndex = items.findIndex(item => item.product_id === productId);
      
      if (existingItemIndex >= 0) {
        const existingItem = items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock before updating quantity
        if (existingItem.product.stock < newQuantity) {
          toast.error(`Only ${existingItem.product.stock} units available in stock.`);
          setIsLoading(false);
          return;
        }
        
        // Create optimistic update for better UX
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
        
        // Apply optimistic update immediately
        setItems(updatedItems);
        
        // If logged in, use database operations
        if (userId) {
          try {
            // Directly update the cart item with new quantity
            const updatedItem = await addItemToCart(productId, newQuantity);
            
            // If DB operation successful, update with actual server data
            if (updatedItem) {
              const finalItems = [...items];
              finalItems[existingItemIndex] = updatedItem;
              setItems(finalItems);
              setSessionCartItems(finalItems);
            } else {
              // If DB operation failed, revert optimistic update
              setItems(items);
              setSessionCartItems(items);
              throw new Error("Failed to update cart item quantity");
            }
          } catch (err) {
            console.error('Failed to update item in database', err);
            // Revert to original state on error
            setItems(items);
            setSessionCartItems(items);
            toast.error("Failed to update cart item");
          }
        } else {
          // For non-logged in users, just update session storage with the optimistic update
          setSessionCartItems(updatedItems);
        }
      } else {
        // Add new item to cart - need product details
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (!product) {
          toast.error('Product not found');
          setIsLoading(false);
          return;
        }
        
        // Check if product is in stock
        if (product.stock < quantity) {
          toast.error(`Only ${product.stock} units available in stock.`);
          setIsLoading(false);
          return;
        }
        
        let newItem: CartItem | null = null;
        
        if (userId) {
          // If logged in, add to database
          try {
            newItem = await addItemToCart(productId, quantity);
            if (!newItem) {
              toast.error('Failed to add item to cart');
              setIsLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error adding to cart in database:', err);
            toast.error('Failed to add item to cart');
            setIsLoading(false);
            return;
          }
        } else {
          // Add new item to session
          newItem = {
            id: `session-${Date.now()}`,
            product_id: productId,
            quantity: quantity,
            product: product
          };
        }
        
        // Update state and session storage
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        setSessionCartItems(updatedItems);
      }
    } catch (err: any) {
      console.error('Cart Operations - Error adding to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      
      // Revert to original state on error
      setItems(items);
      setSessionCartItems(items);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddToCart };
};
