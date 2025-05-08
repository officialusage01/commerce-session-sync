
import { supabase } from '../client';
import { CartItem } from './types';
import { Product } from '../types';

/**
 * Updates the quantity of a cart item or removes it if quantity is 0 or less
 */
export const updateCartItem = async (userId: string, itemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    if (quantity <= 0) {
      // Remove item from cart if quantity is 0 or negative
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) throw error;
      return null;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('user_id', userId)
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
      .single();

    if (error) throw error;
    if (!data) return null;

    // Ensure the product has image_urls property
    const productData = Array.isArray(data.product) ? data.product[0] : data.product;
    
    // Create a valid Product object with all required properties
    const product: Product = {
      ...productData,
      image_urls: productData.image_urls || productData.images || []
    };

    return {
      id: data.id,
      product_id: data.product_id,
      quantity: data.quantity,
      product
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return null;
  }
};
