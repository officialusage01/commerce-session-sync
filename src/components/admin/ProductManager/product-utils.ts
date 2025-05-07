
import { Product, createProduct, updateProduct } from '@/lib/supabase';

export function validateProduct(product: Partial<Product>, subcategoryId: number | null): { valid: boolean; message: string } {
  if (!product.name || product.name.trim() === '') {
    return { valid: false, message: 'Product name is required' };
  }
  
  if (!product.description || product.description.trim() === '') {
    return { valid: false, message: 'Product description is required' };
  }
  
  if (product.price === undefined || product.price < 0) {
    return { valid: false, message: 'Product price must be a positive number' };
  }
  
  if (product.stock === undefined || product.stock < 0) {
    return { valid: false, message: 'Product stock must be a non-negative number' };
  }
  
  if (!subcategoryId) {
    return { valid: false, message: 'Please select a subcategory' };
  }
  
  return { valid: true, message: '' };
}

export async function saveProduct(
  product: Partial<Product>, 
  subcategoryId: number,
  isEditing: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    // Make sure subcategory_id is set
    const productData = {
      ...product,
      subcategory_id: subcategoryId
    };
    
    let result;
    
    if (isEditing && product.id) {
      // Update existing product
      const { id, created_at, ...updates } = productData as Product;
      result = await updateProduct(id, updates);
    } else {
      // Create new product
      const { id, created_at, ...newProduct } = productData as Product;
      result = await createProduct(newProduct);
    }
    
    if (!result) {
      throw new Error('Operation failed');
    }
    
    return { 
      success: true, 
      message: isEditing ? 'Product updated successfully' : 'Product created successfully' 
    };
  } catch (error) {
    console.error('Error saving product:', error);
    return { 
      success: false, 
      message: `Failed to ${isEditing ? 'update' : 'create'} product: ${(error as Error).message}` 
    };
  }
}
