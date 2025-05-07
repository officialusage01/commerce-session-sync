
import { supabase } from '../client';

/**
 * Removes all items from the user's cart
 */
export const clearCart = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};
