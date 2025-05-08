
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  icon?: string; // Added icon field that's used in various components
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  icon?: string; // Added icon field that's used in various components
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  subcategory_id: string;
  image_urls: string[];
  created_at: string;
  updated_at?: string;
  featured?: boolean;
  sku?: string;
  rating?: number;
  images?: string[]; // Added images field that's used in components
}

export interface ProductWithRelations extends Product {
  subcategory: Subcategory;
  category: Category;
}

// Add common types used throughout the application
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  url?: string; // Added url field used in various components
  original_filename: string;
  product_id?: string | number; // Added for compatibility with existing code
}

// Add FilterOptions type that's referenced in components
export interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}
