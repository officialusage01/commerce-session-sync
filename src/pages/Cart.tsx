
import React, { useState } from 'react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderProvider } from '@/lib/checkout/order-context';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Config - Store this in environment variables in a real app
  const whatsappPhone = '1234567890'; // Replace with your WhatsApp business number
  
  const handleCheckoutSuccess = () => {
    setOrderPlaced(true);
    window.scrollTo(0, 0);
  };
  
  const handleCloseConfirmation = () => {
    setOrderPlaced(false);
  };
  
  return (
    <OrderProvider>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Continue Shopping
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {orderPlaced ? (
          <OrderConfirmation onClose={handleCloseConfirmation} />
        ) : (
          <>
            {items.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Add some products to your cart to proceed with checkout.</p>
                <Button asChild>
                  <Link to="/">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Cart Items ({totalItems})</h2>
                      <div className="divide-y">
                        {items.map(item => (
                          <div key={item.id} className="py-4 flex items-center">
                            <img 
                              src={item.product.images?.[0] || '/placeholder.svg'} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            
                            <div className="flex-grow">
                              <h3 className="font-medium">{item.product.name}</h3>
                              <p className="text-gray-500 text-sm">Price: ${item.product.price.toFixed(2)}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                +
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2"
                              >
                                &times;
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2 mb-6">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <CheckoutButton 
                      whatsappPhone={whatsappPhone}
                      className="w-full"
                      onCheckoutSuccess={handleCheckoutSuccess}
                    />
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      By checking out, your order details will be sent via WhatsApp for processing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </OrderProvider>
  );
};

export default CartPage;
