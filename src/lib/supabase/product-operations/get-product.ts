
import { supabase } from '../client';
import { handleDatabaseError } from '../db-utils';
import { ProductWithRelations } from './types';

// Simple product cache
const productCache: { [id: string]: { data: ProductWithRelations, timestamp: number } } = {};
// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const getProductById = async (id: string): Promise<ProductWithRelations | null> => {
  try {
    // Check cache first
    const now = Date.now();
    if (productCache[id] && now - productCache[id].timestamp < CACHE_EXPIRATION) {
      console.log('Using cached product data for ID:', id);
      return productCache[id].data;
    }
    
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
    
    // Build the complete product with relations
    const productWithRelations = {
      ...product,
      subcategory,
      category
    };
    
    // Cache the result
    productCache[id] = {
      data: productWithRelations,
      timestamp: now
    };
    
    return productWithRelations;
  } catch (error) {
    handleDatabaseError(error, 'fetching product by id');
    return null;
  }
};

// Alias for getProductById for backward compatibility
export const getProduct = getProductById;
