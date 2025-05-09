
import { supabase } from '../client';
import { CartItem } from './types';
import { handleDatabaseError } from '../db-utils';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    console.log('Fetching cart items for user:', userId);
    
    // First, check if the user has any cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity')
      .eq('user_id', userId);
    
    if (cartError) {
      console.error('Database error fetching cart items:', cartError);
      throw cartError;
    }
    
    if (!cartItems || cartItems.length === 0) {
      console.log('No cart items found for user');
      return [];
    }
    
    // Create an array of product IDs to fetch product details
    const productIds = cartItems.map(item => item.product_id);
    
    // Fetch product details for all cart items in a single query
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, price, subcategory_id, stock, images, created_at, updated_at')
      .in('id', productIds);
    
    if (productsError) {
      console.error('Database error fetching products for cart:', productsError);
      throw productsError;
    }
    
    // Combine cart items with product details
    const cartItemsWithProducts = cartItems.map(cartItem => {
      const product = products?.find(p => p.id === cartItem.product_id);
      
      if (!product) {
        console.warn(`Product not found for cart item: ${cartItem.id}`);
        return null; // Will be filtered out below
      }
      
      return {
        id: cartItem.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        product: product,
      };
    }).filter(Boolean) as CartItem[];
    
    console.log(`Successfully fetched ${cartItemsWithProducts.length} cart items with product details`);
    return cartItemsWithProducts;
  } catch (error) {
    handleDatabaseError(error, 'fetching cart items');
    return [];
  }
};
