import { supabase } from './client';
import { handleDatabaseError } from './db-utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  subcategory_id: string;
  stock: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductWithRelations extends Product {
  subcategory: Subcategory;
  category: Category;
}

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

export const getProductById = async (id: string): Promise<ProductWithRelations | null> => {
  try {
    // Get the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) throw productError;
    if (!product) return null;

    // Get its subcategory
    const { data: subcategory, error: subcategoryError } = await supabase
      .from('subcategories')
      .select('*')
      .eq('id', product.subcategory_id)
      .single();

    if (subcategoryError) throw subcategoryError;
    if (!subcategory) return null;

    // Get the category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', subcategory.category_id)
      .single();

    if (categoryError) throw categoryError;
    if (!category) return null;

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
    const { data, error } = await supabase
      .from('products')
      .update(product)
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

export const getProduct = async (id: string): Promise<ProductWithRelations | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        subcategory:subcategories (
          id,
          name,
          category_id
        ),
        category:subcategories!inner (
          categories!inner (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return data as ProductWithRelations;
  } catch (error) {
    handleDatabaseError(error, 'fetching product');
    return null;
  }
};
