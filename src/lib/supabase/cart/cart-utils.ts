
import { supabase } from '../client';
import { recreateCartItemsTable } from '../db-setup';

/**
 * Validates if a string is a valid UUID
 */
export function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Validates that the cart_items table exists, creates it if not
 */
export async function ensureCartTable(): Promise<boolean> {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from('cart_items')
      .select('id')
      .limit(1);

    if (checkError?.code === '42P01') {
      // Table doesn't exist, create it
      const success = await recreateCartItemsTable();
      if (!success) {
        throw new Error('Failed to create cart_items table');
      }
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring cart table exists:', error);
    return false;
  }
}

/**
 * Clean up invalid cart items from the database
 */
export async function cleanInvalidCartItems(userId: string): Promise<void> {
  try {
    // Remove cart items with invalid product_id or missing product
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, product_id')
      .eq('user_id', userId);
      
    if (error || !data) return;
    
    const invalidIds = data
      .filter(item => typeof item.product_id !== 'string' || item.product_id.length < 30)
      .map(item => item.id);
      
    if (invalidIds.length > 0) {
      await supabase
        .from('cart_items')
        .delete()
        .in('id', invalidIds);
    }
  } catch (error) {
    console.error('Error cleaning invalid cart items:', error);
  }
}
