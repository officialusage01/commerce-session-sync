
// This file is maintained for backward compatibility
// It re-exports all functionality from the new cart modules
import { 
  CartItem,
  CartItemDB,
  getCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  isUUID,
  ensureCartTable,
  cleanInvalidCartItems
} from './cart';

export type { CartItem, CartItemDB };
export { 
  getCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  isUUID,
  ensureCartTable,
  cleanInvalidCartItems
};
