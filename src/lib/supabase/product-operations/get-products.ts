
import { supabase } from '../client';
import { handleDatabaseError } from '../db-utils';
import { ProductWithRelations } from './types';

// Simple cache for products
const productsCache: {
  data: ProductWithRelations[] | null,
  timestamp: number,
  subcategoryId?: string
} = {
  data: null,
  timestamp: 0
};

// Simple cache for subcategories and categories
const subcategoriesCache: any[] = [];
const categoriesCache: any[] = [];

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const getProducts = async (subcategoryId?: string): Promise<ProductWithRelations[]> => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (
      productsCache.data && 
      productsCache.subcategoryId === subcategoryId && 
      now - productsCache.timestamp < CACHE_EXPIRATION
    ) {
      console.log('Using cached products data');
      return productsCache.data;
    }
    
    console.log('Fetching products from database');
    // First, get all products
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId);
    }

    const { data: products, error: productsError } = await query;
    if (productsError) {
      console.error('Database error fetching products:', productsError);
      throw productsError;
    }
    if (!products) return [];

    // Get all subcategories (use cache if available)
    let subcategories = subcategoriesCache;
    if (subcategories.length === 0) {
      console.log('Fetching subcategories from database');
      const { data, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*');

      if (subcategoriesError) {
        console.error('Database error fetching subcategories:', subcategoriesError);
        throw subcategoriesError;
      }
      if (data) {
        subcategories = data;
        // Update cache
        subcategoriesCache.push(...data);
      }
    }

    // Get all categories (use cache if available)
    let categories = categoriesCache;
    if (categories.length === 0) {
      console.log('Fetching categories from database');
      const { data, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Database error fetching categories:', categoriesError);
        throw categoriesError;
      }
      if (data) {
        categories = data;
        // Update cache
        categoriesCache.push(...data);
      }
    }

    // Combine the data
    const productsWithRelations = products.map(product => {
      const subcategory = subcategories.find(sub => sub.id === product.subcategory_id);
      const category = subcategory ? categories.find(cat => cat.id === subcategory.category_id) : null;

      return {
        ...product,
        subcategory: subcategory || { id: '', name: '', category_id: '', icon: '', created_at: '', updated_at: '' },
        category: category || { id: '', name: '', icon: '', created_at: '', updated_at: '' }
      };
    });

    // Update cache
    productsCache.data = productsWithRelations;
    productsCache.timestamp = now;
    productsCache.subcategoryId = subcategoryId;

    return productsWithRelations;
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

    if (productsError) {
      console.error('Database error fetching featured products:', productsError);
      throw productsError;
    }
    if (!products) return [];

    // Reuse subcategories and categories from cache if available
    let subcategories = subcategoriesCache;
    if (subcategories.length === 0) {
      const { data, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*');

      if (subcategoriesError) {
        console.error('Database error fetching subcategories for featured products:', subcategoriesError);
        throw subcategoriesError;
      }
      if (data) {
        subcategories = data;
        subcategoriesCache.push(...data);
      }
    }

    let categories = categoriesCache;
    if (categories.length === 0) {
      const { data, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Database error fetching categories for featured products:', categoriesError);
        throw categoriesError;
      }
      if (data) {
        categories = data;
        categoriesCache.push(...data);
      }
    }

    // Combine the data
    return products.map(product => {
      const subcategory = subcategories.find(sub => sub.id === product.subcategory_id);
      const category = subcategory ? categories.find(cat => cat.id === subcategory.category_id) : null;

      return {
        ...product,
        subcategory: subcategory || { id: '', name: '', category_id: '', icon: '', created_at: '', updated_at: '' },
        category: category || { id: '', name: '', icon: '', created_at: '', updated_at: '' }
      };
    });
  } catch (error) {
    handleDatabaseError(error, 'fetching featured products');
    return [];
  }
};
