
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
  public_id?: string; // Made optional
  secure_url?: string; // Made optional
  url?: string; // Url can be used as alternative to secure_url
  original_filename?: string; // Made optional
  product_id?: string | number;
  id?: string | number; // Added id field used in components
}

// Add FilterOptions type that's referenced in components
export interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
  filterCount?: number; // Added filter count used in components
}
