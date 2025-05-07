
export interface CartItem {
  id: string;
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
    images?: string[];
    stock: number;
  };
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
