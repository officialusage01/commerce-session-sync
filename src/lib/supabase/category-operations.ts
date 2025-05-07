import { supabase } from './client';
import { handleDatabaseError } from './db-utils';

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export const getCategories = async (): Promise<CategoryWithSubcategories[]> => {
  try {
    // First, get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;
    if (!categories) return [];

    // Then, get all subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*')
      .order('name', { ascending: true });

    if (subcategoriesError) throw subcategoriesError;

    // Combine the data
    return categories.map(category => ({
      ...category,
      subcategories: subcategories?.filter(sub => sub.category_id === category.id) || []
    }));
  } catch (error) {
    handleDatabaseError(error, 'fetching categories');
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<CategoryWithSubcategories | null> => {
  try {
    // Get the category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (categoryError) throw categoryError;
    if (!category) return null;

    // Get its subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', id)
      .order('name', { ascending: true });

    if (subcategoriesError) throw subcategoriesError;

    return {
      ...category,
      subcategories: subcategories || []
    };
  } catch (error) {
    handleDatabaseError(error, 'fetching category by id');
    return null;
  }
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('You must be authenticated to create a category');
    }

    // First check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (checkError) {
      // If table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_categories_table');
      if (createError) {
        console.error('Error creating categories table:', createError);
        throw new Error(`Failed to create categories table: ${createError.message}`);
      }
    }

    // Now try to insert the category
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        icon: category.icon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      if (error.code === '23505') {
        throw new Error('A category with this name already exists');
      }
      if (error.message.includes('updated_at')) {
        // If the error is about updated_at, try to add the column
        const { error: alterError } = await supabase.rpc('create_categories_table');
        if (alterError) {
          console.error('Error adding updated_at column:', alterError);
          throw new Error('Failed to update categories table structure. Please contact support.');
        }
        // Try the insert again
        const { data: retryData, error: retryError } = await supabase
          .from('categories')
          .insert([{
            name: category.name,
            icon: category.icon,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (retryError) throw retryError;
        return retryData;
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after category creation');
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Category;
  } catch (error) {
    handleDatabaseError(error, 'updating category');
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    handleDatabaseError(error, 'deleting category');
    return false;
  }
};

export const getSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  try {
    // First check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('subcategories')
      .select('id')
      .limit(1);

    if (checkError) {
      // If table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_subcategories_table');
      if (createError) {
        console.error('Error creating subcategories table:', createError);
        throw new Error(`Failed to create subcategories table: ${createError.message}`);
      }
    }

    let query = supabase
      .from('subcategories')
      .select('*')
      .order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }

    return data as Subcategory[];
  } catch (error) {
    handleDatabaseError(error, 'fetching subcategories');
    return [];
  }
};

export const getSubcategoryById = async (id: number): Promise<Subcategory | null> => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Subcategory;
  } catch (error) {
    handleDatabaseError(error, 'fetching subcategory by id');
    return null;
  }
};

export const createSubcategory = async (subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>): Promise<Subcategory | null> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('You must be authenticated to create a subcategory');
    }

    // First check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('subcategories')
      .select('id')
      .limit(1);

    if (checkError) {
      // If table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_subcategories_table');
      if (createError) {
        console.error('Error creating subcategories table:', createError);
        throw new Error(`Failed to create subcategories table: ${createError.message}`);
      }
    }

    // Now try to insert the subcategory
    const { data, error } = await supabase
      .from('subcategories')
      .insert([{
        name: subcategory.name,
        category_id: subcategory.category_id,
        icon: subcategory.icon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating subcategory:', error);
      if (error.code === '23505') {
        throw new Error('A subcategory with this name already exists in this category');
      }
      throw error;
    }

    return data as Subcategory;
  } catch (error) {
    handleDatabaseError(error, 'creating subcategory');
    return null;
  }
};

export const updateSubcategory = async (id: number, subcategory: Partial<Subcategory>): Promise<Subcategory | null> => {
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
    handleDatabaseError(error, 'updating subcategory');
    return null;
  }
};

export const deleteSubcategory = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    handleDatabaseError(error, 'deleting subcategory');
    return false;
  }
};
