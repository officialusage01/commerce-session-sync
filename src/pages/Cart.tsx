
import React, { useState } from 'react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, checkout } = useCart();
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setProcessingCheckout(true);
      
      // Process checkout
      await checkout();
      
      // Show success message
      toast.success("Your order has been placed successfully!");
      
      // Redirect to home page after successful checkout
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to complete checkout");
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button onClick={() => navigate('/search')} className="min-w-[200px]">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="font-semibold text-xl mb-4">Items ({totalItems})</h2>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 relative rounded overflow-hidden bg-muted">
                      <img 
                        src={item.product.images?.[0] || '/placeholder.svg'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-1">
                        Price: {formatCurrency(item.product.price)}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border rounded-md mr-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      {item.quantity > item.product.stock && (
                        <div className="text-xs text-destructive mt-1 flex items-center justify-end">
                          <AlertCircle size={12} className="mr-1" />
                          Only {item.product.stock} available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
            <h2 className="font-semibold text-xl mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={handleCheckout}
              disabled={processingCheckout || items.some(item => item.quantity > item.product.stock)}
            >
              {processingCheckout ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>Checkout</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => navigate('/search')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
