
import { supabase } from './supabase';
import { Product, ProductWithRelations } from './types';

export async function getProducts(subcategoryId?: string): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');
    
    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductsWithRelations(subcategoryId?: string): Promise<ProductWithRelations[]> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        subcategory:subcategory_id (
          *,
          category:category_id (*)
        )
      `);
    
    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the nested structure to match the ProductWithRelations type
    return (data || []).map(product => {
      const { subcategory, ...restProduct } = product;
      const { category, ...restSubcategory } = subcategory;
      
      return {
        ...restProduct,
        subcategory: restSubcategory,
        category
      };
    });
  } catch (error) {
    console.error('Error fetching products with relations:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}
