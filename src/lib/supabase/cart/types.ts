
import { Product } from '../types';

export interface CartItemDB {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products: Product;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}
