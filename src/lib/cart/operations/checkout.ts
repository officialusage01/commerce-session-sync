
import { CartItem } from '../types';
import { toast } from "sonner";
import { updateProduct } from '../../supabase/product-operations';
import { CartOperationsState, CartOperationsActions } from './types';

export const useCheckout = (
  userId: string | null,
  state: CartOperationsState,
  actions: CartOperationsActions,
  handleClearCart: () => Promise<void>
) => {
  const { items } = state;
  const { setIsLoading, setError } = actions;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast("Your cart is empty");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Check if all items have sufficient stock
      const insufficientStockItems: string[] = [];
      
      for (const item of items) {
        if (item.product.stock < item.quantity) {
          insufficientStockItems.push(item.product.name);
        }
      }
      
      // If any item has insufficient stock, show error and return
      if (insufficientStockItems.length > 0) {
        toast.error(`Insufficient stock for: ${insufficientStockItems.join(", ")}`);
        return;
      }
      
      // Update stock for each item (regardless of login status)
      console.log("Updating stock for items:", items);
      
      let allStockUpdatesSuccessful = true;
      
      // Process stock updates sequentially to avoid race conditions
      for (const item of items) {
        console.log(`Updating stock for ${item.product.name} - current stock: ${item.product.stock}, quantity: ${item.quantity}`);
        const newStock = Math.max(0, item.product.stock - item.quantity);
        
        try {
          // Update product stock in database
          const updatedProduct = await updateProduct(item.product.id, { 
            stock: newStock 
          });
          
          if (!updatedProduct) {
            console.error(`Failed to update stock for product ${item.product.id}`);
            allStockUpdatesSuccessful = false;
          } else {
            console.log(`Successfully updated stock for ${item.product.name} to ${newStock}`);
          }
        } catch (error) {
          console.error(`Error updating stock for product ${item.product.id}:`, error);
          allStockUpdatesSuccessful = false;
        }
      }
      
      if (!allStockUpdatesSuccessful) {
        toast.error("Some products could not be updated. Please try again.");
        return;
      }
      
      // Clear the cart after successful checkout
      await handleClearCart();
      
      // Show success message
      toast.success("Your order has been placed successfully");
      
    } catch (err) {
      console.error("Error during checkout:", err);
      setError("Failed to complete checkout");
      toast.error("Failed to complete checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCheckout };
};
