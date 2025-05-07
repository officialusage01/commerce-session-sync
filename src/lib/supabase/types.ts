export type Category = {
  id: string;  // UUID
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type Subcategory = {
  id: string;  // UUID
  name: string;
  category_id: string;  // UUID
  icon: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;  // UUID
  name: string;
  description: string;
  price: number;
  subcategory_id: string;  // UUID
  stock: number;
  images: string[];
  created_at: string;
  updated_at: string;
};

export interface CloudinaryImage {
  id: number;
  url: string;
  public_id?: string;
  filename?: string;
  format?: string;
  resource_type?: string;
  created_at?: string;
  product_id: number;
}
