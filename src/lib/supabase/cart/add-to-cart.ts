
import { supabase } from '../client';
import { Product } from '../types';
import { CartItem } from './types';
import { ensureCartTable } from './cart-utils';

/**
 * Adds a product to the user's cart or updates quantity if already exists
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<CartItem | null> => {
  console.log('Cart Operations - addToCart called with:', { productId, quantity });
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Cart Operations - No authenticated user');
    throw new Error('Authentication required');
  }
  
  const userId = user.id;
  
  // Basic validation
  if (!userId) {
    console.error('Cart Operations - No user ID provided');
    throw new Error('User ID is required');
  }
  
  if (!productId) {
    console.error('Cart Operations - No product ID provided');
    throw new Error('Product ID is required');
  }
  
  console.log('Cart Operations - Product ID and type:', productId, typeof productId);
  
  try {
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

/**
 * Updates the quantity of an existing cart item
 */
async function updateExistingCartItem(existingItem: any, additionalQuantity: number): Promise<CartItem | null> {
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

  return {
    id: updatedItem.id,
    product_id: updatedItem.product_id,
    quantity: updatedItem.quantity,
    product: Array.isArray(updatedItem.product) ? updatedItem.product[0] : updatedItem.product
  };
}

/**
 * Adds a new item to the cart
 */
async function addNewCartItem(userId: string, productId: string, quantity: number): Promise<CartItem | null> {
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

  return {
    id: data.id,
    product_id: data.product_id,
    quantity: data.quantity,
    product: Array.isArray(data.product) ? data.product[0] : data.product
  };
}
