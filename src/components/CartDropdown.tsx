
import React, { useState, useRef } from 'react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export function CartDropdown() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, checkout, isLoading } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [processingItems, setProcessingItems] = useState<Record<string, boolean>>({});
  const processingAction = useRef(false);

  const handleCheckout = async () => {
    if (processingAction.current) return;
    processingAction.current = true;
    
    try {
      // First handle the checkout to update stock in the database
      await checkout();
      
      // Close dropdown after checkout
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
        
        toast.success('Order processed successfully');
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
        toast('Failed to open WhatsApp. Your order was processed.');
      }
    } finally {
      processingAction.current = false;
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (processingItems[itemId]) return;
    
    setProcessingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await updateQuantity(itemId, quantity);
    } finally {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (processingItems[itemId]) return;
    
    setProcessingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await removeFromCart(itemId);
    } finally {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <h3 className="font-semibold mb-4">Your Cart ({totalItems} items)</h3>
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading cart...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Your cart is empty</p>
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
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={processingItems[item.id] || item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={processingItems[item.id] || item.quantity >= item.product.stock}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={processingItems[item.id]}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
