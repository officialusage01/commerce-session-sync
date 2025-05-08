
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useCart } from '@/lib/cart';
import { ProductWithRelations } from '@/lib/supabase/product-operations/types';

interface ProductActionSectionProps {
  product: ProductWithRelations;
}

const ProductActionSection = ({ product }: ProductActionSectionProps) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Add to cart handler with debounce to prevent multiple clicks
  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1);
      toast.success("Item added to cart", {
        description: `${product.name} has been added to your cart.`,
        position: "bottom-right"
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      // Add a slight delay before allowing another click
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };
  
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
      <Button
        onClick={handleAddToCart}
        disabled={product.stock <= 0 || isAddingToCart}
        className="flex-1 h-12 text-base transition-all hover:scale-105"
      >
        {isAddingToCart ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart size={20} className="mr-2" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </>
        )}
      </Button>
    </div>
  );
};

export default ProductActionSection;
