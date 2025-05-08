
import { supabase } from '../client';
import { handleDatabaseError } from '../db-utils';
import { ProductWithRelations } from './types';

export const getProducts = async (subcategoryId?: string): Promise<ProductWithRelations[]> => {
  try {
    // First, get all products
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId);
    }

    const { data: products, error: productsError } = await query;
    if (productsError) throw productsError;
    if (!products) return [];

    // Get all subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*');

    if (subcategoriesError) throw subcategoriesError;
    if (!subcategories) return [];

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) throw categoriesError;
    if (!categories) return [];

    // Combine the data
    return products.map(product => {
      const subcategory = subcategories.find(sub => sub.id === product.subcategory_id);
      const category = subcategory ? categories.find(cat => cat.id === subcategory.category_id) : null;

      return {
        ...product,
        subcategory: subcategory || { id: '', name: '', category_id: '' },
        category: category || { id: '', name: '' }
      };
    });
  } catch (error) {
    handleDatabaseError(error, 'fetching products');
    return [];
  }
};

export const getFeaturedProducts = async (limit: number = 4): Promise<ProductWithRelations[]> => {
  try {
    // Get featured products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) throw productsError;
    if (!products) return [];

    // Get all subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*');

    if (subcategoriesError) throw subcategoriesError;
    if (!subcategories) return [];

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) throw categoriesError;
    if (!categories) return [];

    // Combine the data
    return products.map(product => {
      const subcategory = subcategories.find(sub => sub.id === product.subcategory_id);
      const category = subcategory ? categories.find(cat => cat.id === subcategory.category_id) : null;

      return {
        ...product,
        subcategory: subcategory || { id: '', name: '', category_id: '' },
        category: category || { id: '', name: '' }
      };
    });
  } catch (error) {
    handleDatabaseError(error, 'fetching featured products');
    return [];
  }
};
