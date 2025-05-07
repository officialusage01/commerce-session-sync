
import { CartItem, Order, OrderItem } from '../types';

/**
 * Generate a unique order ID
 */
export function generateOrderId(): string {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
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
export function createOrderObject(
  cartItems: CartItem[], 
  totalPrice: number, 
  customerInfo?: { name?: string; email?: string; phone?: string }
): Order {
  const orderId = generateOrderId();
  const orderItems = prepareOrderItems(cartItems);
  
  return {
    id: orderId,
    items: orderItems,
    total: totalPrice,
    timestamp: new Date().toISOString(),
    customerName: customerInfo?.name,
    customerEmail: customerInfo?.email,
    customerPhone: customerInfo?.phone,
    status: 'pending'
  };
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
