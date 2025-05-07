
import { supabase } from './client';
import { Order } from '../types';

/**
 * Create a new order in the Supabase database
 */
export async function createOrder(order: Order): Promise<Order | null> {
  try {
    console.log("Creating order in database:", order);
    
    // Prepare the order object for database insertion
    const orderData = {
      id: order.id, // Make sure we're explicitly including the ID
      items: order.items,
      total: order.total,
      timestamp: order.timestamp || new Date().toISOString(),
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      status: order.status || 'pending'
    };

    console.log("Prepared order data:", orderData);

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    console.log("Order created successfully:", data);

    // Map database response to Order type
    return {
      id: data.id,
      items: data.items,
      total: data.total,
      timestamp: data.timestamp,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      status: data.status
    } as Order;
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

    // Map database response to Order type
    return data.map(order => ({
      id: order.id,
      items: order.items,
      total: order.total,
      timestamp: order.timestamp,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      status: order.status
    })) as Order[];
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

    // Map database response to Order type
    return {
      id: data.id,
      items: data.items,
      total: data.total,
      timestamp: data.timestamp,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      status: data.status
    } as Order;
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
