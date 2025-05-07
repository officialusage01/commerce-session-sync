
import { Product } from '../supabase/product-operations';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  // Additional properties to make the components work
  name?: string;
  price?: number;
  image?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}
