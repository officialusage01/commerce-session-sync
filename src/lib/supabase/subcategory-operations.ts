
import { supabase } from './client';
import { Subcategory } from './types';
import { handleDatabaseError, getLocalData, saveLocalData } from './db-utils';
import { defaultSubcategories } from './default-data';

export async function getSubcategories(categoryId: string | number): Promise<Subcategory[]> {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
      
    if (error) {
      handleDatabaseError(error, 'fetching subcategories');
      
      // Return filtered local data when the database request fails
      console.log('Using local subcategory data due to database error');
      const localData = getLocalData<Subcategory>('subcategories', defaultSubcategories)
        .filter(sub => String(sub.category_id) === String(categoryId));
      return localData;
    }
    
    if (data && data.length > 0) {
      // Cache all subcategories
      const { data: allSubs } = await supabase.from('subcategories').select('*');
      if (allSubs) {
        saveLocalData('subcategories', allSubs);
      }
      return data;
    } else {
      // Try local storage if no data found
      const localData = getLocalData<Subcategory>('subcategories', defaultSubcategories)
        .filter(sub => String(sub.category_id) === String(categoryId));
      
      // If we have local data, attempt to save it to Supabase
      if (localData.length > 0) {
        try {
          await supabase.from('subcategories').upsert(localData, { onConflict: 'id' });
        } catch (err) {
          console.log('Failed to synchronize local subcategories with Supabase', err);
        }
      }
      return localData;
    }
  } catch (error) {
    handleDatabaseError(error, 'fetching subcategories');
    return getLocalData<Subcategory>('subcategories', defaultSubcategories)
      .filter(sub => String(sub.category_id) === String(categoryId));
  }
}

export async function createSubcategory(subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>): Promise<Subcategory | null> {
  try {
    const subcategoryWithUpdatedAt = {
      ...subcategory,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('subcategories')
      .insert([subcategoryWithUpdatedAt])
      .select()
      .single();
      
    if (error) {
      handleDatabaseError(error, 'creating subcategory');
      
      // Fallback to local storage
      const localSubcategories = getLocalData<Subcategory>('subcategories', defaultSubcategories);
      const newId = `${Date.now()}`; // Generate string ID
      const newSubcategory = {
        ...subcategoryWithUpdatedAt,
        id: newId,
        created_at: new Date().toISOString()
      };
      
      localSubcategories.push(newSubcategory);
      saveLocalData('subcategories', localSubcategories);
      return newSubcategory;
    }
    
    // Update local storage
    if (data) {
      const localSubcategories = getLocalData<Subcategory>('subcategories', []);
      localSubcategories.push(data);
      saveLocalData('subcategories', localSubcategories);
    }
    
    return data;
  } catch (error) {
    handleDatabaseError(error, 'creating subcategory');
    return null;
  }
}

export async function updateSubcategory(id: string, updates: Partial<Omit<Subcategory, 'id' | 'created_at'>>): Promise<Subcategory | null> {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      handleDatabaseError(error, 'updating subcategory');
      
      // Fallback to local storage
      const localSubcategories = getLocalData<Subcategory>('subcategories', defaultSubcategories);
      const index = localSubcategories.findIndex(s => s.id === id);
      
      if (index !== -1) {
        localSubcategories[index] = {
          ...localSubcategories[index],
          ...updates
        };
        saveLocalData('subcategories', localSubcategories);
        return localSubcategories[index];
      }
      return null;
    }
    
    // Update local storage
    if (data) {
      const localSubcategories = getLocalData<Subcategory>('subcategories', []);
      const index = localSubcategories.findIndex(s => s.id === id);
      if (index !== -1) {
        localSubcategories[index] = data;
        saveLocalData('subcategories', localSubcategories);
      }
    }
    
    return data;
  } catch (error) {
    handleDatabaseError(error, 'updating subcategory');
    return null;
  }
}
