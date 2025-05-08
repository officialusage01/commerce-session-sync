
import { CartItem } from '../types';

export interface CartOperationsState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

export interface CartOperationsActions {
  setItems: (items: CartItem[] | ((prevItems: CartItem[]) => CartItem[])) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface CartOperationsResult extends CartOperationsState {
  setItems: (items: CartItem[] | ((prevItems: CartItem[]) => CartItem[])) => void;
  initializeCart: () => Promise<void>;
  handleAddToCart: (productId: string, quantity?: number) => Promise<void>;
  handleRemoveFromCart: (itemId: string) => Promise<void>;
  handleUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  handleClearCart: () => Promise<void>;
  handleCheckout: () => Promise<void>;
}
