import { CartItem, Order, OrderItem } from '../types';
import { supabase } from '../supabase/client';

/**
 * Generate a unique order ID with format [YYMM][SEQUENCE]
 * YY = Year (last 2 digits)
 * MM = Month
 * SEQUENCE = 6-digit sequential number
 * Example: 2505000001 (First order in May 2025)
 */
export async function generateOrderId(): Promise<string> {
  const now = new Date();
  const yearMonth = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  try {
    // Call the database function to get next sequence
    const { data, error } = await supabase.rpc('increment_order_sequence');
    
    if (error) {
      console.error('Error incrementing sequence:', error);
      throw error;
    }
    
    // Format the sequence as a 6-digit number
    const sequenceFormatted = String(data).padStart(6, '0');
    
    // Combine yearMonth and sequence to form the orderID
    return `${yearMonth}${sequenceFormatted}`;
  } catch (error) {
    console.error('Error generating order ID:', error);
    // Fallback to a timestamp-based ID if database access fails
    const timestamp = now.getTime();
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${yearMonth}${randomDigits}${timestamp % 1000}`;
  }
}

/**
 * Format cart items into WhatsApp message
 */
export function formatWhatsAppMessage(order: Order): string {
  let message = `🛒 *NEW ORDER: ${order.id}*\n\n`;
  
  message += '*Order Items:*\n';
  
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.productName} (${item.quantity} x $${item.price.toFixed(2)}) = $${item.subtotal.toFixed(2)}\n`;
  });
  
  message += `\n*Total Amount: $${order.total.toFixed(2)}*\n`;
  message += `*Order Date: ${new Date(order.timestamp).toLocaleString()}*\n`;
  
  if (order.customerName) {
    message += `\n*Customer: ${order.customerName}*\n`;
  }
  
  if (order.customerPhone) {
    message += `*Phone: ${order.customerPhone}*\n`;
  }
  
  if (order.customerEmail) {
    message += `*Email: ${order.customerEmail}*\n`;
  }
  
  message += '\nThank you for your order!';
  
  return message;
}

/**
 * Prepare cart items for order
 */
export function prepareOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map(item => ({
    productId: item.product.id,
    productName: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity
  }));
}

/**
 * Create order object from cart
 */
export async function createOrderObject(
  cartItems: CartItem[], 
  totalPrice: number, 
  customerInfo?: { name?: string; email?: string; phone?: string }
): Promise<Order> {
  try {
    const orderId = await generateOrderId();
    const orderItems = prepareOrderItems(cartItems);
    
    return {
      id: orderId,
      items: orderItems,
      total: totalPrice,
      timestamp: new Date().toISOString(),
      customerName: customerInfo?.name || null,
      customerEmail: customerInfo?.email || null,
      customerPhone: customerInfo?.phone || null,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating order object:', error);
    throw error;
  }
}

/**
 * Send order to WhatsApp
 * @param order Order details
 * @param phoneNumber WhatsApp phone number to send to (with country code)
 * @returns URL for opening WhatsApp
 */
export function sendOrderToWhatsApp(order: Order, phoneNumber?: string): string {
  const message = formatWhatsAppMessage(order);
  const encodedMessage = encodeURIComponent(message);
  
  // If phone number is provided, use it, otherwise use the general WhatsApp link
  const whatsappUrl = phoneNumber 
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
    
  return whatsappUrl;
}

/**
 * Determine if we should use WhatsApp mobile or web version
 */
export function useIsMobile(): boolean {
  if (typeof window !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
}
