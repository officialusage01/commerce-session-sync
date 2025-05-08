
import { CartItem } from './types';

/**
 * Calculate total number of items in the cart
 */
export const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate the total price of all items in the cart
 */
export const calculateTotalPrice = (items: CartItem[]): number => {
  return parseFloat(
    items
      .reduce((total, item) => {
        // Ensure price is a valid number
        const price = typeof item.product.price === 'number' 
          ? item.product.price 
          : parseFloat(String(item.product.price)) || 0;
          
        return total + (price * item.quantity);
      }, 0)
      .toFixed(2)
  );
};
