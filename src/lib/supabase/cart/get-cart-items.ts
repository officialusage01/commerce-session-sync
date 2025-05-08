
import { supabase } from '../client';
import { CartItem } from './types';
import { Product } from '../types';
import { isUUID, ensureCartTable } from './cart-utils';

/**
 * Retrieves cart items for a specific user
 */
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    // Ensure cart table exists
    const tableExists = await ensureCartTable();
    if (!tableExists) {
      throw new Error('Failed to ensure cart_items table exists');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          description,
          price,
          subcategory_id,
          stock,
          images,
          image_urls,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    if (!data) return [];

    // Filter out items with invalid product_id or missing product
    return data
      .filter(item => isUUID(item.product_id) && item.product && (!Array.isArray(item.product) || item.product[0]))
      .map(item => {
        const productData = Array.isArray(item.product) ? item.product[0] : item.product;
        
        // Create a valid Product object with all required properties
        const product: Product = {
          ...productData,
          image_urls: productData.image_urls || productData.images || []
        };

        return {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product
        };
      });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};
