
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useOrder } from '@/lib/checkout/order-context';
import { createOrderObject, sendOrderToWhatsApp, useIsMobile } from '@/lib/checkout/whatsapp-service';
import { createOrder } from '@/lib/supabase/orders';
import { toast } from "sonner";

interface CheckoutButtonProps {
  whatsappPhone?: string;
  className?: string;
  onCheckoutSuccess?: (orderId: string) => void;
}

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
      // Create the order object
      const order = createOrderObject(items, totalPrice);
      
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
