
import { supabase } from '../client';
import { handleDatabaseError } from '../db-utils';
import { ProductWithRelations } from './types';

export const getProductById = async (id: string): Promise<ProductWithRelations | null> => {
  try {
    console.log('Fetching product by ID:', id);
    
    // Get the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      console.error('Database error fetching product by ID:', productError);
      throw productError;
    }
    if (!product) return null;

    // Get its subcategory
    const { data: subcategory, error: subcategoryError } = await supabase
      .from('subcategories')
      .select('*')
      .eq('id', product.subcategory_id)
      .single();

    if (subcategoryError) {
      console.error('Database error fetching subcategory for product:', subcategoryError);
      throw subcategoryError;
    }
    if (!subcategory) return null;

    // Get the category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', subcategory.category_id)
      .single();

    if (categoryError) {
      console.error('Database error fetching category for product:', categoryError);
      throw categoryError;
    }
    if (!category) return null;

    console.log('Product with relations fetched successfully');
    return {
      ...product,
      subcategory,
      category
    };
  } catch (error) {
    handleDatabaseError(error, 'fetching product by id');
    return null;
  }
};

// Alias for getProductById for backward compatibility
export const getProduct = getProductById;
