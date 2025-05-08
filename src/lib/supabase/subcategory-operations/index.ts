
import { supabase } from '../supabase';
import { Subcategory } from '../types';

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  try {
    let query = supabase
      .from('subcategories')
      .select('*')
      .order('name');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export async function createSubcategory(subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>): Promise<Subcategory | null> {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([subcategory])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Subcategory;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return null;
  }
}

export async function updateSubcategory(id: string, subcategory: Partial<Subcategory>): Promise<Subcategory | null> {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(subcategory)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Subcategory;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return null;
  }
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
}
