
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useOrder } from '@/lib/checkout/order-context';
import { createOrderObject, sendOrderToWhatsApp, useIsMobile } from '@/lib/checkout/whatsapp-service';
import { createOrder } from '@/lib/supabase/orders';
import { toast } from "sonner";
import { CartItem as LibCartItem } from '@/lib/cart/types';
import { CartItem as TypeCartItem, Order } from '@/lib/types';

interface CheckoutButtonProps {
  whatsappPhone?: string;
  className?: string;
  onCheckoutSuccess?: (orderId: string) => void;
}

// Function to convert between cart item types
const convertCartItems = (items: LibCartItem[]): TypeCartItem[] => {
  return items.map(item => ({
    id: item.id,
    product: {
      id: Number(item.product.id) || 0,
      name: item.product.name,
      price: item.product.price,
      description: item.product.description || '',
      images: item.product.images || [],
      stock: item.product.stock
    },
    quantity: item.quantity
  }));
};

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  whatsappPhone,
  className = '',
  onCheckoutSuccess
}) => {
  const { items, totalItems, totalPrice, checkout } = useCart();
  const { setCurrentOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Starting checkout process...");
      
      // Convert cart items to the expected format
      const convertedItems = convertCartItems(items);
      console.log("Converted items:", convertedItems);
      
      // Create the order object (now async)
      const order = await createOrderObject(convertedItems, totalPrice);
      console.log("Created order object:", order);
      
      // Fix potential undefined values that could cause database issues
      const orderToSave: Order = {
        id: order.id, // Ensure ID is correctly passed
        items: order.items.map(item => ({
          productId: typeof item.productId === 'string' ? parseInt(item.productId, 10) : item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        total: order.total,
        timestamp: new Date().toISOString(),
        customerName: order.customerName && typeof order.customerName === 'object' ? null : order.customerName,
        customerEmail: order.customerEmail && typeof order.customerEmail === 'object' ? null : order.customerEmail,
        customerPhone: order.customerPhone && typeof order.customerPhone === 'object' ? null : order.customerPhone,
        status: 'pending'
      };
      
      console.log("Order to save:", orderToSave);
      
      // Save order to Supabase
      const savedOrder = await createOrder(orderToSave);
      console.log("Saved order response:", savedOrder);
      
      if (!savedOrder) {
        throw new Error("Failed to save order");
      }
      
      // Set the current order in context for session storage
      setCurrentOrder(savedOrder);
      
      // Execute local checkout logic (update stock, clear cart)
      await checkout();
      
      // Generate WhatsApp URL
      const whatsappUrl = sendOrderToWhatsApp(savedOrder, whatsappPhone);
      
      // Open WhatsApp in new window
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast.success(`Order ${savedOrder.id} placed successfully!`);
      
      // Call the success callback if provided
      if (onCheckoutSuccess) {
        onCheckoutSuccess(savedOrder.id);
      }
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to complete checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Button
      className={className}
      onClick={handleCheckout}
      disabled={isProcessing || items.length === 0}
    >
      {isProcessing ? 'Processing...' : `Checkout ${totalItems > 0 ? `(${totalItems})` : ''}`}
    </Button>
  );
};

export default CheckoutButton;
