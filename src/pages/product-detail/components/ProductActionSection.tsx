
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useCart } from '@/lib/cart'; // Updated import path
import { ProductWithRelations } from '@/lib/supabase/product-operations';

interface ProductActionSectionProps {
  product: ProductWithRelations;
}

const ProductActionSection = ({ product }: ProductActionSectionProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Add to cart handler
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
    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
      <Button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="flex-1 h-12 text-base transition-all hover:scale-105"
      >
        <ShoppingCart size={20} className="mr-2" />
        Add to Cart
      </Button>
      
      {/* Buy Now button removed as requested */}
    </div>
  );
};

export default ProductActionSection;
