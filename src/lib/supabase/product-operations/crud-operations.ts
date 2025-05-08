
import { supabase } from '../client';
import { handleDatabaseError } from '../db-utils';
import { Product } from '../types';

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    handleDatabaseError(error, 'creating product');
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    // Remove subcategory and category fields if they exist
    // as they don't exist in the products table
    const { subcategory, category, ...productData } = product as any;
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    handleDatabaseError(error, 'updating product');
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    handleDatabaseError(error, 'deleting product');
    return false;
  }
};
