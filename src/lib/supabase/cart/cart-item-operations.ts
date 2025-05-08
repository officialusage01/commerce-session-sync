
import { supabase } from '../client';
import { CartItem } from './types';
import { Product } from '../types';

/**
 * Checks if an item already exists in the user's cart
 */
export async function checkExistingCartItem(userId: string, productId: string): Promise<any> {
  console.log('Cart Operations - Checking if item exists in cart');
  const { data: existingItem, error: existingError } = await supabase
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
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('Cart Operations - Error checking existing cart item:', existingError);
    throw new Error('Error checking existing cart item');
  }
  
  return existingItem;
}

/**
 * Updates the quantity of an existing cart item
 */
export async function updateExistingCartItem(existingItem: any, additionalQuantity: number): Promise<CartItem | null> {
  console.log('Cart Operations - Item already exists in cart, updating quantity');
  // Update quantity of existing item
  const newQuantity = existingItem.quantity + additionalQuantity;
  console.log('Cart Operations - Updating quantity to:', newQuantity);
  
  const { data: updatedItem, error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity: newQuantity })
    .eq('id', existingItem.id)
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

  if (updateError) {
    console.error('Cart Operations - Error updating cart item:', updateError);
    throw new Error('Failed to update cart item');
  }
  
  if (!updatedItem) {
    console.error('Cart Operations - No updated item returned');
    return null;
  }
  
  console.log('Cart Operations - Item updated successfully:', updatedItem);

  // Ensure the product has image_urls property (use images if available or empty array)
  const productData = Array.isArray(updatedItem.product) 
    ? updatedItem.product[0] 
    : updatedItem.product;
    
  // Create a valid Product object with all required properties
  const product: Product = {
    ...productData,
    image_urls: productData.image_urls || productData.images || []
  };

  return {
    id: updatedItem.id,
    product_id: updatedItem.product_id,
    quantity: updatedItem.quantity,
    product
  };
}

/**
 * Adds a new item to the cart
 */
export async function addNewCartItem(userId: string, productId: string, quantity: number): Promise<CartItem | null> {
  console.log('Cart Operations - Adding new item to cart');
  const { data, error } = await supabase
    .from('cart_items')
    .insert([
      { user_id: userId, product_id: productId, quantity }
    ])
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

  if (error) {
    console.error('Cart Operations - Error adding item to cart:', error);
    throw new Error('Failed to add item to cart');
  }
  
  if (!data) {
    console.error('Cart Operations - No data returned after insert');
    return null;
  }
  
  console.log('Cart Operations - Item added successfully:', data);

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
}
