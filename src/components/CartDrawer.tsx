
import React, { useState } from 'react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, checkout, isLoading } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleCheckout = async () => {
    // First handle the checkout to update stock in the database
    await checkout();
    
    // Close the drawer after successful checkout
    setIsOpen(false);
    
    // Generate the order summary message
    const message = items.map(item => 
      `${item.product.name} (${item.quantity} x $${item.product.price})`
    ).join('\n') + `\n\nTotal: $${totalPrice}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    try {
      // Use different URLs for mobile and desktop
      const whatsappUrl = isMobile
        ? `https://wa.me/?text=${encodedMessage}`
        : `https://web.whatsapp.com/send?text=${encodedMessage}`;
      
      // Open in a new window
      window.open(whatsappUrl, '_blank');
      
      toast('Order processed successfully');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast('Failed to open WhatsApp. Your order was processed.');
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Your Cart ({totalItems} items)</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading cart...</p>
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.product.images?.[0] || '/placeholder.svg'} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= item.product.stock}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleCheckout}
                    disabled={isLoading || items.length === 0}
                  >
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
