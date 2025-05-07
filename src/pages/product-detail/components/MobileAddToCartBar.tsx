
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart'; // Updated import path
import { toast } from "sonner";
import { ProductWithRelations } from '@/lib/supabase/product-operations';

interface MobileAddToCartBarProps {
  product: ProductWithRelations;
}

const MobileAddToCartBar = ({ product }: MobileAddToCartBarProps) => {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  
  // Only render on mobile
  if (!isMobile) return null;
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, 1);
      toast("Item added to cart", {
        description: `${product.name} has been added to your cart.`,
        position: "bottom-right"
      });
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between z-10 animate-slide-up">
      <div>
        <p className="font-medium">${product.price.toFixed(2)}</p>
        <p className={`text-xs ${
          product.stock > 5 
            ? 'text-green-600' 
            : product.stock > 0 
              ? 'text-amber-600' 
              : 'text-red-500'
        }`}>
          {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
        </p>
      </div>
      <Button 
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="px-6"
      >
        <ShoppingCart size={18} className="mr-2" />
        Add to Cart
      </Button>
    </div>
  );
};

export default MobileAddToCartBar;
