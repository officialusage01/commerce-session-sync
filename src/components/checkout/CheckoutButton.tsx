
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useOrder } from '@/lib/checkout/order-context';
import { createOrderObject, sendOrderToWhatsApp, useIsMobile } from '@/lib/checkout/whatsapp-service';
import { createOrder } from '@/lib/supabase/orders';
import { toast } from "sonner";
import { CartItem as LibCartItem } from '@/lib/cart/types';
import { CartItem as TypeCartItem } from '@/lib/types';

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
      id: Number(item.product.id) || 0, // Convert string id to number or use 0 as fallback
      name: item.product.name,
      price: item.product.price,
      description: item.product.description,
      images: item.product.images,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Convert cart items to the expected format
      const convertedItems = convertCartItems(items);
      
      // Create the order object
      const order = createOrderObject(convertedItems, totalPrice);
      
      // Save order to Supabase
      const savedOrder = await createOrder(order);
      
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
