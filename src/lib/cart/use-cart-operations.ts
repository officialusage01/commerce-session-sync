
import { useState } from 'react';
import { supabase } from '../supabase/client';
import { CartItem } from './types';
import { updateProduct } from '../supabase/product-operations';
import { 
  getCartItems, 
  addToCart as addItemToCart, 
  removeFromCart as removeCartItem, 
  updateCartItem, 
  clearCart as clearCartItems,
  cleanInvalidCartItems 
} from '../supabase/cart';
import { toast } from "sonner";

export const useCartOperations = (userId: string | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeCart = async () => {
    try {
      if (userId) {
        setIsLoading(true);
        await cleanInvalidCartItems(userId);
        const cartItems = await getCartItems(userId);
        setItems(cartItems);
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
      setError('Failed to initialize cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    console.log('Cart Operations - handleAddToCart called with:', { productId, quantity });
    
    if (!productId) {
      console.warn('Cart Operations - Product ID is missing');
      setError('Invalid product ID');
      return;
    }
    
    console.log('Cart Operations - Product ID type:', typeof productId);
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Cart Operations - Calling addToCart operation with:', { productId });
      const newItem = await addItemToCart(productId, quantity);
      console.log('Cart Operations - addToCart operation returned:', newItem);
      
      if (newItem) {
        console.log('Cart Operations - Updating items state with new item');
        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.product_id === productId);
          if (existingItemIndex >= 0) {
            console.log('Cart Operations - Updating existing item at index:', existingItemIndex);
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = newItem;
            return updatedItems;
          }
          console.log('Cart Operations - Adding new item to cart');
          return [...prevItems, newItem];
        });
      } else {
        console.warn('Cart Operations - No item returned from addToCart operation');
      }
    } catch (err: any) {
      console.error('Cart Operations - Error adding to cart:', err);
      setError(err.message || 'Failed to add item to cart');
    } finally {
      console.log('Cart Operations - Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!userId) {
      setError('User must be logged in to remove items from cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const success = await removeCartItem(userId, itemId);
      
      if (success) {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (!userId) {
      setError('User must be logged in to update cart items');
      return;
    }

    try {
      // Find the item to check stock availability
      const item = items.find(i => i.id === itemId);
      
      // If increasing quantity, check if we have enough stock
      if (item && quantity > item.quantity && item.product.stock < quantity) {
        toast(`Only ${item.product.stock} units available in stock.`);
        // Set quantity to max available stock if trying to exceed it
        quantity = Math.min(quantity, item.product.stock);
      }

      setIsLoading(true);
      setError(null);
      const updatedItem = await updateCartItem(userId, itemId, quantity);
      
      if (updatedItem) {
        setItems(prevItems => 
          prevItems.map(item => item.id === itemId ? updatedItem : item)
        );
      } else {
        // Item was removed (quantity set to 0)
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update item quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!userId) {
      setError('User must be logged in to clear cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const success = await clearCartItems(userId);
      
      if (success) {
        setItems([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCheckout = async () => {
    if (!userId) {
      toast("You must be logged in to checkout");
      return;
    }

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
        toast(`Insufficient stock for: ${insufficientStockItems.join(", ")}`);
        return;
      }
      
      // Update stock for each item
      const updatePromises = [];
      for (const item of items) {
        const newStock = item.product.stock - item.quantity;
        updatePromises.push(updateProduct(item.product.id, { stock: newStock }));
      }
      
      // Wait for all stock updates to complete
      const results = await Promise.all(updatePromises);
      
      // Check if any updates failed
      const failedUpdates = results.filter(result => result === null);
      if (failedUpdates.length > 0) {
        toast("Error updating product stock");
        return;
      }
      
      // Clear the cart after successful checkout
      await handleClearCart();
      
      // Show success message
      toast("Your order has been placed successfully");
      
    } catch (err) {
      console.error("Error during checkout:", err);
      setError("Failed to complete checkout");
      toast("Failed to complete checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    setItems,
    isLoading,
    setIsLoading,
    error,
    setError,
    initializeCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
    handleCheckout
  };
};
