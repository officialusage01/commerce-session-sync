
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { getProductRatingStats } from '@/lib/supabase/product-feedback';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const stats = await getProductRatingStats(product.id);
        if (stats) {
          setAverageRating(Number(stats.average_rating) || 0);
          setTotalReviews(Number(stats.total_reviews) || 0);
        }
      } catch (error) {
        console.error('Error loading rating stats:', error);
      }
    };
    
    loadRatingStats();
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast({
        title: "Cannot add to cart",
        description: "This product is out of stock",
        variant: "destructive"
      });
      return;
    }
    
    addToCart(product.id, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const productUrl = `/product/${product.id}`;
  
  // Get product image with fallback
  const imageSrc = (product.images?.length > 0 && !imageError)
    ? product.images[0]
    : '/placeholder.svg';
  
  // Display out of stock badge if stock is 0
  const isOutOfStock = product.stock === 0;
  
  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-card animate-fade-in group">
      {/* Product image - full width on mobile, fixed width on desktop */}
      <Link to={productUrl} className="w-full sm:w-32 h-32 relative overflow-hidden flex-shrink-0">
        <img 
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </Link>
      
      {/* Product details - stacked on mobile, side by side on desktop */}
      <div className="flex flex-col flex-1 p-4">
        {/* Mobile price and stock badge shown at the top on mobile */}
        <div className="flex justify-between items-center mb-2 sm:hidden">
          <div className="font-semibold text-primary">{formatCurrency(product.price)}</div>
          <div className="text-xs px-2 py-1 rounded bg-gray-100">
            {isOutOfStock ? (
              <span className="text-destructive font-medium">Out of Stock</span>
            ) : (
              <span className="text-green-600">{product.stock} in stock</span>
            )}
          </div>
        </div>

        {/* Product info and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <Link to={productUrl} className="font-medium text-lg hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </Link>
            
            {totalReviews > 0 && (
              <div className="flex items-center mt-1 gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-4 w-4 ${
                        rating <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({totalReviews})
                </span>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 max-w-2xl">
              {product.description}
            </p>
            
            {/* Stock info - visible only on desktop */}
            <div className="mt-2 text-xs text-muted-foreground hidden sm:block">
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Currently unavailable</span>
              ) : (
                `In stock: ${product.stock} units`
              )}
            </div>
          </div>
          
          {/* Price and CTA - stacked in desktop view, hidden in mobile view (shown at top instead) */}
          <div className="hidden sm:flex flex-col items-end gap-3 min-w-[120px]">
            <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
            
            <Button 
              size="sm" 
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex items-center gap-1 px-3"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>

        {/* Mobile Add to Cart button - full width on mobile only */}
        <div className="mt-3 sm:hidden">
          <Button 
            size="sm" 
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
