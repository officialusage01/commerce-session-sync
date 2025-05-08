
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
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
}

export interface ProductWithRelations extends Product {
  subcategory: Subcategory;
  category: Category;
}
