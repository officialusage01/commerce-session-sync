
import { supabase } from '../client';
import { Product } from '../types';
import { CartItem } from './types';
import { ensureCartTable } from './cart-utils';
import { validateAddToCartInput } from './validators';
import { checkExistingCartItem } from './cart-item-operations';
import { updateExistingCartItem, addNewCartItem } from './cart-item-operations';

/**
 * Adds a product to the user's cart or updates quantity if already exists
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<CartItem | null> => {
  console.log('Cart Operations - addToCart called with:', { productId, quantity });
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Cart Operations - No authenticated user');
      throw new Error('Authentication required');
    }
    
    const userId = user.id;
    
    // Basic validation
    validateAddToCartInput(userId, productId);
    
    console.log('Cart Operations - Product ID and type:', productId, typeof productId);
    
    // Check if table exists
    console.log('Cart Operations - Checking if cart_items table exists');
    const tableExists = await ensureCartTable();
    if (!tableExists) {
      throw new Error('Failed to ensure cart_items table exists');
    }

    // Check if product exists and is valid
    console.log('Cart Operations - Checking if product exists in database:', productId);
    const { data: dbProduct, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('Cart Operations - Error fetching product:', productError);
      throw new Error('Product not found');
    }
    
    if (!dbProduct) {
      console.error('Cart Operations - Product not found in database:', productId);
      throw new Error('Product not found');
    }
    
    console.log('Cart Operations - Product found in database:', dbProduct);

    // Check if item already exists in cart
    const existingItem = await checkExistingCartItem(userId, productId);

    if (existingItem) {
      return await updateExistingCartItem(existingItem, quantity);
    }

    // Add new item to cart
    return await addNewCartItem(userId, productId, quantity);
  } catch (error) {
    console.error('Cart Operations - Error in addToCart:', error);
    throw error;
  }
};
