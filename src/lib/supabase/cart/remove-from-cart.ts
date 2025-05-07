
import { supabase } from '../client';

/**
 * Removes a specific item from the cart
 */
export const removeFromCart = async (userId: string, itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};
