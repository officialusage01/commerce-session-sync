
import { supabase } from '../client';
import { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Database error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Database error creating category:', error);
      throw error;
    }
    
    return data as Category;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Database error updating category:', error);
      throw error;
    }
    
    return data as Category;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Database error deleting category:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}
