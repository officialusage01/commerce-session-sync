
import { Category, Subcategory } from './types';

// Default data for local storage fallback
export const defaultCategories: Category[] = [
  { id: "1", name: 'Electronics', icon: 'laptop', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", name: 'Fashion', icon: 'shirt', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", name: 'Home & Kitchen', icon: 'sofa', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", name: 'Pets', icon: 'cat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const defaultSubcategories: Subcategory[] = [
  { id: "1", name: 'Laptops', category_id: "1", icon: 'laptop', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", name: 'Smartphones', category_id: "1", icon: 'smartphone', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", name: 'Accessories', category_id: "1", icon: 'headphones', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", name: 'Men\'s Clothing', category_id: "2", icon: 'shirt', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "5", name: 'Women\'s Clothing', category_id: "2", icon: 'dress', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "6", name: 'Shoes', category_id: "2", icon: 'boot', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "7", name: 'Furniture', category_id: "3", icon: 'sofa', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "8", name: 'Kitchen', category_id: "3", icon: 'kitchen-pot', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "9", name: 'Decor', category_id: "3", icon: 'lamp', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "10", name: 'Cat Supplies', category_id: "4", icon: 'cat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "11", name: 'Dog Supplies', category_id: "4", icon: 'dog', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "12", name: 'Pet Food', category_id: "4", icon: 'bowl-food', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
