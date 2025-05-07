
import { supabase } from './supabase';
import { Order } from '../types';

/**
 * Create a new order in the Supabase database
 */
export async function createOrder(order: Order): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return null;
  }
}

/**
 * Retrieve all orders from the Supabase database
 * with optional pagination
 */
export async function getOrders(page = 1, limit = 10): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data as Order[];
  } catch (error) {
    console.error('Unexpected error fetching orders:', error);
    return [];
  }
}

/**
 * Retrieve a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error('Unexpected error fetching order:', error);
    return null;
  }
}

/**
 * Update an order's status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating order status:', error);
    return false;
  }
}
