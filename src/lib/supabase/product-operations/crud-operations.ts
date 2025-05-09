
import { supabase } from '../client';
import { Product } from '../types';

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    console.log('Creating product:', product);
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Database error creating product:', error);
      throw error;
    }

    console.log('Product created successfully:', data);
    return data as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    console.log('Updating product:', id, product);
    
    // Remove subcategory and category fields if they exist
    // as they don't exist in the products table
    const { subcategory, category, ...productData } = product as any;
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error updating product:', error);
      throw error;
    }

    console.log('Product updated successfully:', data);
    return data as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting product:', id);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error deleting product:', error);
      throw error;
    }

    console.log('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
